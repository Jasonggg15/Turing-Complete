import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level12XnorGate: Level = {
  id: '12-xnor-gate',
  name: 'XNOR Gate',
  section: 'Basic Logic',
  prerequisites: ['10-bigger-or-gate', '11-bigger-and-gate'],
  unlocks: ['13-odd-number-of-signals'],
  description: 'Create the XNOR gate - inverse of XOR.',
  availableGates: [GateType.NAND, GateType.NOT, GateType.AND, GateType.OR, GateType.XOR],
  inputs: [{ name: 'Input 1' }, { name: 'Input 2' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { 'Input 1': false, 'Input 2': false }, outputs: { Output: true } },
    { inputs: { 'Input 1': false, 'Input 2': true }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': true }, outputs: { Output: true } },
  ],
  hints: ['XNOR is the inverse of XOR'],
};
