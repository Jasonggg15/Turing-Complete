import { GateType } from '../../engine/types';
import type { Level, TruthTableEntry } from '../Level';

/**
 * Level 59: Signed Less
 *
 * Compare two 4-bit signed (two's complement) values: output LT=1 when A < B.
 * 4-bit signed range: -8 to +7.
 */
function toSigned4(v: number): number {
  return v > 7 ? v - 16 : v;
}

function sLessEntry(a: number, b: number): TruthTableEntry {
  const inputs: Record<string, boolean> = {};
  for (let i = 0; i < 4; i++) {
    inputs[`A${i}`] = !!(a & (1 << i));
    inputs[`B${i}`] = !!(b & (1 << i));
  }
  return { inputs, outputs: { LT: toSigned4(a) < toSigned4(b) } };
}

export const level59SignedLess: Level = {
  id: '59-signed-less',
  name: 'Signed Less',
  section: 'CPU Architecture 2',
  prerequisites: ['57-equality'],
  description:
    "Build a 4-bit signed comparator (two's complement). Output LT=1 when the signed value A is strictly less than B. Range is -8 to +7.",
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
    sLessEntry(0, 0),     // 0 < 0 = false
    sLessEntry(1, 2),     // 1 < 2 = true
    sLessEntry(2, 1),     // 2 < 1 = false
    sLessEntry(0b1000, 0), // -8 < 0 = true
    sLessEntry(0, 0b1000), // 0 < -8 = false
    sLessEntry(0b1111, 0), // -1 < 0 = true
    sLessEntry(0, 0b1111), // 0 < -1 = false
    sLessEntry(0b1000, 0b1111), // -8 < -1 = true
    sLessEntry(0b1111, 0b1000), // -1 < -8 = false
    sLessEntry(7, 7),     // 7 < 7 = false
    sLessEntry(0b1110, 0b1101), // -2 < -3 = false
    sLessEntry(0b1101, 0b1110), // -3 < -2 = true
    sLessEntry(7, 0b1000), // 7 < -8 = false
    sLessEntry(0b1000, 7), // -8 < 7 = true
  ],
  hints: [
    'Flip the sign bits of both inputs, then use an unsigned comparator',
    'Alternatively: subtract A - B, then check if the result is negative (considering overflow)',
  ],
};
