import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level01Not: Level = {
  id: '01-not',
  name: 'NOT',
  description:
    'Build a NOT gate using only NAND gates. A NOT gate inverts its input: 0 becomes 1 and 1 becomes 0.',
  availableGates: [GateType.NAND],
  inputs: [{ name: 'A' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false }, outputs: { OUT: true } },
    { inputs: { A: true }, outputs: { OUT: false } },
  ],
  hints: ['Connect both NAND inputs to the same signal'],
  unlocks: ['02-and'],
};
