import type { Gate } from '../engine/Gate';
import { GateType } from '../engine/types';
import type { Pin, Position } from '../engine/types';

export const GATE_WIDTH = 120;
export const GATE_HEIGHT = 60;
export const IO_GATE_WIDTH = 80;
export const IO_GATE_HEIGHT = 40;
export const PIN_RADIUS = 6;

const COLORS = {
  gateFill: '#2d2d44',
  gateBorder: '#4a4a6a',
  inputGateFill: '#1e3a5f',
  outputGateFill: '#3b1f2b',
  selectedBorder: '#6366f1',
  pinHigh: '#22c55e',
  pinLow: '#6b7280',
  text: '#e2e8f0',
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

export function drawGate(
  ctx: CanvasRenderingContext2D,
  gate: Gate,
  pos: Position,
  selected: boolean,
  simulationResult?: Map<string, boolean>,
): void {
  const { width, height } = getGateDimensions(gate);

  // Gate body
  const isCompoundGate =
    gate.type === GateType.HALF_ADDER || gate.type === GateType.FULL_ADDER;
  ctx.fillStyle =
    gate.type === GateType.INPUT
      ? COLORS.inputGateFill
      : gate.type === GateType.OUTPUT
        ? COLORS.outputGateFill
        : isCompoundGate
          ? '#2d3a44'
          : COLORS.gateFill;
  ctx.strokeStyle = selected ? COLORS.selectedBorder : COLORS.gateBorder;
  ctx.lineWidth = selected ? 2.5 : 1.5;

  const radius = 8;
  ctx.beginPath();
  ctx.moveTo(pos.x + radius, pos.y);
  ctx.lineTo(pos.x + width - radius, pos.y);
  ctx.arcTo(pos.x + width, pos.y, pos.x + width, pos.y + radius, radius);
  ctx.lineTo(pos.x + width, pos.y + height - radius);
  ctx.arcTo(
    pos.x + width,
    pos.y + height,
    pos.x + width - radius,
    pos.y + height,
    radius,
  );
  ctx.lineTo(pos.x + radius, pos.y + height);
  ctx.arcTo(pos.x, pos.y + height, pos.x, pos.y + height - radius, radius);
  ctx.lineTo(pos.x, pos.y + radius);
  ctx.arcTo(pos.x, pos.y, pos.x + radius, pos.y, radius);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Label
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const displayLabel =
    gate.type === GateType.INPUT || gate.type === GateType.OUTPUT
      ? gate.label
      : gate.type === GateType.HALF_ADDER
        ? 'HALF ADD'
        : gate.type === GateType.FULL_ADDER
          ? 'FULL ADD'
          : gate.type;
  ctx.fillText(displayLabel, pos.x + width / 2, pos.y + height / 2);

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
    ctx.strokeStyle = COLORS.gateBorder;
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
