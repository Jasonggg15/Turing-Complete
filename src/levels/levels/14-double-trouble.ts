import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level14DoubleTrouble: Level = {
  id: '14-double-trouble',
  name: 'Double Trouble',
  section: 'Basic Logic',
  prerequisites: ['10-bigger-or-gate'],
  description:
    'Output an ON signal when at least two of the three inputs are receiving an ON signal.',
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
    { inputs: { 'Input 1': false, 'Input 2': false, 'Input 3': true }, outputs: { Output: false } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Input 3': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Input 3': true }, outputs: { Output: true } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Input 3': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Input 3': true }, outputs: { Output: true } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Input 3': false }, outputs: { Output: true } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Input 3': true }, outputs: { Output: true } },
  ],
  hints: [
    'Output is ON when any two inputs are both ON',
    '(A AND B) OR (A AND C) OR (B AND C)',
  ],
};
