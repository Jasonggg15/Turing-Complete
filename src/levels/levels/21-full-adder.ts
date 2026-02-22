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
  inputs: [{ name: 'Input A' }, { name: 'Input B' }, { name: 'Carry In' }],
  outputs: [{ name: 'Sum' }, { name: 'Carry Out' }],
  truthTable: [
    { inputs: { 'Input A': false, 'Input B': false, 'Carry In': false }, outputs: { Sum: false, 'Carry Out': false } },
    { inputs: { 'Input A': true, 'Input B': false, 'Carry In': false }, outputs: { Sum: true, 'Carry Out': false } },
    { inputs: { 'Input A': false, 'Input B': true, 'Carry In': false }, outputs: { Sum: true, 'Carry Out': false } },
    { inputs: { 'Input A': true, 'Input B': true, 'Carry In': false }, outputs: { Sum: false, 'Carry Out': true } },
    { inputs: { 'Input A': false, 'Input B': false, 'Carry In': true }, outputs: { Sum: true, 'Carry Out': false } },
    { inputs: { 'Input A': true, 'Input B': false, 'Carry In': true }, outputs: { Sum: false, 'Carry Out': true } },
    { inputs: { 'Input A': false, 'Input B': true, 'Carry In': true }, outputs: { Sum: false, 'Carry Out': true } },
    { inputs: { 'Input A': true, 'Input B': true, 'Carry In': true }, outputs: { Sum: true, 'Carry Out': true } },
  ],
  hints: [
    'A full adder can be built from two half adders',
    'Chain the carry output of the first half adder into the second',
  ],
  unlocksComponent: { name: 'Full Adder', gateType: GateType.FULL_ADDER },
};
