import type { Gate } from '../engine/Gate';
import { GateType } from '../engine/types';
import type { Pin, Position } from '../engine/types';

export const GATE_WIDTH = 120;
export const GATE_HEIGHT = 60;
export const IO_GATE_WIDTH = 80;
export const IO_GATE_HEIGHT = 40;
export const PIN_RADIUS = 6;

const BUBBLE_RADIUS = 5;
const SHAPE_MARGIN = 20;
const OR_CURVE_DEPTH = 15;
const XOR_OFFSET = 8;

const COLORS = {
  gateFill: '#2d2d44',
  gateStroke: '#6a6a8a',
  inputGateFill: '#1e3a5f',
  outputGateFill: '#3b1f2b',
  selectedBorder: '#6366f1',
  pinHigh: '#22c55e',
  pinLow: '#6b7280',
  text: '#e2e8f0',
  labelText: '#9ca3af',
};

function getGateDimensions(gate: Gate): { width: number; height: number } {
  if (gate.type === GateType.INPUT || gate.type === GateType.OUTPUT) {
    return { width: IO_GATE_WIDTH, height: IO_GATE_HEIGHT };
  }
  if (gate.type === GateType.HALF_ADDER) {
    return { width: 140, height: 70 };
  }
  if (gate.type === GateType.FULL_ADDER) {
    return { width: 140, height: 80 };
  }
  return { width: GATE_WIDTH, height: GATE_HEIGHT };
}

export function getPinPosition(
  gate: Gate,
  pin: Pin,
  gatePos: Position,
): Position {
  const { width, height } = getGateDimensions(gate);
  const isInput = pin.direction === 'input';
  const pins = isInput ? gate.inputs : gate.outputs;
  const index = pins.indexOf(pin);
  const count = pins.length;

  return {
    x: isInput ? gatePos.x : gatePos.x + width,
    y: gatePos.y + ((index + 1) * height) / (count + 1),
  };
}

export function getGateBounds(
  gate: Gate,
  pos: Position,
): { x: number; y: number; width: number; height: number } {
  const { width, height } = getGateDimensions(gate);
  return { x: pos.x, y: pos.y, width, height };
}

// --- Helper functions ---

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawBubble(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
): void {
  ctx.beginPath();
  ctx.arc(cx, cy, BUBBLE_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.gateFill;
  ctx.fill();
  ctx.stroke();
}

/** Compute x position on the OR left-edge curve at a given y */
function orLeftEdgeX(
  pinY: number,
  L: number,
  T: number,
  B: number,
): number {
  const t = (pinY - T) / (B - T);
  return L + 2 * t * (1 - t) * OR_CURVE_DEPTH;
}

function isLogicGate(type: GateType): boolean {
  return (
    type === GateType.AND ||
    type === GateType.NAND ||
    type === GateType.OR ||
    type === GateType.NOR ||
    type === GateType.XOR ||
    type === GateType.XNOR ||
    type === GateType.NOT
  );
}

function isOrFamily(type: GateType): boolean {
  return (
    type === GateType.OR ||
    type === GateType.NOR ||
    type === GateType.XOR ||
    type === GateType.XNOR
  );
}

// --- Gate shape drawing functions ---

function drawAndShape(
  ctx: CanvasRenderingContext2D,
  L: number,
  T: number,
  W: number,
  H: number,
  negated: boolean,
): void {
  const CY = T + H / 2;
  const bodyW = negated ? W - 2 * BUBBLE_RADIUS : W;
  const arcR = H / 2;
  const arcCx = L + bodyW - arcR;

  ctx.beginPath();
  ctx.moveTo(L, T);
  ctx.lineTo(arcCx, T);
  ctx.arc(arcCx, CY, arcR, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(L, T + H);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  if (negated) {
    drawBubble(ctx, L + bodyW + BUBBLE_RADIUS, CY);
  }
}

function drawOrBody(
  ctx: CanvasRenderingContext2D,
  L: number,
  T: number,
  W: number,
  H: number,
): void {
  const R = L + W;
  const B = T + H;
  const CY = T + H / 2;

  ctx.beginPath();
  ctx.moveTo(L, T);
  // Top curve to point
  ctx.bezierCurveTo(L + W * 0.45, T, R - W * 0.2, T + H * 0.15, R, CY);
  // Bottom curve from point
  ctx.bezierCurveTo(R - W * 0.2, B - H * 0.15, L + W * 0.45, B, L, B);
  // Left concave curve
  ctx.quadraticCurveTo(L + OR_CURVE_DEPTH, CY, L, T);
  ctx.closePath();
}

function drawOrShape(
  ctx: CanvasRenderingContext2D,
  L: number,
  T: number,
  W: number,
  H: number,
  negated: boolean,
): void {
  const CY = T + H / 2;
  const bodyW = negated ? W - 2 * BUBBLE_RADIUS : W;

  drawOrBody(ctx, L, T, bodyW, H);
  ctx.fill();
  ctx.stroke();

  if (negated) {
    drawBubble(ctx, L + bodyW + BUBBLE_RADIUS, CY);
  }
}

function drawXorShape(
  ctx: CanvasRenderingContext2D,
  L: number,
  T: number,
  W: number,
  H: number,
  negated: boolean,
): void {
  const CY = T + H / 2;
  const bodyW = negated ? W - 2 * BUBBLE_RADIUS : W;

  drawOrBody(ctx, L, T, bodyW, H);
  ctx.fill();
  ctx.stroke();

  // Extra XOR curve on the left
  ctx.beginPath();
  ctx.moveTo(L - XOR_OFFSET, T);
  ctx.quadraticCurveTo(L - XOR_OFFSET + OR_CURVE_DEPTH, CY, L - XOR_OFFSET, T + H);
  ctx.stroke();

  if (negated) {
    drawBubble(ctx, L + bodyW + BUBBLE_RADIUS, CY);
  }
}

function drawNotShape(
  ctx: CanvasRenderingContext2D,
  L: number,
  T: number,
  W: number,
  H: number,
): void {
  const CY = T + H / 2;
  const bodyW = W - 2 * BUBBLE_RADIUS;

  ctx.beginPath();
  ctx.moveTo(L, T);
  ctx.lineTo(L + bodyW, CY);
  ctx.lineTo(L, T + H);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  drawBubble(ctx, L + bodyW + BUBBLE_RADIUS, CY);
}

function drawInputShape(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  width: number,
  height: number,
  label: string,
): void {
  const arrowDepth = 12;
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  ctx.lineTo(pos.x + width - arrowDepth, pos.y);
  ctx.lineTo(pos.x + width, pos.y + height / 2);
  ctx.lineTo(pos.x + width - arrowDepth, pos.y + height);
  ctx.lineTo(pos.x, pos.y + height);
  ctx.closePath();
  ctx.fillStyle = COLORS.inputGateFill;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, pos.x + (width - arrowDepth / 2) / 2, pos.y + height / 2);
}

function drawOutputShape(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  width: number,
  height: number,
  label: string,
): void {
  const arrowDepth = 12;
  ctx.beginPath();
  ctx.moveTo(pos.x + arrowDepth, pos.y);
  ctx.lineTo(pos.x + width, pos.y);
  ctx.lineTo(pos.x + width, pos.y + height);
  ctx.lineTo(pos.x + arrowDepth, pos.y + height);
  ctx.lineTo(pos.x, pos.y + height / 2);
  ctx.closePath();
  ctx.fillStyle = COLORS.outputGateFill;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, pos.x + arrowDepth / 2 + (width - arrowDepth / 2) / 2, pos.y + height / 2);
}

