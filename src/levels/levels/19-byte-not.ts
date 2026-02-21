import { GateType } from '../../engine/types';
import type { Level, TruthTableEntry } from '../Level';

function byteNotEntry(val: number): TruthTableEntry {
  const inputs: Record<string, boolean> = {};
  const outputs: Record<string, boolean> = {};
  const result = ~val & 0xff;
  for (let i = 0; i < 8; i++) {
    inputs[`I${i}`] = !!(val & (1 << i));
    outputs[`O${i}`] = !!(result & (1 << i));
  }
  return { inputs, outputs };
}

export const level19ByteNot: Level = {
  id: '19-byte-not',
  name: 'Byte NOT',
  section: 'Arithmetic',
  description:
    'Invert every bit of an 8-bit number. Each output bit is the NOT of the corresponding input bit.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [
    { name: 'I0' },
    { name: 'I1' },
    { name: 'I2' },
    { name: 'I3' },
    { name: 'I4' },
    { name: 'I5' },
    { name: 'I6' },
    { name: 'I7' },
  ],
  outputs: [
    { name: 'O0' },
    { name: 'O1' },
    { name: 'O2' },
    { name: 'O3' },
    { name: 'O4' },
    { name: 'O5' },
    { name: 'O6' },
    { name: 'O7' },
  ],
  truthTable: [
    byteNotEntry(0x00),
    byteNotEntry(0xff),
    byteNotEntry(0xaa),
    byteNotEntry(0x55),
    byteNotEntry(0x0f),
    byteNotEntry(0xf0),
    byteNotEntry(0x01),
    byteNotEntry(0x80),
    byteNotEntry(0x42),
    byteNotEntry(0x7f),
    byteNotEntry(0xfe),
    byteNotEntry(0xc3),
    byteNotEntry(0x3c),
    byteNotEntry(0x69),
    byteNotEntry(0x96),
    byteNotEntry(0x12),
  ],
  hints: ['Each output bit is independent', 'You need 8 NOT operations'],
  unlocks: ['20-half-adder'],
};
