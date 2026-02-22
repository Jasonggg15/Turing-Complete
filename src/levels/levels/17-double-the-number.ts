import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level17DoubleTheNumber: Level = {
  id: '17-double-the-number',
  name: 'Double the Number',
  section: 'Arithmetic and Memory',
  prerequisites: ['15-binary-racer'],
  description:
    'Double the input value by shifting each bit to its doubled-value position.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'Bit 2' }, { name: 'Bit 1' }, { name: 'Bit 0' }],
  outputs: [{ name: 'Result 3' }, { name: 'Result 2' }, { name: 'Result 1' }, { name: 'Result 0' }],
  truthTable: [
    {
      inputs: { 'Bit 2': false, 'Bit 1': false, 'Bit 0': false },
      outputs: { 'Result 3': false, 'Result 2': false, 'Result 1': false, 'Result 0': false },
    },
    {
      inputs: { 'Bit 2': false, 'Bit 1': false, 'Bit 0': true },
      outputs: { 'Result 3': false, 'Result 2': false, 'Result 1': true, 'Result 0': false },
    },
    {
      inputs: { 'Bit 2': false, 'Bit 1': true, 'Bit 0': false },
      outputs: { 'Result 3': false, 'Result 2': true, 'Result 1': false, 'Result 0': false },
    },
    {
      inputs: { 'Bit 2': false, 'Bit 1': true, 'Bit 0': true },
      outputs: { 'Result 3': false, 'Result 2': true, 'Result 1': true, 'Result 0': false },
    },
    {
      inputs: { 'Bit 2': true, 'Bit 1': false, 'Bit 0': false },
      outputs: { 'Result 3': true, 'Result 2': false, 'Result 1': false, 'Result 0': false },
    },
    {
      inputs: { 'Bit 2': true, 'Bit 1': false, 'Bit 0': true },
      outputs: { 'Result 3': true, 'Result 2': false, 'Result 1': true, 'Result 0': false },
    },
    {
      inputs: { 'Bit 2': true, 'Bit 1': true, 'Bit 0': false },
      outputs: { 'Result 3': true, 'Result 2': true, 'Result 1': false, 'Result 0': false },
    },
    {
      inputs: { 'Bit 2': true, 'Bit 1': true, 'Bit 0': true },
      outputs: { 'Result 3': true, 'Result 2': true, 'Result 1': true, 'Result 0': false },
    },
  ],
  hints: [
    'Doubling in binary is the same as shifting left by one position',
    'The least significant bit of the result is always 0',
  ],
};
