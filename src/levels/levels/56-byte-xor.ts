import { GateType } from '../../engine/types';
import type { Level, TruthTableEntry } from '../Level';

/**
 * Level 56: Byte XOR
 *
 * Full 8-bit bitwise XOR of two bytes.
 */
function byteXorEntry(a: number, b: number): TruthTableEntry {
  const r = a ^ b;
  const inputs: Record<string, boolean> = {};
  const outputs: Record<string, boolean> = {};
  for (let i = 0; i < 8; i++) {
    inputs[`A${i}`] = !!(a & (1 << i));
    inputs[`B${i}`] = !!(b & (1 << i));
    outputs[`R${i}`] = !!(r & (1 << i));
  }
  return { inputs, outputs };
}

export const level56ByteXor: Level = {
  id: '56-byte-xor',
  name: 'Byte XOR',
  section: 'CPU Architecture 2',
  description:
    'Build an 8-bit bitwise XOR unit. Each output bit Ri = Ai XOR Bi.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
  ],
  inputs: (() => {
    const pins = [];
    for (let i = 7; i >= 0; i--) pins.push({ name: `A${i}` });
    for (let i = 7; i >= 0; i--) pins.push({ name: `B${i}` });
    return pins;
  })(),
  outputs: (() => {
    const pins = [];
    for (let i = 7; i >= 0; i--) pins.push({ name: `R${i}` });
    return pins;
  })(),
  truthTable: [
    byteXorEntry(0x00, 0x00),
    byteXorEntry(0xff, 0x00),
    byteXorEntry(0x00, 0xff),
    byteXorEntry(0xff, 0xff),
    byteXorEntry(0xaa, 0x55),
    byteXorEntry(0x55, 0xaa),
    byteXorEntry(0x0f, 0xf0),
    byteXorEntry(0x37, 0xc8),
    byteXorEntry(0x12, 0x34),
  ],
  hints: [
    'Wire 8 parallel XOR gates — one per bit',
  ],
  unlocks: ['57-equality'],
};