function drawDffShape(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  width: number,
  height: number,
): void {
  drawRoundedRect(ctx, pos.x, pos.y, width, height, 6);
  ctx.fillStyle = '#2d3a44';
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DFF', pos.x + width / 2, pos.y + height / 2);

  // Clock triangle at input pin
  const triSize = 8;
  const pinY = pos.y + height / 2;
  ctx.beginPath();
  ctx.moveTo(pos.x, pinY - triSize / 2);
  ctx.lineTo(pos.x + triSize, pinY);
  ctx.lineTo(pos.x, pinY + triSize / 2);
  ctx.closePath();
  ctx.fillStyle = COLORS.gateFill;
  ctx.fill();
  ctx.stroke();
}

function drawAdderShape(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  width: number,
  height: number,
  label: string,
): void {
  drawRoundedRect(ctx, pos.x, pos.y, width, height, 6);
  ctx.fillStyle = '#2d3a44';
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, pos.x + width / 2, pos.y + height / 2 - 8);

  ctx.font = '18px serif';
  ctx.fillText('\u03A3', pos.x + width / 2, pos.y + height / 2 + 10);
}

// --- Pin stub lines ---

function drawPinStubs(
  ctx: CanvasRenderingContext2D,
  gate: Gate,
  pos: Position,
): void {
  const { width, height } = getGateDimensions(gate);
  const L = pos.x + SHAPE_MARGIN;
  const T = pos.y + 5;
  const H = height - 10;
  const B = T + H;
  const hasNegation =
    gate.type === GateType.NAND ||
    gate.type === GateType.NOR ||
    gate.type === GateType.XNOR ||
    gate.type === GateType.NOT;
  const bodyW = hasNegation
    ? width - 2 * SHAPE_MARGIN - 2 * BUBBLE_RADIUS
    : width - 2 * SHAPE_MARGIN;
  const shapeRight = L + bodyW;
  const outputEdge = hasNegation
    ? L + bodyW + 2 * BUBBLE_RADIUS
    : shapeRight;

  ctx.strokeStyle = COLORS.gateStroke;
  ctx.lineWidth = 1.5;

  // Input stubs
  for (const pin of gate.inputs) {
    const pinPos = getPinPosition(gate, pin, pos);
    let stubEndX: number;
    if (isOrFamily(gate.type)) {
      stubEndX = orLeftEdgeX(pinPos.y, L, T, B);
    } else {
      stubEndX = L;
    }
    ctx.beginPath();
    ctx.moveTo(pinPos.x + PIN_RADIUS, pinPos.y);
    ctx.lineTo(stubEndX, pinPos.y);
    ctx.stroke();
  }

  // Output stubs
  for (const pin of gate.outputs) {
    const pinPos = getPinPosition(gate, pin, pos);
    ctx.beginPath();
    ctx.moveTo(outputEdge, pinPos.y);
    ctx.lineTo(pinPos.x - PIN_RADIUS, pinPos.y);
    ctx.stroke();
  }
}

