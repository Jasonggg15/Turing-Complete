import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level21FullAdder: Level = {
  id: '21-full-adder',
  name: 'Full Adder',
  section: 'Arithmetic and Memory',
  prerequisites: ['20-half-adder'],
  description:
    'Construct a full adder combining two input bits and a carry bit to produce a sum and carry-over.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.HALF_ADDER,
  ],
  inputs: [{ name: 'Input 1' }, { name: 'Input 2' }, { name: 'Carry In' }],
  outputs: [{ name: 'SUM' }, { name: 'CAR' }],
  truthTable: [
    { inputs: { 'Input 1': false, 'Input 2': false, 'Carry In': false }, outputs: { SUM: false, CAR: false } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Carry In': false }, outputs: { SUM: true, CAR: false } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Carry In': false }, outputs: { SUM: true, CAR: false } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Carry In': false }, outputs: { SUM: false, CAR: true } },
    { inputs: { 'Input 1': false, 'Input 2': false, 'Carry In': true }, outputs: { SUM: true, CAR: false } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Carry In': true }, outputs: { SUM: false, CAR: true } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Carry In': true }, outputs: { SUM: false, CAR: true } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Carry In': true }, outputs: { SUM: true, CAR: true } },
  ],
  hints: [
    'A full adder can be built from two half adders',
    'Chain the carry output of the first half adder into the second',
  ],
  unlocksComponent: { name: 'Full Adder', gateType: GateType.FULL_ADDER },
};
