import { useRef, useEffect, useCallback, useState } from 'react';
import { Circuit } from '../engine/Circuit';
import { GateType } from '../engine/types';
import type { SerializedCircuit } from '../engine/types';
import type { Level } from '../levels/Level';
import type { Camera } from './Grid';
import { drawGrid } from './Grid';
import { drawGate, getGateBounds, getPinPosition } from './GateRenderer';
import { drawWire, drawWirePreview, drawWireWaypoints, advanceFlowOffset } from './WireRenderer';
import { Interaction } from './Interaction';
import type { RadialMenuState } from './Interaction';
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
  onToolChange?: (tool: GateType | null) => void;
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
  onToolChange,
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
  const [radialMenu, setRadialMenu] = useState<RadialMenuState | null>(null);

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
    const interaction = interactionRef.current;
    const selectedGateIds = interaction?.getSelectedGateIds() ?? new Set<string>();
    const selectedWireIds = interaction?.getSelectedWireIds() ?? new Set<string>();

    for (const wire of circuit.getWires()) {
      drawWire(ctx, circuit, wire, simulationResult, selectedWireIds.has(wire.id));
      if (selectedWireIds.has(wire.id) && wire.waypoints.length > 0) {
        const fromGate = circuit.getGate(wire.fromGateId);
        const toGate = circuit.getGate(wire.toGateId);
        if (fromGate && toGate) {
          const fp = circuit.getGatePosition(wire.fromGateId);
          const tp = circuit.getGatePosition(wire.toGateId);
          if (fp && tp) {
            const fromPin = fromGate.outputs.find(p => p.id === wire.fromPinId);
            const toPin = toGate.inputs.find(p => p.id === wire.toPinId);
            if (fromPin && toPin) {
              drawWireWaypoints(ctx, wire, getPinPosition(fromGate, fromPin, fp), getPinPosition(toGate, toPin, tp));
            }
          }
        }
      }
    }

    for (const gate of circuit.getGates()) {
      const pos = circuit.getGatePosition(gate.id);
      if (pos) {
        const isSelected = gate.id === selectedGateId || selectedGateIds.has(gate.id);
        drawGate(ctx, gate, pos, isSelected, simulationResult);
      }
    }

    // Wire preview while dragging
    if (interaction) {
      const wiringFrom = interaction.getWiringFrom();
      if (wiringFrom && interaction.getState() === 'wiring') {
        const waypoints = interaction.getWiringWaypoints();
        drawWirePreview(ctx, wiringFrom.pos, interaction.getMouseWorld(), waypoints.length > 0 ? waypoints : undefined);
      }

      // Box selection rectangle
      const selRect = interaction.getSelectionRect();
      if (selRect) {
        ctx.save();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1 / camera.zoom;
        ctx.setLineDash([4 / camera.zoom, 4 / camera.zoom]);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
        const rx = selRect.width < 0 ? selRect.x + selRect.width : selRect.x;
        const ry = selRect.height < 0 ? selRect.y + selRect.height : selRect.y;
        ctx.fillRect(rx, ry, Math.abs(selRect.width), Math.abs(selRect.height));
        ctx.strokeRect(rx, ry, Math.abs(selRect.width), Math.abs(selRect.height));
        ctx.setLineDash([]);
        ctx.restore();
      }
    }

    ctx.restore();

    // Update radial menu state for React overlay
    const rmState = interaction?.getRadialMenu() ?? null;
    setRadialMenu(rmState);
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
        onToolChange,
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
  }, [circuit, onCircuitChange, onSelectGate, requestRender, level, onToolChange]);

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

      {/* Radial menu overlay (#3) */}
      {radialMenu && (
        <div
          style={{
            position: 'fixed',
            left: radialMenu.screenX,
            top: radialMenu.screenY,
            pointerEvents: 'none',
            zIndex: 40,
          }}
        >
          {/* Center zone — no selection */}
          <div style={{
            position: 'absolute',
            left: -12, top: -12,
            width: 24, height: 24,
            borderRadius: '50%',
            background: '#1a1a2e',
            border: '2px solid #4a4a6a',
            pointerEvents: 'none',
          }} />
          {/* Menu items */}
          {radialMenu.items.map((item, i) => {
            const isHovered = i === radialMenu.hoveredIndex;
            return (
              <div
                key={item.type}
                style={{
                  position: 'absolute',
                  left: item.x - 24,
                  top: item.y - 14,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: isHovered ? '#6366f1' : '#1a1a2e',
                  border: `1px solid ${isHovered ? '#818cf8' : '#4a4a6a'}`,
                  color: isHovered ? '#fff' : '#e2e8f0',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: isHovered ? 'bold' : 'normal',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.1s, background 0.1s',
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
