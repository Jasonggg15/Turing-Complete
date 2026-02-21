import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level21FullAdder: Level = {
  id: '21-full-adder',
  name: 'Full Adder',
  section: 'Arithmetic',
  description:
    'Build a full adder that adds two bits plus a carry-in. It produces a sum and carry-out.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }, { name: 'CIN' }],
  outputs: [{ name: 'SUM' }, { name: 'COUT' }],
  truthTable: [
    {
      inputs: { A: false, B: false, CIN: false },
      outputs: { SUM: false, COUT: false },
    },
    {
      inputs: { A: false, B: false, CIN: true },
      outputs: { SUM: true, COUT: false },
    },
    {
      inputs: { A: false, B: true, CIN: false },
      outputs: { SUM: true, COUT: false },
    },
    {
      inputs: { A: false, B: true, CIN: true },
      outputs: { SUM: false, COUT: true },
    },
    {
      inputs: { A: true, B: false, CIN: false },
      outputs: { SUM: true, COUT: false },
    },
    {
      inputs: { A: true, B: false, CIN: true },
      outputs: { SUM: false, COUT: true },
    },
    {
      inputs: { A: true, B: true, CIN: false },
      outputs: { SUM: false, COUT: true },
    },
    {
      inputs: { A: true, B: true, CIN: true },
      outputs: { SUM: true, COUT: true },
    },
  ],
  hints: [
    'A full adder is two half adders chained together',
    'The carry-out is 1 when at least 2 of the 3 inputs are 1',
  ],
  unlocks: ['22-adding-bytes'],
};
