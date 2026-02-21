import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 55: Byte Constant
 *
 * Output a hardcoded 8-bit constant value (0xA5 = 10100101).
 * No inputs — just wire outputs to power or ground.
 */
export const level55ByteConstant: Level = {
  id: '55-byte-constant',
  name: 'Byte Constant',
  section: 'CPU Architecture 2',
  description:
    'Output the constant byte 0xA5 (10100101 in binary). Wire each output bit to always-on or always-off to produce the fixed value. No inputs are provided — this is a constant generator.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
  ],
  inputs: [{ name: 'ON' }],
  outputs: [
    { name: 'B7' }, { name: 'B6' }, { name: 'B5' }, { name: 'B4' },
    { name: 'B3' }, { name: 'B2' }, { name: 'B1' }, { name: 'B0' },
  ],
  truthTable: [
    {
      inputs: { ON: true },
      outputs: {
        B7: true, B6: false, B5: true, B4: false,
        B3: false, B2: true, B1: false, B0: true,
      },
    },
  ],
  hints: [
    '0xA5 = 10100101: wire ON to bits 7, 5, 2, 0',
    'Use NOT gates on ON for the zero bits, or leave them unconnected (default false)',
  ],
  unlocks: ['56-byte-xor'],
};
