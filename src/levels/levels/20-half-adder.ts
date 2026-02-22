import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level20HalfAdder: Level = {
  id: '20-half-adder',
  name: 'Half Adder',
  section: 'Arithmetic and Memory',
  prerequisites: ['12-xnor-gate'],
  description:
    'Create a basic arithmetic circuit that adds two bits producing a sum and a carry.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.NOR,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }],
  outputs: [{ name: 'SUM' }, { name: 'CAR' }],
  truthTable: [
    { inputs: { A: false, B: false }, outputs: { SUM: false, CAR: false } },
    { inputs: { A: false, B: true }, outputs: { SUM: true, CAR: false } },
    { inputs: { A: true, B: false }, outputs: { SUM: true, CAR: false } },
    { inputs: { A: true, B: true }, outputs: { SUM: false, CAR: true } },
  ],
  hints: [
    'SUM is the XOR of the two inputs',
    'CARRY is the AND of the two inputs',
  ],
  unlocksComponent: { name: 'Half Adder', gateType: GateType.HALF_ADDER },
};
