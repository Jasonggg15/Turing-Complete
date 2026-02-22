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
    GateType.XOR,
  ],
  inputs: [{ name: 'Input A' }, { name: 'Input B' }],
  outputs: [{ name: 'Sum' }, { name: 'Carry' }],
  truthTable: [
    { inputs: { 'Input A': false, 'Input B': false }, outputs: { Sum: false, Carry: false } },
    { inputs: { 'Input A': false, 'Input B': true }, outputs: { Sum: true, Carry: false } },
    { inputs: { 'Input A': true, 'Input B': false }, outputs: { Sum: true, Carry: false } },
    { inputs: { 'Input A': true, 'Input B': true }, outputs: { Sum: false, Carry: true } },
  ],
  hints: [
    'Sum is the XOR of the two inputs',
    'Carry is the AND of the two inputs',
  ],
  unlocksComponent: { name: 'Half Adder', gateType: GateType.HALF_ADDER },
};
