import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level16CountingSignals: Level = {
  id: '16-counting-signals',
  name: 'Counting Signals',
  section: 'Basic Logic',
  prerequisites: ['14-double-trouble'],
  description:
    'Count the number of ON input signals and output the count as a binary number on 3 output nodes (values 1, 2, 4).',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.NOR,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [
    { name: 'Input 1' },
    { name: 'Input 2' },
    { name: 'Input 3' },
    { name: 'Input 4' },
  ],
  outputs: [
    { name: 'Bit 0' },
    { name: 'Bit 1' },
    { name: 'Bit 2' },
  ],
  truthTable: [
    { inputs: { 'Input 1': false, 'Input 2': false, 'Input 3': false, 'Input 4': false }, outputs: { 'Bit 0': false, 'Bit 1': false, 'Bit 2': false } },
    { inputs: { 'Input 1': false, 'Input 2': false, 'Input 3': false, 'Input 4': true }, outputs: { 'Bit 0': true, 'Bit 1': false, 'Bit 2': false } },
    { inputs: { 'Input 1': false, 'Input 2': false, 'Input 3': true, 'Input 4': false }, outputs: { 'Bit 0': true, 'Bit 1': false, 'Bit 2': false } },
    { inputs: { 'Input 1': false, 'Input 2': false, 'Input 3': true, 'Input 4': true }, outputs: { 'Bit 0': false, 'Bit 1': true, 'Bit 2': false } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Input 3': false, 'Input 4': false }, outputs: { 'Bit 0': true, 'Bit 1': false, 'Bit 2': false } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Input 3': false, 'Input 4': true }, outputs: { 'Bit 0': false, 'Bit 1': true, 'Bit 2': false } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Input 3': true, 'Input 4': false }, outputs: { 'Bit 0': false, 'Bit 1': true, 'Bit 2': false } },
    { inputs: { 'Input 1': false, 'Input 2': true, 'Input 3': true, 'Input 4': true }, outputs: { 'Bit 0': true, 'Bit 1': true, 'Bit 2': false } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Input 3': false, 'Input 4': false }, outputs: { 'Bit 0': true, 'Bit 1': false, 'Bit 2': false } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Input 3': false, 'Input 4': true }, outputs: { 'Bit 0': false, 'Bit 1': true, 'Bit 2': false } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Input 3': true, 'Input 4': false }, outputs: { 'Bit 0': false, 'Bit 1': true, 'Bit 2': false } },
    { inputs: { 'Input 1': true, 'Input 2': false, 'Input 3': true, 'Input 4': true }, outputs: { 'Bit 0': true, 'Bit 1': true, 'Bit 2': false } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Input 3': false, 'Input 4': false }, outputs: { 'Bit 0': false, 'Bit 1': true, 'Bit 2': false } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Input 3': false, 'Input 4': true }, outputs: { 'Bit 0': true, 'Bit 1': true, 'Bit 2': false } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Input 3': true, 'Input 4': false }, outputs: { 'Bit 0': true, 'Bit 1': true, 'Bit 2': false } },
    { inputs: { 'Input 1': true, 'Input 2': true, 'Input 3': true, 'Input 4': true }, outputs: { 'Bit 0': false, 'Bit 1': false, 'Bit 2': true } },
  ],
  hints: [
    'Bit 0 is the parity (odd count) of all inputs',
    'Bit 1 and Bit 2 represent the higher bits of the count',
  ],
};
