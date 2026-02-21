import { GateType } from '../../engine/types';
import type { Level, TruthTableEntry } from '../Level';

/**
 * Level 58: Unsigned Less
 *
 * Compare two 4-bit unsigned values: output LT=1 when A < B.
 */
function uLessEntry(a: number, b: number): TruthTableEntry {
  const inputs: Record<string, boolean> = {};
  for (let i = 0; i < 4; i++) {
    inputs[`A${i}`] = !!(a & (1 << i));
    inputs[`B${i}`] = !!(b & (1 << i));
  }
  return { inputs, outputs: { LT: a < b } };
}

export const level58UnsignedLess: Level = {
  id: '58-unsigned-less',
  name: 'Unsigned Less',
  section: 'CPU Architecture 2',
  prerequisites: ['57-equality'],
  description:
    'Build a 4-bit unsigned comparator. Output LT=1 when the unsigned value A is strictly less than B.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.NOR,
    GateType.XNOR,
  ],
  inputs: [
    { name: 'A3' }, { name: 'A2' }, { name: 'A1' }, { name: 'A0' },
    { name: 'B3' }, { name: 'B2' }, { name: 'B1' }, { name: 'B0' },
  ],
  outputs: [{ name: 'LT' }],
  truthTable: [
    uLessEntry(0, 0),
    uLessEntry(0, 1),
    uLessEntry(1, 0),
    uLessEntry(5, 10),
    uLessEntry(10, 5),
    uLessEntry(7, 8),
    uLessEntry(8, 7),
    uLessEntry(15, 15),
    uLessEntry(0, 15),
    uLessEntry(15, 0),
    uLessEntry(3, 3),
    uLessEntry(6, 7),
    uLessEntry(7, 6),
    uLessEntry(14, 15),
  ],
  hints: [
    'Subtract A - B using two\'s complement and check the borrow (carry) output',
    'Alternatively, compare bit-by-bit from MSB to LSB',
    'A < B when the subtraction A - B produces a borrow (no carry out)',
  ],
};
