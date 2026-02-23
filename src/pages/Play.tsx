import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Circuit } from '../engine/Circuit';
import { GateType } from '../engine/types';
import { Simulator } from '../engine/Simulator';
import { levels } from '../levels/levels/index';
import type { LevelResult } from '../levels/Level';
import { LevelRunner } from '../levels/LevelRunner';
import {
  saveCircuit,
  loadCircuit,
  completeLevel,
  isLevelUnlocked,
  isLevelCompleted,
  clearOutOfOrderProgress,
} from '../save/SaveManager';
import Canvas from '../editor/Canvas';
import Toolbar from '../editor/Toolbar';
import { soundManager } from '../editor/SoundManager';

function createInitialCircuit(
  levelId: string,
  levelInputs: { name: string }[],
  levelOutputs: { name: string }[],
): Circuit {
  const saved = loadCircuit(levelId);
  if (saved) {
    try {
      return Circuit.deserialize(saved);
    } catch {
      // corrupted save, create fresh
    }
  }

  const circuit = new Circuit();
  const inputSpacing = 80;
  const outputSpacing = 80;

  levelInputs.forEach((pin, i) => {
    circuit.addGate(
      GateType.INPUT,
      { x: 60, y: 80 + i * inputSpacing },
      pin.name,
    );
  });

  levelOutputs.forEach((pin, i) => {
    circuit.addGate(
      GateType.OUTPUT,
      { x: 500, y: 80 + i * outputSpacing },
      pin.name,
    );
  });

  return circuit;
}

// Particle colors for success effect
const PARTICLE_COLORS = ['#22c55e', '#6366f1', '#eab308', '#ef4444', '#06b6d4', '#a855f7'];

function SuccessParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = 60 + Math.random() * 100;
      const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length]!;
      const size = 4 + Math.random() * 5;
      const delay = Math.random() * 0.2;
      return { angle, dist, color, size, delay };
    });
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className="success-particle"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            left: '50%',
            top: '50%',
            animationDelay: `${p.delay}s`,
            transform: `translate(${Math.cos(p.angle) * p.dist}px, ${Math.sin(p.angle) * p.dist}px)`,
          }}
        />
      ))}
    </>
  );
}

