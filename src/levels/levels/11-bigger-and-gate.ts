import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level11BiggerAndGate: Level = {
  id: '11-bigger-and-gate',
  name: 'Bigger AND Gate',
  section: 'Basic Logic',
  prerequisites: ['09-xor-gate'],
  unlocks: ['12-xnor-gate', '28-circular-dependency'],
  description: 'Create a three-input version of the AND gate.',
  availableGates: [GateType.NAND, GateType.NOT, GateType.AND, GateType.OR, GateType.XOR],
  inputs: [{ name: 'Input 1' }, { name: 'Input 2' }, { name: 'Input 3' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { 'Input 1': false, 'Input 2': false, 'Input 3': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': false, 'Input 2': false, 'Input 3': true }, outputs: { Output: false } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Input 3': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Input 3': true }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Input 3': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Input 3': true }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Input 3': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Input 3': true }, outputs: { Output: true } },
  ],
  hints: ['Chain two AND gates'],
};
