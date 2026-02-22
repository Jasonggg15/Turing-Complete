import type { Circuit } from '../engine/Circuit';
import type { Wire } from '../engine/Wire';
import type { Position } from '../engine/types';
import { getPinPosition } from './GateRenderer';

export const WIRE_COLORS: Record<string, { hex: string; glow: string; flow: string }> = {
  red:    { hex: '#ef4444', glow: 'rgba(239, 68, 68, 0.25)',  flow: 'rgba(239, 68, 68, 0.5)' },
  orange: { hex: '#f97316', glow: 'rgba(249, 115, 22, 0.25)', flow: 'rgba(249, 115, 22, 0.5)' },
  yellow: { hex: '#eab308', glow: 'rgba(234, 179, 8, 0.25)',  flow: 'rgba(234, 179, 8, 0.5)' },
  green:  { hex: '#22c55e', glow: 'rgba(34, 197, 94, 0.25)',  flow: 'rgba(34, 197, 94, 0.5)' },
  blue:   { hex: '#3b82f6', glow: 'rgba(59, 130, 246, 0.25)', flow: 'rgba(59, 130, 246, 0.5)' },
  purple: { hex: '#a855f7', glow: 'rgba(168, 85, 247, 0.25)', flow: 'rgba(168, 85, 247, 0.5)' },
  white:  { hex: '#e2e8f0', glow: 'rgba(226, 232, 240, 0.25)',flow: 'rgba(226, 232, 240, 0.5)' },
  gray:   { hex: '#9ca3af', glow: 'rgba(156, 163, 175, 0.25)',flow: 'rgba(156, 163, 175, 0.5)' },
};

export const WIRE_COLOR_NAMES = Object.keys(WIRE_COLORS);

/** Animated dash offset for signal flow; incremented externally each frame. */
let flowOffset = 0;

export function advanceFlowOffset(): void {
  flowOffset = (flowOffset + 0.6) % 20;
}

export function drawWire(
  ctx: CanvasRenderingContext2D,
  circuit: Circuit,
  wire: Wire,
  simulationResult?: Map<string, boolean>,
): void {
  const fromGate = circuit.getGate(wire.fromGateId);
  const toGate = circuit.getGate(wire.toGateId);
  if (!fromGate || !toGate) return;

  const fromPos = circuit.getGatePosition(wire.fromGateId);
  const toPos = circuit.getGatePosition(wire.toGateId);
  if (!fromPos || !toPos) return;

  const fromPin = [...fromGate.outputs].find(
    (p) => p.id === wire.fromPinId,
  );
  const toPin = [...toGate.inputs].find((p) => p.id === wire.toPinId);
  if (!fromPin || !toPin) return;

  const from = getPinPosition(fromGate, fromPin, fromPos);
  const to = getPinPosition(toGate, toPin, toPos);

  const value = simulationResult
    ? simulationResult.get(wire.fromPinId)
    : fromPin.value;

  const colorEntry = WIRE_COLORS[wire.color] ?? WIRE_COLORS['green']!;

  // Base wire
  ctx.strokeStyle = value ? colorEntry.hex : '#6b7280';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.bezierCurveTo(from.x + 60, from.y, to.x - 60, to.y, to.x, to.y);
  ctx.stroke();

  // Glow effect for active wires
  if (value) {
    ctx.save();
    ctx.strokeStyle = colorEntry.glow;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.bezierCurveTo(from.x + 60, from.y, to.x - 60, to.y, to.x, to.y);
    ctx.stroke();

    // Animated flow dashes on active wires
    ctx.strokeStyle = colorEntry.flow;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 14]);
    ctx.lineDashOffset = -flowOffset;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.bezierCurveTo(from.x + 60, from.y, to.x - 60, to.y, to.x, to.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

export function drawWirePreview(
  ctx: CanvasRenderingContext2D,
  from: Position,
  to: Position,
): void {
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.bezierCurveTo(from.x + 60, from.y, to.x - 60, to.y, to.x, to.y);
  ctx.stroke();

  ctx.setLineDash([]);
}
