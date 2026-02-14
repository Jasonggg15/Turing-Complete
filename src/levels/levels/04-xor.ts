import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level04Xor: Level = {
  id: '04-xor',
  name: 'XOR',
  description:
    'Build an XOR gate. An XOR gate outputs 1 when exactly one input is 1.',
  availableGates: [GateType.NAND, GateType.AND, GateType.OR, GateType.NOT],
  inputs: [{ name: 'A' }, { name: 'B' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false, B: false }, outputs: { OUT: false } },
    { inputs: { A: false, B: true }, outputs: { OUT: true } },
    { inputs: { A: true, B: false }, outputs: { OUT: true } },
    { inputs: { A: true, B: true }, outputs: { OUT: false } },
  ],
  hints: ['(A OR B) AND NOT (A AND B)'],
  unlocks: ['05-half-adder'],
};