// --- Main draw function ---

export function drawGate(
  ctx: CanvasRenderingContext2D,
  gate: Gate,
  pos: Position,
  selected: boolean,
  simulationResult?: Map<string, boolean>,
): void {
  const { width, height } = getGateDimensions(gate);
  const isCompoundGate =
    gate.type === GateType.HALF_ADDER || gate.type === GateType.FULL_ADDER;

  // Selected glow
  if (selected) {
    ctx.shadowColor = COLORS.selectedBorder;
    ctx.shadowBlur = 10;
  }

  ctx.strokeStyle = selected ? COLORS.selectedBorder : COLORS.gateStroke;
  ctx.lineWidth = selected ? 2.5 : 1.5;
  ctx.fillStyle = COLORS.gateFill;

  // Shape region for logic gates
  const L = pos.x + SHAPE_MARGIN;
  const T = pos.y + 5;
  const W = width - 2 * SHAPE_MARGIN;
  const H = height - 10;

  switch (gate.type) {
    case GateType.AND:
      drawAndShape(ctx, L, T, W, H, false);
      break;
    case GateType.NAND:
      drawAndShape(ctx, L, T, W, H, true);
      break;
    case GateType.OR:
      drawOrShape(ctx, L, T, W, H, false);
      break;
    case GateType.NOR:
      drawOrShape(ctx, L, T, W, H, true);
      break;
    case GateType.XOR:
      drawXorShape(ctx, L, T, W, H, false);
      break;
    case GateType.XNOR:
      drawXorShape(ctx, L, T, W, H, true);
      break;
    case GateType.NOT:
      drawNotShape(ctx, L, T, W, H);
      break;
    case GateType.INPUT:
      drawInputShape(ctx, pos, width, height, gate.label);
      break;
    case GateType.OUTPUT:
      drawOutputShape(ctx, pos, width, height, gate.label);
      break;
    case GateType.D_FLIPFLOP:
      drawDffShape(ctx, pos, width, height);
      break;
    case GateType.HALF_ADDER:
      drawAdderShape(ctx, pos, width, height, 'HA');
      break;
    case GateType.FULL_ADDER:
      drawAdderShape(ctx, pos, width, height, 'FA');
      break;
  }

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Pin stub lines (logic gates only)
  if (isLogicGate(gate.type)) {
    drawPinStubs(ctx, gate, pos);
  }

  // Label below gate (logic gates only)
  if (isLogicGate(gate.type)) {
    ctx.fillStyle = COLORS.labelText;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(gate.type, pos.x + width / 2, pos.y + height + 2);
  }

  // Pins
  const allPins = [...gate.inputs, ...gate.outputs];
  for (const pin of allPins) {
    const pinPos = getPinPosition(gate, pin, pos);
    const value = simulationResult
      ? simulationResult.get(pin.id)
      : pin.value;

    ctx.beginPath();
    ctx.arc(pinPos.x, pinPos.y, PIN_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = value ? COLORS.pinHigh : COLORS.pinLow;
    ctx.fill();
    ctx.strokeStyle = COLORS.gateStroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Pin labels for compound gates
  if (isCompoundGate) {
    ctx.font = '9px monospace';
    ctx.fillStyle = '#94a3b8';

    const inputLabels =
      gate.type === GateType.HALF_ADDER
        ? ['a', 'b']
        : ['a', 'b', 'cin'];
    const outputLabels =
      gate.type === GateType.HALF_ADDER
        ? ['sum', 'carry']
        : ['sum', 'cout'];

    for (let i = 0; i < gate.inputs.length; i++) {
      const pin = gate.inputs[i];
      if (!pin) continue;
      const pinPos = getPinPosition(gate, pin, pos);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(inputLabels[i] ?? '', pinPos.x + PIN_RADIUS + 3, pinPos.y);
    }

    for (let i = 0; i < gate.outputs.length; i++) {
      const pin = gate.outputs[i];
      if (!pin) continue;
      const pinPos = getPinPosition(gate, pin, pos);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(outputLabels[i] ?? '', pinPos.x - PIN_RADIUS - 3, pinPos.y);
    }
  }
}
