import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level15BinaryRacer: Level = {
  id: '15-binary-racer',
  name: 'Binary Racer',
  section: 'Arithmetic and Memory',
  prerequisites: ['10-bigger-or-gate'],
  description:
    'Convert decimal numbers to binary by toggling input bits to match the target value. Detect when the 3-bit input represents exactly the number 5 (binary 101).',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.NOR,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'Bit 2' }, { name: 'Bit 1' }, { name: 'Bit 0' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { 'Bit 2': false, 'Bit 1': false, 'Bit 0': false }, outputs: { Output: false } },
    { inputs: { 'Bit 2': false, 'Bit 1': false, 'Bit 0': true }, outputs: { Output: false } },
    { inputs: { 'Bit 2': false, 'Bit 1': true, 'Bit 0': false }, outputs: { Output: false } },
    { inputs: { 'Bit 2': false, 'Bit 1': true, 'Bit 0': true }, outputs: { Output: false } },
    { inputs: { 'Bit 2': true, 'Bit 1': false, 'Bit 0': false }, outputs: { Output: false } },
    { inputs: { 'Bit 2': true, 'Bit 1': false, 'Bit 0': true }, outputs: { Output: true } },
    { inputs: { 'Bit 2': true, 'Bit 1': true, 'Bit 0': false }, outputs: { Output: false } },
    { inputs: { 'Bit 2': true, 'Bit 1': true, 'Bit 0': true }, outputs: { Output: false } },
  ],
  hints: [
    'The number 5 in binary is 101',
    'Use AND with NOT to detect a specific pattern',
  ],
};
