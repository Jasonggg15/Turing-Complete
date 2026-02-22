import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level13OddNumberOfSignals: Level = {
  id: '13-odd-number-of-signals',
  name: 'ODD Number of Signals',
  section: 'Basic Logic',
  prerequisites: ['12-xnor-gate'],
  description:
    'Output ON when an odd number of inputs (1 or 3) are ON.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.NOR,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'Input 1' }, { name: 'Input 2' }, { name: 'Input 3' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { 'Input 1': false, 'Input 2': false, 'Input 3': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': false, 'Input 2': false, 'Input 3': true }, outputs: { Output: true } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Input 3': false }, outputs: { Output: true } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Input 3': true }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Input 3': false }, outputs: { Output: true } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Input 3': true }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Input 3': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Input 3': true }, outputs: { Output: true } },
  ],
  hints: [
    'XOR of two signals is 1 when they differ',
    'Chain XOR gates together',
  ],
};
