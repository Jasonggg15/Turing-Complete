import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level12XnorGate: Level = {
  id: '12-xnor-gate',
  name: 'XNOR Gate',
  section: 'Basic Logic',
  prerequisites: ['10-bigger-or-gate', '11-bigger-and-gate'],
  description: 'Create the XNOR gate - inverse of XOR.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.NOR,
    GateType.XOR,
  ],
  inputs: [{ name: 'Input One' }, { name: 'Input Two' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { 'Input One': false, 'Input Two': false }, outputs: { Output: true } },
    { inputs: { 'Input One': false, 'Input Two': true }, outputs: { Output: false } },
    { inputs: { 'Input One': true, 'Input Two': false }, outputs: { Output: false } },
    { inputs: { 'Input One': true, 'Input Two': true }, outputs: { Output: true } },
  ],
  hints: ['XNOR is the inverse of XOR'],
};