function ShortcutsBar() {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('tc-shortcuts-collapsed') === '1'; } catch { return false; }
  });

  const toggle = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem('tc-shortcuts-collapsed', next ? '1' : '0'); } catch { /* */ }
      return next;
    });
  }, []);

  const shortcuts = [
    ['Ctrl+Z', 'Undo'],
    ['Ctrl+Shift+Z', 'Redo'],
    ['Delete', 'Delete'],
    ['Ctrl+C', 'Copy'],
    ['Ctrl+V', 'Paste'],
    ['Esc', 'Cancel'],
    ['Right-click', 'Radial menu'],
    ['Space+Drag', 'Pan'],
    ['Scroll', 'Zoom'],
    ['Dbl-click', 'Reset zoom'],
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={toggle}
        style={{
          position: 'absolute',
          right: 8,
          top: collapsed ? -18 : 1,
          background: '#12121f',
          border: '1px solid #2d2d44',
          borderBottom: collapsed ? undefined : 'none',
          borderRadius: collapsed ? '4px 4px 0 0' : '0',
          color: '#4a4a6a',
          fontSize: '9px',
          fontFamily: 'monospace',
          padding: '1px 6px',
          cursor: 'pointer',
          zIndex: 1,
        }}
      >
        {collapsed ? '⌨ Shortcuts' : '▾ Hide'}
      </button>
      <div className={`shortcuts-bar${collapsed ? ' shortcuts-bar--collapsed' : ''}`}>
        {shortcuts.map(([key, desc]) => (
          <span key={key}>
            <span className="shortcut-key">{key}</span>
            {' '}{desc}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Play() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const level = levels.find((l) => l.id === levelId);

  // Clean up any save data for levels completed out of order (one-time per mount)
  const cleanedRef = useRef(false);
  if (!cleanedRef.current) {
    clearOutOfOrderProgress(levels);
    cleanedRef.current = true;
  }

  // Block access to locked levels
  const locked = level !== undefined && !isLevelUnlocked(level.id, levels);

  const circuitRef = useRef<Circuit | null>(null);
  if (!circuitRef.current && level && !locked) {
    circuitRef.current = createInitialCircuit(
      level.id,
      level.inputs,
      level.outputs,
    );
  }

  const [selectedTool, setSelectedTool] = useState<GateType | null>(null);
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<LevelResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [simulationResult, setSimulationResult] = useState<Map<
    string,
    boolean
  > | null>(null);
  const [renderVersion, setRenderVersion] = useState(0);
  const [wireColor, setWireColor] = useState('green');
  const [loading, setLoading] = useState(true);
  const [failFlash, setFailFlash] = useState(false);

  // Called by Interaction when tool changes (e.g. single-placement auto-reset)
  const handleToolChange = useCallback((tool: GateType | null) => {
    setSelectedTool(tool);
  }, []);

  // Compute unlocked compound components from completed levels.
  // Depends on verifyResult to recompute after level completion (which calls completeLevel).
  const unlockedComponents = useMemo(() => {
    const components: GateType[] = [];
    for (const l of levels) {
      if (l.unlocksComponent && isLevelCompleted(l.id)) {
        components.push(l.unlocksComponent.gateType);
      }
    }
    return components;
  }, [verifyResult]);

  // Count non-I/O gates
  const gateCount = useMemo(() => {
    if (!circuitRef.current) return 0;
    return circuitRef.current.getGates().filter(
      g => g.type !== GateType.INPUT && g.type !== GateType.OUTPUT
    ).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderVersion]);

  // Brief loading state to prevent white flash
  useEffect(() => {
    const t = requestAnimationFrame(() => setLoading(false));
    return () => cancelAnimationFrame(t);
  }, []);

  if (!level) return <Navigate to="/levels" replace />;
  if (locked) return <Navigate to="/levels" replace />;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0f0f1a',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="pcb-spinner" style={{ margin: '0 auto 16px' }} />
          <div style={{ color: '#4a4a6a', fontFamily: 'monospace', fontSize: '12px' }}>
            Loading circuit...
          </div>
        </div>
      </div>
    );
  }

  const handleCircuitChange = () => {
    if (!level || !circuitRef.current) return;
    saveCircuit(level.id, circuitRef.current.serialize());
    setRenderVersion((n) => n + 1);

    try {
      const inputGates = circuitRef.current
        .getGates()
        .filter((g) => g.type === GateType.INPUT);
      const inputsMap = new Map<string, boolean>();
      for (const ig of inputGates) {
        const outPin = ig.outputs[0];
        if (outPin) {
          inputsMap.set(outPin.id, outPin.value ?? false);
        }
      }
      const result = new Simulator().simulate(circuitRef.current, inputsMap);
      setSimulationResult(result);
    } catch {
      setSimulationResult(null);
    }
  };

  const handleVerify = () => {
    if (!level || !circuitRef.current) return;
    const runner = new LevelRunner();
    const result = runner.run(level, circuitRef.current);
    setVerifyResult(result);
    if (result.passed) {
      completeLevel(level.id);
      soundManager.levelComplete();
      setShowSuccess(true);
    } else {
      soundManager.verifyFail();
      setFailFlash(true);
      setTimeout(() => setFailFlash(false), 400);
    }
  };

  const handleClear = () => {
    if (!level || !circuitRef.current) return;
    const circuit = circuitRef.current;
    // Save I/O gates and positions, clear everything, then restore I/O
    const ioGates = circuit.getGates()
      .filter((g) => g.type === GateType.INPUT || g.type === GateType.OUTPUT)
      .map((g) => ({ type: g.type, id: g.id, position: circuit.getGatePosition(g.id)!, label: g.label }));
    circuit.loadFrom({ gates: ioGates, wires: [] });
    setVerifyResult(null);
    setSimulationResult(null);
    setSelectedTool(null);
    setSelectedGateId(null);
    saveCircuit(level.id, circuit.serialize());
    setRenderVersion((n) => n + 1);
  };

  // Auto-dismiss success modal
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const circuit = circuitRef.current!;

  // Count failed test cases for error message
  const failedCount = verifyResult && !verifyResult.passed
    ? verifyResult.results.filter(r => !r.pass).length
    : 0;
  const firstFailIndex = verifyResult && !verifyResult.passed
    ? verifyResult.results.findIndex(r => !r.pass)
    : -1;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#0f0f1a',
        color: '#e2e8f0',
        fontFamily: 'monospace',
      }}
    >
      <Toolbar
        availableGates={level.availableGates}
        unlockedComponents={unlockedComponents}
        selectedTool={selectedTool}
        onSelectTool={setSelectedTool}
        onVerify={handleVerify}
        onClear={handleClear}
        onBack={() => navigate('/levels')}
        wireColor={wireColor}
        onWireColorChange={setWireColor}
        gateCount={gateCount}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div
          className={failFlash ? 'verify-fail-flash' : ''}
          style={{
            flex: '1 1 70%',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <Canvas
              circuit={circuit}
              selectedTool={selectedTool}
              onCircuitChange={handleCircuitChange}
              selectedGateId={selectedGateId}
              onSelectGate={setSelectedGateId}
              renderVersion={renderVersion}
              level={level}
              simulationResult={simulationResult}
              wireColor={wireColor}
              onWireColorChange={setWireColor}
              onToolChange={handleToolChange}
            />

            {/* Verify failure banner */}
            {verifyResult && !verifyResult.passed && (
              <div style={{
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(239, 68, 68, 0.9)',
                color: '#fff',
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'monospace',
                zIndex: 10,
                whiteSpace: 'nowrap',
              }}>
                {failedCount === 1
                  ? `Test case ${firstFailIndex + 1} failed`
                  : `${failedCount} of ${verifyResult.results.length} test cases failed`}
              </div>
            )}

            {showSuccess && (
              <div
                className="success-overlay-enter"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(15, 15, 26, 0.85)',
                  zIndex: 10,
                }}
              >
                <div
                  className="success-modal-enter"
                  style={{
                    textAlign: 'center',
                    padding: '40px 48px',
                    background: '#1a1a2e',
                    borderRadius: '16px',
                    border: '2px solid #22c55e',
                    position: 'relative',
                    overflow: 'visible',
                    boxShadow: '0 0 40px rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <SuccessParticles />
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
                  <h2 style={{ color: '#22c55e', marginBottom: '8px' }}>
                    Level Complete!
                  </h2>
                  <p style={{ color: '#94a3b8', marginBottom: '6px' }}>
                    You solved {level.name}
                  </p>
                  <p style={{ color: '#4a4a6a', fontSize: '12px', marginBottom: '20px' }}>
                    Used {gateCount} gate{gateCount !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={() => navigate('/levels')}
                    style={{
                      padding: '10px 24px',
                      background: '#6366f1',
                      color: '#e2e8f0',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#818cf8')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#6366f1')}
                  >
                    Next Level →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Keyboard shortcuts bar */}
          <ShortcutsBar />
        </div>

        {/* Right sidebar - level info */}
        <div
          className="play-sidebar"
          style={{
            flex: '0 0 30%',
            maxWidth: '400px',
            minWidth: '280px',
            background: '#1a1a2e',
            borderLeft: '1px solid #2d2d44',
            padding: '16px',
            overflowY: 'auto',
          }}
        >
          {/* Level info panel */}
          <div style={{
            padding: '10px 12px',
            background: '#0f0f1a',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #2d2d44',
          }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>
              {level.name}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
              {level.description}
            </p>
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '8px',
              fontSize: '11px',
              color: '#4a4a6a',
            }}>
              <span>Inputs: {level.inputs.length}</span>
              <span>Outputs: {level.outputs.length}</span>
              <span>Gates: {gateCount}</span>
              <span>Available: {level.availableGates.length} types</span>
            </div>
          </div>

          <h3 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>
            Truth Table
          </h3>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
              marginBottom: '20px',
            }}
          >
            <thead>
              <tr>
                {level.inputs.map((p) => (
                  <th
                    key={p.name}
                    style={{
                      padding: '6px 8px',
                      borderBottom: '1px solid #4a4a6a',
                      textAlign: 'center',
                      color: '#94a3b8',
                    }}
                  >
                    {p.name}
                  </th>
                ))}
                {level.outputs.map((p) => (
                  <th
                    key={p.name}
                    style={{
                      padding: '6px 8px',
                      borderBottom: '1px solid #4a4a6a',
                      textAlign: 'center',
                      color: '#6366f1',
                    }}
                  >
                    {p.name}
                  </th>
                ))}
                {verifyResult && (
                  <th
                    style={{
                      padding: '6px 8px',
                      borderBottom: '1px solid #4a4a6a',
                      textAlign: 'center',
                    }}
                  >
                    ✓
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {level.truthTable.map((entry, i) => {
                const result = verifyResult?.results[i];
                const rowFail = result && !result.pass;
                return (
                  <tr
                    key={i}
                    style={{
                      background: rowFail ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                    }}
                  >
                    {level.inputs.map((p) => (
                      <td
                        key={p.name}
                        style={{
                          padding: '6px 8px',
                          textAlign: 'center',
                          borderBottom: '1px solid #2d2d44',
                        }}
                      >
                        {entry.inputs[p.name] ? '1' : '0'}
                      </td>
                    ))}
                    {level.outputs.map((p) => (
                      <td
                        key={p.name}
                        style={{
                          padding: '6px 8px',
                          textAlign: 'center',
                          borderBottom: '1px solid #2d2d44',
                          color: result
                            ? result.pass
                              ? '#22c55e'
                              : '#ef4444'
                            : '#e2e8f0',
                        }}
                      >
                        {entry.outputs[p.name] ? '1' : '0'}
                        {rowFail && (
                          <span style={{ color: '#f87171', marginLeft: '4px', fontSize: '0.8rem' }}>
                            got {result.outputs[p.name] ? '1' : '0'}
                          </span>
                        )}
                      </td>
                    ))}
                    {verifyResult && (
                      <td
                        style={{
                          padding: '6px 8px',
                          textAlign: 'center',
                          borderBottom: '1px solid #2d2d44',
                        }}
                      >
                        {result?.pass ? '✅' : '❌'}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {level.hints && level.hints.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>
                Hints
              </h3>
              {level.hints.map((hint, i) => (
                <p
                  key={i}
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    margin: '4px 0',
                    padding: '8px',
                    background: '#0f0f1a',
                    borderRadius: '4px',
                  }}
                >
                  💡 {hint}
                </p>
              ))}
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>
              Current Output
            </h3>
            {circuit
              .getGates()
              .filter((g) => g.type === GateType.OUTPUT)
              .map((g) => {
                const inPin = g.inputs[0];
                const val = inPin ? simulationResult?.get(inPin.id) : undefined;
                return (
                  <div
                    key={g.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      background: '#0f0f1a',
                      borderRadius: '4px',
                      marginBottom: '4px',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span>{g.label}</span>
                    <span
                      style={{
                        color: val ? '#22c55e' : '#6b7280',
                        fontWeight: 'bold',
                      }}
                    >
                      {val ? '1' : '0'}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
