import { GateType } from '../../engine/types';
import type { Level, TruthTableEntry } from '../Level';

/**
 * Level 61: Wire Spaghetti
 *
 * Build a byte-wide 2:1 multiplexer.
 * When SEL=0, output A7..A0. When SEL=1, output B7..B0.
 */
function muxEntry(a: number, b: number, sel: boolean): TruthTableEntry {
  const r = sel ? b : a;
  const inputs: Record<string, boolean> = { SEL: sel };
  const outputs: Record<string, boolean> = {};
  for (let i = 0; i < 8; i++) {
    inputs[`A${i}`] = !!(a & (1 << i));
    inputs[`B${i}`] = !!(b & (1 << i));
    outputs[`R${i}`] = !!(r & (1 << i));
  }
  return { inputs, outputs };
}

export const level61WireSpaghetti: Level = {
  id: '61-wire-spaghetti',
  name: 'Wire Spaghetti',
  section: 'CPU Architecture 2',
  prerequisites: ['60-wide-instructions'],
  unlocks: ['62-opcodes'],
  description:
    'Build an 8-bit 2:1 multiplexer. When SEL=0, pass through the 8-bit input A. When SEL=1, pass through B. Untangle the wire spaghetti!',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
  ],
  inputs: (() => {
    const pins = [];
    for (let i = 7; i >= 0; i--) pins.push({ name: `A${i}` });
    for (let i = 7; i >= 0; i--) pins.push({ name: `B${i}` });
    pins.push({ name: 'SEL' });
    return pins;
  })(),
  outputs: (() => {
    const pins = [];
    for (let i = 7; i >= 0; i--) pins.push({ name: `R${i}` });
    return pins;
  })(),
  truthTable: [
    muxEntry(0xaa, 0x55, false),
    muxEntry(0xaa, 0x55, true),
    muxEntry(0xff, 0x00, false),
    muxEntry(0xff, 0x00, true),
    muxEntry(0x00, 0xff, false),
    muxEntry(0x00, 0xff, true),
    muxEntry(0x12, 0x34, false),
    muxEntry(0x12, 0x34, true),
  ],
  hints: [
    'For each bit: Ri = (Ai AND NOT SEL) OR (Bi AND SEL)',
    'Build one 1-bit mux and repeat for all 8 bits',
  ],
};
