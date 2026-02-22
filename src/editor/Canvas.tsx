import { useRef, useEffect, useCallback, useState } from 'react';
import { Circuit } from '../engine/Circuit';
import { GateType } from '../engine/types';
import type { SerializedCircuit } from '../engine/types';
import type { Level } from '../levels/Level';
import type { Camera } from './Grid';
import { drawGrid } from './Grid';
import { drawGate, getGateBounds } from './GateRenderer';
import { drawWire, drawWirePreview, advanceFlowOffset } from './WireRenderer';
import { Interaction } from './Interaction';
import WireColorPicker from './WireColorPicker';
import type { Gate } from '../engine/Gate';

interface CanvasProps {
  circuit: Circuit;
  selectedTool: GateType | null;
  onCircuitChange: () => void;
  selectedGateId: string | null;
  onSelectGate: (id: string | null) => void;
  renderVersion: number;
  level?: Level;
  simulationResult?: Map<string, boolean> | null;
  wireColor?: string;
  onWireColorChange?: (color: string) => void;
}

export default function Canvas({
  circuit,
  selectedTool,
  onCircuitChange,
  selectedGateId,
  onSelectGate,
  renderVersion,
  level,
  simulationResult: simulationResultProp,
  wireColor = 'green',
  onWireColorChange,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera>({ offsetX: 100, offsetY: 100, zoom: 1 });
  const interactionRef = useRef<Interaction | null>(null);
  const rafRef = useRef<number>(0);
  const needsRenderRef = useRef(true);
  const undoStackRef = useRef<SerializedCircuit[]>([]);
  const redoStackRef = useRef<SerializedCircuit[]>([]);
  const [hoveredGate, setHoveredGate] = useState<Gate | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [colorPicker, setColorPicker] = useState<{ wireId: string; x: number; y: number } | null>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const camera = cameraRef.current;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(0, 0, width, height);

    drawGrid(ctx, width, height, camera);

    ctx.save();
    ctx.translate(camera.offsetX, camera.offsetY);
    ctx.scale(camera.zoom, camera.zoom);

    const simulationResult = simulationResultProp ?? undefined;

    for (const wire of circuit.getWires()) {
      drawWire(ctx, circuit, wire, simulationResult);
    }

    for (const gate of circuit.getGates()) {
      const pos = circuit.getGatePosition(gate.id);
      if (pos) {
        drawGate(ctx, gate, pos, gate.id === selectedGateId, simulationResult);
      }
    }

    const interaction = interactionRef.current;
    if (interaction) {
      const wiringFrom = interaction.getWiringFrom();
      if (wiringFrom && interaction.getState() === 'wiring') {
        drawWirePreview(ctx, wiringFrom.pos, interaction.getMouseWorld());
      }
    }

    ctx.restore();
  }, [circuit, selectedGateId, simulationResultProp]);

  const requestRender = useCallback(() => {
    needsRenderRef.current = true;
  }, []);

  useEffect(() => {
    const loop = () => {
      advanceFlowOffset();
      const currentZoom = cameraRef.current.zoom;
      if (currentZoom !== zoom) setZoom(currentZoom);
      if (needsRenderRef.current) {
        needsRenderRef.current = false;
      }
      // Always re-render for wire flow animation
      render();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [render, zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const interaction = new Interaction(
      canvas,
      circuit,
      cameraRef.current,
      {
        onCircuitChange,
        onSelectGate,
        requestRender,
        onShowColorPicker: (wireId, screenX, screenY) => {
          const rect = canvas.getBoundingClientRect();
          setColorPicker({
            wireId,
            x: screenX - rect.left,
            y: screenY - rect.top,
          });
        },
      },
      level,
      undoStackRef.current,
      redoStackRef.current,
    );
    interactionRef.current = interaction;

    return () => {
      interaction.destroy();
      interactionRef.current = null;
    };
  }, [circuit, onCircuitChange, onSelectGate, requestRender, level]);

  useEffect(() => {
    interactionRef.current?.setSelectedTool(selectedTool);
    requestRender();
  }, [selectedTool, requestRender]);

  useEffect(() => {
    interactionRef.current?.setWireColor(wireColor);
  }, [wireColor]);

  useEffect(() => {
    interactionRef.current?.setSelectedGateId(selectedGateId);
    requestRender();
  }, [selectedGateId, requestRender]);

  useEffect(() => {
    requestRender();
  }, [circuit, renderVersion, requestRender]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        requestRender();
      }
    });

    observer.observe(canvas.parentElement ?? canvas);
    return () => observer.disconnect();
  }, [requestRender]);

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const camera = cameraRef.current;
      const worldX = (e.clientX - rect.left - camera.offsetX) / camera.zoom;
      const worldY = (e.clientY - rect.top - camera.offsetY) / camera.zoom;

      let found: Gate | null = null;
      const gates = circuit.getGates();
      for (let i = gates.length - 1; i >= 0; i--) {
        const gate = gates[i]!;
        if (gate.type === GateType.INPUT || gate.type === GateType.OUTPUT) continue;
        const pos = circuit.getGatePosition(gate.id);
        if (!pos) continue;
        const bounds = getGateBounds(gate, pos);
        if (
          worldX >= bounds.x &&
          worldX <= bounds.x + bounds.width &&
          worldY >= bounds.y &&
          worldY <= bounds.y + bounds.height
        ) {
          found = gate;
          break;
        }
      }
      if (found) {
        setHoveredGate(found);
        setTooltipPos({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top + 12 });
      } else {
        setHoveredGate(null);
        setTooltipPos(null);
      }
    },
    [circuit],
  );

  const handleColorSelect = useCallback((wireId: string, color: string) => {
    const wire = circuit.getWires().find(w => w.id === wireId);
    if (wire) {
      wire.color = color;
      interactionRef.current?.setWireColor(color);
      onWireColorChange?.(color);
      onCircuitChange();
      requestRender();
    }
    setColorPicker(null);
  }, [circuit, onCircuitChange, onWireColorChange, requestRender]);

  const handleDeleteWire = useCallback((wireId: string) => {
    circuit.removeWire(wireId);
    onCircuitChange();
    requestRender();
    setColorPicker(null);
  }, [circuit, onCircuitChange, requestRender]);

  const handleCloseColorPicker = useCallback(() => {
    setColorPicker(null);
  }, []);

  const truthTableForGate = useCallback((gate: Gate): string[][] | null => {
    const type = gate.type;
    const tables: Record<string, string[][]> = {
      [GateType.NAND]: [['A','B','Out'],['0','0','1'],['0','1','1'],['1','0','1'],['1','1','0']],
      [GateType.AND]: [['A','B','Out'],['0','0','0'],['0','1','0'],['1','0','0'],['1','1','1']],
      [GateType.OR]: [['A','B','Out'],['0','0','0'],['0','1','1'],['1','0','1'],['1','1','1']],
      [GateType.NOR]: [['A','B','Out'],['0','0','1'],['0','1','0'],['1','0','0'],['1','1','0']],
      [GateType.XOR]: [['A','B','Out'],['0','0','0'],['0','1','1'],['1','0','1'],['1','1','0']],
      [GateType.XNOR]: [['A','B','Out'],['0','0','1'],['0','1','0'],['1','0','0'],['1','1','1']],
      [GateType.NOT]: [['In','Out'],['0','1'],['1','0']],
    };
    return tables[type] ?? null;
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => { setHoveredGate(null); setTooltipPos(null); }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: selectedTool ? 'crosshair' : 'default',
        }}
      />

      {/* Zoom indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          background: 'rgba(26, 26, 46, 0.85)',
          color: '#94a3b8',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'monospace',
          pointerEvents: 'none',
        }}
      >
        {Math.round(cameraRef.current.zoom * 100)}%
      </div>

      {/* Gate tooltip */}
      {hoveredGate && tooltipPos && (() => {
        const table = truthTableForGate(hoveredGate);
        if (!table) return null;
        return (
          <div
            style={{
              position: 'absolute',
              left: tooltipPos.x,
              top: tooltipPos.y,
              background: '#1a1a2e',
              border: '1px solid #4a4a6a',
              borderRadius: '6px',
              padding: '8px 10px',
              pointerEvents: 'none',
              zIndex: 20,
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#e2e8f0',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{hoveredGate.type}</div>
            <table style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {table[0]!.map((h, i) => (
                    <th key={i} style={{ padding: '2px 6px', borderBottom: '1px solid #4a4a6a', color: '#94a3b8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.slice(1).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: '2px 6px', textAlign: 'center' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}

      {/* Wire color picker */}
      {colorPicker && (() => {
        const wire = circuit.getWires().find(w => w.id === colorPicker.wireId);
        if (!wire) return null;
        return (
          <WireColorPicker
            wireId={colorPicker.wireId}
            currentColor={wire.color}
            x={colorPicker.x}
            y={colorPicker.y}
            onSelectColor={handleColorSelect}
            onDeleteWire={handleDeleteWire}
            onClose={handleCloseColorPicker}
          />
        );
      })()}
    </div>
  );
}
