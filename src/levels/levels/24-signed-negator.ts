import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level24SignedNegator: Level = {
  id: '24-signed-negator',
  name: 'Signed Negator',
  section: 'Arithmetic',
  description:
    "Negate a 4-bit two's complement number. To negate: invert all bits, then add 1.",
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
  outputs: [{ name: 'N3' }, { name: 'N2' }, { name: 'N1' }, { name: 'N0' }],
  truthTable: [
    {
      inputs: { B3: false, B2: false, B1: false, B0: false },
      outputs: { N3: false, N2: false, N1: false, N0: false },
    },
    {
      inputs: { B3: false, B2: false, B1: false, B0: true },
      outputs: { N3: true, N2: true, N1: true, N0: true },
    },
    {
      inputs: { B3: false, B2: false, B1: true, B0: false },
      outputs: { N3: true, N2: true, N1: true, N0: false },
    },
    {
      inputs: { B3: false, B2: false, B1: true, B0: true },
      outputs: { N3: true, N2: true, N1: false, N0: true },
    },
    {
      inputs: { B3: false, B2: true, B1: false, B0: false },
      outputs: { N3: true, N2: true, N1: false, N0: false },
    },
    {
      inputs: { B3: false, B2: true, B1: false, B0: true },
      outputs: { N3: true, N2: false, N1: true, N0: true },
    },
    {
      inputs: { B3: false, B2: true, B1: true, B0: false },
      outputs: { N3: true, N2: false, N1: true, N0: false },
    },
    {
      inputs: { B3: false, B2: true, B1: true, B0: true },
      outputs: { N3: true, N2: false, N1: false, N0: true },
    },
    {
      inputs: { B3: true, B2: false, B1: false, B0: false },
      outputs: { N3: true, N2: false, N1: false, N0: false },
    },
    {
      inputs: { B3: true, B2: false, B1: false, B0: true },
      outputs: { N3: false, N2: true, N1: true, N0: true },
    },
    {
      inputs: { B3: true, B2: false, B1: true, B0: false },
      outputs: { N3: false, N2: true, N1: true, N0: false },
    },
    {
      inputs: { B3: true, B2: false, B1: true, B0: true },
      outputs: { N3: false, N2: true, N1: false, N0: true },
    },
    {
      inputs: { B3: true, B2: true, B1: false, B0: false },
      outputs: { N3: false, N2: true, N1: false, N0: false },
    },
    {
      inputs: { B3: true, B2: true, B1: false, B0: true },
      outputs: { N3: false, N2: false, N1: true, N0: true },
    },
    {
      inputs: { B3: true, B2: true, B1: true, B0: false },
      outputs: { N3: false, N2: false, N1: true, N0: false },
    },
    {
      inputs: { B3: true, B2: true, B1: true, B0: true },
      outputs: { N3: false, N2: false, N1: false, N0: true },
    },
  ],
  hints: [
    "Two's complement negation: invert all bits, then add 1",
    'You can build this with NOT gates and a chain of half/full adders',
  ],
  unlocks: ['25-1-bit-decoder'],
};
