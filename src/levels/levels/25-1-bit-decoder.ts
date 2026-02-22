import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level251BitDecoder: Level = {
  id: '25-1-bit-decoder',
  name: '1 Bit Decoder',
  section: 'Arithmetic and Memory',
  prerequisites: ['36-saving-bytes'],
  description:
    'Create a circuit that outputs ON to one of two pins depending on the input signal. One output is the input, the other is its inverse.',
  availableGates: [GateType.NOT],
  inputs: [{ name: 'Input' }],
  outputs: [{ name: 'Output 0' }, { name: 'Output 1' }],
  truthTable: [
    { inputs: { Input: false }, outputs: { 'Output 0': true, 'Output 1': false } },
    { inputs: { Input: true }, outputs: { 'Output 0': false, 'Output 1': true } },
  ],
  hints: ['One output is the input itself, the other is its inverse'],
};
