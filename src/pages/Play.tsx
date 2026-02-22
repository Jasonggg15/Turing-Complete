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

  // Compute unlocked compound components from completed levels
  const unlockedComponents = useMemo(() => {
    const components: GateType[] = [];
    for (const l of levels) {
      if (l.unlocksComponent && isLevelCompleted(l.id)) {
        components.push(l.unlocksComponent.gateType);
      }
    }
    return components;
  }, [verifyResult]);

  if (!level) return <Navigate to="/levels" replace />;
  if (locked) return <Navigate to="/levels" replace />;

  const handleCircuitChange = useCallback(() => {
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
  }, [level]);

  const handleVerify = useCallback(() => {
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
    }
  }, [level]);

  const handleClear = useCallback(() => {
    if (!level || !circuitRef.current) return;
    const ioGates = circuitRef.current
      .getGates()
      .filter((g) => g.type !== GateType.INPUT && g.type !== GateType.OUTPUT);
    for (const gate of ioGates) {
      circuitRef.current.removeGate(gate.id);
    }
    const remainingWires = circuitRef.current.getWires();
    for (const wire of remainingWires) {
      try {
        circuitRef.current.removeWire(wire.id);
      } catch {
        // wire already removed via gate removal
      }
    }
    setVerifyResult(null);
    setSimulationResult(null);
    setSelectedTool(null);
    setSelectedGateId(null);
    saveCircuit(level.id, circuitRef.current.serialize());
    setRenderVersion((n) => n + 1);
  }, [level]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const circuit = circuitRef.current!;

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
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div
          style={{
            flex: '1 1 70%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Canvas
            circuit={circuit}
            selectedTool={selectedTool}
            onCircuitChange={handleCircuitChange}
            selectedGateId={selectedGateId}
            onSelectGate={setSelectedGateId}
            renderVersion={renderVersion}
            level={level}
            simulationResult={simulationResult}
          />

          {showSuccess && (
            <div
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
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  background: '#1a1a2e',
                  borderRadius: '16px',
                  border: '2px solid #22c55e',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
                <h2 style={{ color: '#22c55e', marginBottom: '8px' }}>
                  Level Complete!
                </h2>
                <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                  You solved {level.name}
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
                  }}
                >
                  Next Level →
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            flex: '0 0 30%',
            background: '#1a1a2e',
            borderLeft: '1px solid #2d2d44',
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          <h2 style={{ margin: '0 0 4px', fontSize: '1.3rem' }}>
            {level.name}
          </h2>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.9rem',
              marginBottom: '20px',
            }}
          >
            {level.description}
          </p>

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
