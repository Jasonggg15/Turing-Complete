import type { Circuit } from '../engine/Circuit';
import type { Wire } from '../engine/Wire';
import type { Position } from '../engine/types';
import { getPinPosition } from './GateRenderer';

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

  // Base wire
  ctx.strokeStyle = value ? '#22c55e' : '#6b7280';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.bezierCurveTo(from.x + 60, from.y, to.x - 60, to.y, to.x, to.y);
  ctx.stroke();

  // Glow effect for active wires
  if (value) {
    ctx.save();
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.bezierCurveTo(from.x + 60, from.y, to.x - 60, to.y, to.x, to.y);
    ctx.stroke();

    // Animated flow dashes on active wires
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
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
