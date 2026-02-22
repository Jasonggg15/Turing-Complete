import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level09XorGate: Level = {
  id: '09-xor-gate',
  name: 'XOR Gate',
  section: 'Basic Logic',
  prerequisites: ['08-second-tick'],
  description:
    'Create the XOR gate - like OR except outputs false if both inputs are true.',
  availableGates: [GateType.NAND, GateType.NOT, GateType.AND, GateType.OR],
  inputs: [{ name: 'Input 1' }, { name: 'Input 2' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { 'Input 1': false, 'Input 2': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': false, 'Input 2': true }, outputs: { Output: true } },
    { inputs: { 'Input 1': true, 'Input 2': false }, outputs: { Output: true } },
    { inputs: { 'Input 1': true, 'Input 2': true }, outputs: { Output: false } },
  ],
  hints: ['Classic solution uses exactly 4 NAND gates'],
};
