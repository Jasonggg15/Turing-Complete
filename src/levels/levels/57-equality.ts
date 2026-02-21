import { GateType } from '../../engine/types';
import type { Level, TruthTableEntry } from '../Level';

/**
 * Level 57: Equality
 *
 * Compare two 4-bit values for equality.
 */
function eqEntry(a: number, b: number): TruthTableEntry {
  const inputs: Record<string, boolean> = {};
  for (let i = 0; i < 4; i++) {
    inputs[`A${i}`] = !!(a & (1 << i));
    inputs[`B${i}`] = !!(b & (1 << i));
  }
  return { inputs, outputs: { EQ: a === b } };
}

export const level57Equality: Level = {
  id: '57-equality',
  name: 'Equality',
  section: 'CPU Architecture 2',
  prerequisites: ['55-byte-constant'],
  description:
    'Build a 4-bit equality comparator. Output EQ=1 when the two 4-bit inputs A and B have the same value, EQ=0 otherwise.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [
    { name: 'A3' }, { name: 'A2' }, { name: 'A1' }, { name: 'A0' },
    { name: 'B3' }, { name: 'B2' }, { name: 'B1' }, { name: 'B0' },
  ],
  outputs: [{ name: 'EQ' }],
  truthTable: [
    eqEntry(0, 0),
    eqEntry(5, 5),
    eqEntry(15, 15),
    eqEntry(0, 1),
    eqEntry(1, 0),
    eqEntry(7, 8),
    eqEntry(8, 7),
    eqEntry(10, 5),
    eqEntry(3, 12),
    eqEntry(9, 9),
    eqEntry(6, 6),
    eqEntry(6, 9),
  ],
  hints: [
    'XNOR each pair of bits: Ai XNOR Bi = 1 when equal',
    'AND all four XNOR results together for the final EQ output',
  ],
};
