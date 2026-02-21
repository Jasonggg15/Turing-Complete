import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 46: Immediate Values
 *
 * Sign-extend a 4-bit immediate value to 8 bits.
 * The sign bit (I3) is replicated into the upper 4 bits.
 * This is how CPUs encode small constants in instructions.
 */
export const level46ImmediateValues: Level = {
  id: '46-immediate-values',
  name: 'Immediate Values',
  section: 'CPU Architecture',
  prerequisites: ['44-program'],
  description:
    'Sign-extend a 4-bit value to 8 bits. Copy the 4 input bits (I3-I0) to the lower 4 output bits (E3-E0). Fill the upper 4 output bits (E7-E4) with the sign bit (I3). This preserves the signed value: +5 (0101) → 00000101, -3 (1101) → 11111101.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.NOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'I3' }, { name: 'I2' }, { name: 'I1' }, { name: 'I0' }],
  outputs: [
    { name: 'E7' },
    { name: 'E6' },
    { name: 'E5' },
    { name: 'E4' },
    { name: 'E3' },
    { name: 'E2' },
    { name: 'E1' },
    { name: 'E0' },
  ],
  truthTable: [
    // 0000 → 00000000
    {
      inputs: { I3: false, I2: false, I1: false, I0: false },
      outputs: { E7: false, E6: false, E5: false, E4: false, E3: false, E2: false, E1: false, E0: false },
    },
    // 0001 → 00000001 (+1)
    {
      inputs: { I3: false, I2: false, I1: false, I0: true },
      outputs: { E7: false, E6: false, E5: false, E4: false, E3: false, E2: false, E1: false, E0: true },
    },
    // 0101 → 00000101 (+5)
    {
      inputs: { I3: false, I2: true, I1: false, I0: true },
      outputs: { E7: false, E6: false, E5: false, E4: false, E3: false, E2: true, E1: false, E0: true },
    },
    // 0111 → 00000111 (+7)
    {
      inputs: { I3: false, I2: true, I1: true, I0: true },
      outputs: { E7: false, E6: false, E5: false, E4: false, E3: false, E2: true, E1: true, E0: true },
    },
    // 1000 → 11111000 (-8)
    {
      inputs: { I3: true, I2: false, I1: false, I0: false },
      outputs: { E7: true, E6: true, E5: true, E4: true, E3: true, E2: false, E1: false, E0: false },
    },
    // 1101 → 11111101 (-3)
    {
      inputs: { I3: true, I2: true, I1: false, I0: true },
      outputs: { E7: true, E6: true, E5: true, E4: true, E3: true, E2: true, E1: false, E0: true },
    },
    // 1111 → 11111111 (-1)
    {
      inputs: { I3: true, I2: true, I1: true, I0: true },
      outputs: { E7: true, E6: true, E5: true, E4: true, E3: true, E2: true, E1: true, E0: true },
    },
    // 0100 → 00000100 (+4)
    {
      inputs: { I3: false, I2: true, I1: false, I0: false },
      outputs: { E7: false, E6: false, E5: false, E4: false, E3: false, E2: true, E1: false, E0: false },
    },
    // 1010 → 11111010 (-6)
    {
      inputs: { I3: true, I2: false, I1: true, I0: false },
      outputs: { E7: true, E6: true, E5: true, E4: true, E3: true, E2: false, E1: true, E0: false },
    },
  ],
  hints: [
    'The lower 4 bits are just wired through: E0=I0, E1=I1, E2=I2, E3=I3',
    'The upper 4 bits all copy the sign bit: E4=E5=E6=E7=I3',
    'This is mostly a wiring puzzle — no complex logic needed!',
  ],
};
