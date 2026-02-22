import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level05OrGate: Level = {
  id: '05-or-gate',
  name: 'OR Gate',
  section: 'Basic Logic',
  prerequisites: ['03-not-gate'],
  description:
    'Create the OR gate by placing NOT gates on both inputs of a NAND gate.',
  availableGates: [GateType.NAND, GateType.NOT],
  inputs: [{ name: 'Input 1' }, { name: 'Input 2' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { 'Input 1': false, 'Input 2': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': false, 'Input 2': true }, outputs: { Output: true } },
    { inputs: { 'Input 1': true, 'Input 2': false }, outputs: { Output: true } },
    { inputs: { 'Input 1': true, 'Input 2': true }, outputs: { Output: true } },
  ],
  hints: ['Invert both inputs, then NAND them'],
};
