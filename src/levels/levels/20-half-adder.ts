import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level20HalfAdder: Level = {
  id: '20-half-adder',
  name: 'Half Adder',
  section: 'Arithmetic and Memory',
  prerequisites: ['16-counting-signals'],
  unlocksComponent: { name: 'Half Adder', gateType: GateType.HALF_ADDER },
  description:
    'Build a half adder that adds two single bits. It produces a sum bit and a carry bit.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }],
  outputs: [{ name: 'SUM' }, { name: 'CARRY' }],
  truthTable: [
    { inputs: { A: false, B: false }, outputs: { SUM: false, CARRY: false } },
    { inputs: { A: false, B: true }, outputs: { SUM: true, CARRY: false } },
    { inputs: { A: true, B: false }, outputs: { SUM: true, CARRY: false } },
    { inputs: { A: true, B: true }, outputs: { SUM: false, CARRY: true } },
  ],
  hints: [
    'SUM is 1 when inputs differ (XOR)',
    'CARRY is 1 when both inputs are 1 (AND)',
  ],
};
