import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level02And: Level = {
  id: '02-and',
  name: 'AND',
  description:
    'Build an AND gate using only NAND gates. An AND gate outputs 1 only when both inputs are 1.',
  availableGates: [GateType.NAND],
  inputs: [{ name: 'A' }, { name: 'B' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false, B: false }, outputs: { OUT: false } },
    { inputs: { A: false, B: true }, outputs: { OUT: false } },
    { inputs: { A: true, B: false }, outputs: { OUT: false } },
    { inputs: { A: true, B: true }, outputs: { OUT: true } },
  ],
  hints: ['NAND then NOT (which you built in level 1)'],
  unlocks: ['03-or'],
};
