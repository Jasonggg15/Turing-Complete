import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level251BitDecoder: Level = {
  id: '25-1-bit-decoder',
  name: '1 Bit Decoder',
  section: 'Arithmetic and Memory',
  prerequisites: ['36-saving-bytes'],
  description:
    'Build a 1-to-2 decoder. Given one input, activate exactly one of two outputs.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'IN' }],
  outputs: [{ name: 'O0' }, { name: 'O1' }],
  truthTable: [
    { inputs: { IN: false }, outputs: { O0: true, O1: false } },
    { inputs: { IN: true }, outputs: { O0: false, O1: true } },
  ],
  hints: ['One output is the input itself, the other is its inverse'],
};
