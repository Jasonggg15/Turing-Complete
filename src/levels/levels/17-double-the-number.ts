import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level17DoubleTheNumber: Level = {
  id: '17-double-the-number',
  name: 'Double the Number',
  section: 'Arithmetic and Memory',
  prerequisites: ['15-binary-racer'],
  description:
    'Double a 3-bit binary number by shifting it left. The result is a 4-bit number.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'B2' }, { name: 'B1' }, { name: 'B0' }],
  outputs: [{ name: 'R3' }, { name: 'R2' }, { name: 'R1' }, { name: 'R0' }],
  truthTable: [
    {
      inputs: { B2: false, B1: false, B0: false },
      outputs: { R3: false, R2: false, R1: false, R0: false },
    },
    {
      inputs: { B2: false, B1: false, B0: true },
      outputs: { R3: false, R2: false, R1: true, R0: false },
    },
    {
      inputs: { B2: false, B1: true, B0: false },
      outputs: { R3: false, R2: true, R1: false, R0: false },
    },
    {
      inputs: { B2: false, B1: true, B0: true },
      outputs: { R3: false, R2: true, R1: true, R0: false },
    },
    {
      inputs: { B2: true, B1: false, B0: false },
      outputs: { R3: true, R2: false, R1: false, R0: false },
    },
    {
      inputs: { B2: true, B1: false, B0: true },
      outputs: { R3: true, R2: false, R1: true, R0: false },
    },
    {
      inputs: { B2: true, B1: true, B0: false },
      outputs: { R3: true, R2: true, R1: false, R0: false },
    },
    {
      inputs: { B2: true, B1: true, B0: true },
      outputs: { R3: true, R2: true, R1: true, R0: false },
    },
  ],
  hints: [
    'Doubling in binary is the same as shifting left by one position',
    'The least significant bit of the result is always 0',
  ],
};
