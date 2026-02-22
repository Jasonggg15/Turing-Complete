import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level23NegativeNumbers: Level = {
  id: '23-negative-numbers',
  name: 'Negative Numbers',
  section: 'Arithmetic and Memory',
  prerequisites: ['18-byte-or', '22-adding-bytes'],
  description:
    "Represent negative numbers in binary using two's complement. Detect when a 4-bit signed number is negative (sign bit set).",
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'B3' }, { name: 'B2' }, { name: 'B1' }, { name: 'B0' }],
  outputs: [{ name: 'IS_NEG' }],
  truthTable: [
    {
      inputs: { B3: false, B2: false, B1: false, B0: false },
      outputs: { IS_NEG: false },
    },
    {
      inputs: { B3: false, B2: false, B1: false, B0: true },
      outputs: { IS_NEG: false },
    },
    {
      inputs: { B3: false, B2: false, B1: true, B0: false },
      outputs: { IS_NEG: false },
    },
    {
      inputs: { B3: false, B2: false, B1: true, B0: true },
      outputs: { IS_NEG: false },
    },
    {
      inputs: { B3: false, B2: true, B1: false, B0: false },
      outputs: { IS_NEG: false },
    },
    {
      inputs: { B3: false, B2: true, B1: false, B0: true },
      outputs: { IS_NEG: false },
    },
    {
      inputs: { B3: false, B2: true, B1: true, B0: false },
      outputs: { IS_NEG: false },
    },
    {
      inputs: { B3: false, B2: true, B1: true, B0: true },
      outputs: { IS_NEG: false },
    },
    {
      inputs: { B3: true, B2: false, B1: false, B0: false },
      outputs: { IS_NEG: true },
    },
    {
      inputs: { B3: true, B2: false, B1: false, B0: true },
      outputs: { IS_NEG: true },
    },
    {
      inputs: { B3: true, B2: false, B1: true, B0: false },
      outputs: { IS_NEG: true },
    },
    {
      inputs: { B3: true, B2: false, B1: true, B0: true },
      outputs: { IS_NEG: true },
    },
    {
      inputs: { B3: true, B2: true, B1: false, B0: false },
      outputs: { IS_NEG: true },
    },
    {
      inputs: { B3: true, B2: true, B1: false, B0: true },
      outputs: { IS_NEG: true },
    },
    {
      inputs: { B3: true, B2: true, B1: true, B0: false },
      outputs: { IS_NEG: true },
    },
    {
      inputs: { B3: true, B2: true, B1: true, B0: true },
      outputs: { IS_NEG: true },
    },
  ],
  hints: [
    "In two's complement, the most significant bit is the sign bit",
    'A negative number always has its MSB set to 1',
  ],
};
