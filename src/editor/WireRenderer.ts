import type { Circuit } from '../engine/Circuit';
import type { Wire } from '../engine/Wire';
import type { Position } from '../engine/types';
import { getPinPosition } from './GateRenderer';

export const WIRE_COLORS: Record<string, { hex: string; dark: string; glow: string; flow: string }> = {
  red:    { hex: '#ef4444', dark: '#7f1d1d', glow: 'rgba(239, 68, 68, 0.25)',  flow: 'rgba(239, 68, 68, 0.5)' },
  orange: { hex: '#f97316', dark: '#7c2d12', glow: 'rgba(249, 115, 22, 0.25)', flow: 'rgba(249, 115, 22, 0.5)' },
  yellow: { hex: '#eab308', dark: '#713f12', glow: 'rgba(234, 179, 8, 0.25)',  flow: 'rgba(234, 179, 8, 0.5)' },
  green:  { hex: '#22c55e', dark: '#14532d', glow: 'rgba(34, 197, 94, 0.25)',  flow: 'rgba(34, 197, 94, 0.5)' },
  cyan:   { hex: '#06b6d4', dark: '#164e63', glow: 'rgba(6, 182, 212, 0.25)',  flow: 'rgba(6, 182, 212, 0.5)' },
  blue:   { hex: '#3b82f6', dark: '#1e3a5f', glow: 'rgba(59, 130, 246, 0.25)', flow: 'rgba(59, 130, 246, 0.5)' },
  purple: { hex: '#a855f7', dark: '#581c87', glow: 'rgba(168, 85, 247, 0.25)', flow: 'rgba(168, 85, 247, 0.5)' },
};

export const WIRE_COLOR_NAMES = Object.keys(WIRE_COLORS);

/** Animated dash offset for signal flow; incremented externally each frame. */
let flowOffset = 0;

export function advanceFlowOffset(): void {
  flowOffset = (flowOffset + 0.6) % 20;
}

/** Compute orthogonal (right-angle) path: horizontal first, then vertical. */
function orthoPath(
  ctx: CanvasRenderingContext2D,
  from: Position,
  to: Position,
): void {
  const midX = (from.x + to.x) / 2;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(midX, from.y);
  ctx.lineTo(midX, to.y);
  ctx.lineTo(to.x, to.y);
}

/** Draw orthogonal path through multiple points (from -> waypoints -> to). */
function orthoPathMulti(
  ctx: CanvasRenderingContext2D,
  points: Position[],
): void {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0]!.x, points[0]!.y);
  for (let i = 1; i < points.length; i++) {
    const from = points[i - 1]!;
    const to = points[i]!;
    const midX = (from.x + to.x) / 2;
    ctx.lineTo(midX, from.y);
    ctx.lineTo(midX, to.y);
    ctx.lineTo(to.x, to.y);
  }
}

/** Hit-test orthogonal wire segments. Returns true if point is within dist. */
export function hitTestOrthoWire(
  from: Position,
  to: Position,
  point: Position,
  threshold: number,
): boolean {
  const midX = (from.x + to.x) / 2;
  const segments: [Position, Position][] = [
    [from, { x: midX, y: from.y }],
    [{ x: midX, y: from.y }, { x: midX, y: to.y }],
    [{ x: midX, y: to.y }, to],
  ];
  for (const [a, b] of segments) {
    if (distToSegment(point, a, b) < threshold) return true;
  }
  return false;
}

/** Hit-test orthogonal wire with waypoints. */
export function hitTestOrthoWireMulti(
  points: Position[],
  point: Position,
  threshold: number,
): boolean {
  for (let i = 1; i < points.length; i++) {
    if (hitTestOrthoWire(points[i - 1]!, points[i]!, point, threshold)) {
      return true;
    }
  }
  return false;
}

function distToSegment(p: Position, a: Position, b: Position): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

export function drawWire(
  ctx: CanvasRenderingContext2D,
  circuit: Circuit,
  wire: Wire,
  simulationResult?: Map<string, boolean>,
  highlighted?: boolean,
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
  const points = [from, ...wire.waypoints, to];

  const value = simulationResult
    ? simulationResult.get(wire.fromPinId)
    : fromPin.value;

  const colorEntry = WIRE_COLORS[wire.color] ?? WIRE_COLORS['green']!;

  // Base wire — use dark variant of user's color when signal is 0
  ctx.strokeStyle = value ? colorEntry.hex : colorEntry.dark;
  ctx.lineWidth = highlighted ? 3.5 : 2.5;
  ctx.setLineDash([]);

  orthoPathMulti(ctx, points);
  ctx.stroke();

  // Highlight border for selected wires
  if (highlighted) {
    ctx.save();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.3;
    orthoPathMulti(ctx, points);
    ctx.stroke();
    ctx.restore();
  }

  // Glow effect for active wires
  if (value) {
    ctx.save();
    ctx.strokeStyle = colorEntry.glow;
    ctx.lineWidth = 8;
    orthoPathMulti(ctx, points);
    ctx.stroke();

    // Animated flow dashes on active wires
    ctx.strokeStyle = colorEntry.flow;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 14]);
    ctx.lineDashOffset = -flowOffset;
    orthoPathMulti(ctx, points);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

/** Draw waypoint handles on a selected wire — only at actual bends. */
export function drawWireWaypoints(
  ctx: CanvasRenderingContext2D,
  wire: Wire,
  from: Position,
  to: Position,
): void {
  if (wire.waypoints.length === 0) return;
  const pts = [from, ...wire.waypoints, to];
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1]!;
    const curr = pts[i]!;
    const next = pts[i + 1]!;
    // Skip collinear points (same row or same column)
    if (prev.y === curr.y && curr.y === next.y) continue;
    if (prev.x === curr.x && curr.x === next.x) continue;
    ctx.beginPath();
    ctx.arc(curr.x, curr.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1';
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
  }
}

export function drawWirePreview(
  ctx: CanvasRenderingContext2D,
  from: Position,
  to: Position,
  waypoints?: Position[],
): void {
  if (waypoints && waypoints.length > 0) {
    // Committed waypoints — solid line
    const committedPoints = [from, ...waypoints];
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    orthoPathMulti(ctx, committedPoints);
    ctx.stroke();

    // Last segment to cursor — dashed
    const lastWp = waypoints[waypoints.length - 1]!;
    ctx.setLineDash([6, 4]);
    orthoPath(ctx, lastWp, to);
    ctx.stroke();
    ctx.setLineDash([]);

    // Waypoint dots
    for (const wp of waypoints) {
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
    }
  } else {
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    orthoPath(ctx, from, to);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
