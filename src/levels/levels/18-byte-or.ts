import { GateType } from '../../engine/types';
import type { Level, TruthTableEntry } from '../Level';

function byteOrEntry(a: number, b: number): TruthTableEntry {
  const inputs: Record<string, boolean> = {};
  const outputs: Record<string, boolean> = {};
  const result = a | b;
  for (let i = 0; i < 8; i++) {
    inputs[`A${i}`] = !!(a & (1 << i));
    inputs[`B${i}`] = !!(b & (1 << i));
    outputs[`O${i}`] = !!(result & (1 << i));
  }
  return { inputs, outputs };
}

export const level18ByteOr: Level = {
  id: '18-byte-or',
  name: 'Byte OR',
  section: 'Arithmetic and Memory',
  prerequisites: ['17-double-the-number'],
  description:
    'OR together two byte values bitwise.',
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
    { name: 'A0' },
    { name: 'A1' },
    { name: 'A2' },
    { name: 'A3' },
    { name: 'A4' },
    { name: 'A5' },
    { name: 'A6' },
    { name: 'A7' },
    { name: 'B0' },
    { name: 'B1' },
    { name: 'B2' },
    { name: 'B3' },
    { name: 'B4' },
    { name: 'B5' },
    { name: 'B6' },
    { name: 'B7' },
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
    byteOrEntry(0x00, 0x00),
    byteOrEntry(0xff, 0x00),
    byteOrEntry(0x00, 0xff),
    byteOrEntry(0xff, 0xff),
    byteOrEntry(0xaa, 0x55),
    byteOrEntry(0x55, 0xaa),
    byteOrEntry(0x0f, 0xf0),
    byteOrEntry(0xf0, 0x0f),
    byteOrEntry(0x12, 0x34),
    byteOrEntry(0x80, 0x01),
    byteOrEntry(0x01, 0x80),
    byteOrEntry(0x42, 0x24),
    byteOrEntry(0x7f, 0x80),
    byteOrEntry(0xc3, 0x3c),
    byteOrEntry(0x69, 0x96),
    byteOrEntry(0x11, 0x22),
    byteOrEntry(0x0a, 0x50),
    byteOrEntry(0xfe, 0x01),
    byteOrEntry(0xab, 0xcd),
    byteOrEntry(0x37, 0x48),
  ],
  hints: [
    'Each output bit only depends on the two corresponding input bits',
    'You need 8 independent OR operations',
  ],
};
