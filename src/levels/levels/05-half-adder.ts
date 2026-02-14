import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level05HalfAdder: Level = {
  id: '05-half-adder',
  name: 'Half Adder',
  description:
    'Build a half adder. It adds two single bits, producing a SUM and a CARRY output.',
  availableGates: [
    GateType.NAND,
    GateType.AND,
    GateType.OR,
    GateType.NOT,
    GateType.XOR,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }],
  outputs: [{ name: 'SUM' }, { name: 'CARRY' }],
  truthTable: [
    { inputs: { A: false, B: false }, outputs: { SUM: false, CARRY: false } },
    { inputs: { A: false, B: true }, outputs: { SUM: true, CARRY: false } },
    { inputs: { A: true, B: false }, outputs: { SUM: true, CARRY: false } },
    { inputs: { A: true, B: true }, outputs: { SUM: false, CARRY: true } },
  ],
  hints: ['SUM is XOR, CARRY is AND'],
  unlocks: [],
};
