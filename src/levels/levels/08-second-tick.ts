import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level08SecondTick: Level = {
  id: '08-second-tick',
  name: 'Second Tick',
  section: 'Basic Logic',
  prerequisites: ['07-always-on'],
  unlocks: ['09-xor-gate'],
  description:
    'Create a non-standard gate where the output is only true when the first input is true and the second input is false.',
  availableGates: [GateType.NAND, GateType.NOT, GateType.AND, GateType.OR],
  inputs: [{ name: 'Input 1' }, { name: 'Input 2' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { 'Input 1': false, 'Input 2': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': false, 'Input 2': true }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': false }, outputs: { Output: true } },
    { inputs: { 'Input 1': true, 'Input 2': true }, outputs: { Output: false } },
  ],
  hints: ['Invert the second input, then AND with the first'],
};
