import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level06AndGate: Level = {
  id: '06-and-gate',
  name: 'AND Gate',
  section: 'Basic Logic',
  prerequisites: ['03-not-gate'],
  description: 'Create the AND gate using NAND and NOT gates.',
  availableGates: [GateType.NAND],
  inputs: [{ name: 'Input 1' }, { name: 'Input 2' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { 'Input 1': false, 'Input 2': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': false, 'Input 2': true }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': true }, outputs: { Output: true } },
  ],
  hints: ['NAND is the inverse of AND'],
};
