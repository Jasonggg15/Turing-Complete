import { GateType } from '../../engine/types';
import type { Level, TruthTableEntry } from '../Level';

/**
 * Level 66: Shift
 *
 * Build a 4-bit barrel shifter: shift left by 0, 1, 2, or 3 positions.
 * Vacated bits are filled with 0. Bits shifted out are discarded.
 */
function shiftEntry(v: number, s: number): TruthTableEntry {
  const r = (v << s) & 0xf;
  const inputs: Record<string, boolean> = {};
  for (let i = 0; i < 4; i++) inputs[`D${i}`] = !!(v & (1 << i));
  inputs.S1 = !!(s & 2);
  inputs.S0 = !!(s & 1);
  const outputs: Record<string, boolean> = {};
  for (let i = 0; i < 4; i++) outputs[`R${i}`] = !!(r & (1 << i));
  return { inputs, outputs };
}

export const level66Shift: Level = {
  id: '66-shift',
  name: 'Shift',
  section: 'Functions',
  prerequisites: ['64-conditionals'],
  description:
    'Build a 4-bit left barrel shifter. Shift the input (D3-D0) left by the amount specified by S1:S0 (0-3 positions). Vacated bits fill with 0, bits shifted out are discarded.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
  ],
  inputs: [
    { name: 'D3' }, { name: 'D2' }, { name: 'D1' }, { name: 'D0' },
    { name: 'S1' }, { name: 'S0' },
  ],
  outputs: [{ name: 'R3' }, { name: 'R2' }, { name: 'R1' }, { name: 'R0' }],
  truthTable: [
    shiftEntry(0b0001, 0), // 1 << 0 = 1
    shiftEntry(0b0001, 1), // 1 << 1 = 2
    shiftEntry(0b0001, 2), // 1 << 2 = 4
    shiftEntry(0b0001, 3), // 1 << 3 = 8
    shiftEntry(0b1111, 0), // 15 << 0 = 15
    shiftEntry(0b1111, 1), // 15 << 1 = 14
    shiftEntry(0b1111, 2), // 15 << 2 = 12
    shiftEntry(0b1111, 3), // 15 << 3 = 8
    shiftEntry(0b0101, 1), // 5 << 1 = 10
    shiftEntry(0b0011, 2), // 3 << 2 = 12
    shiftEntry(0b1010, 1), // 10 << 1 = 4
    shiftEntry(0b0000, 3), // 0 << 3 = 0
  ],
  hints: [
    'Build in two stages: first shift by S0 (0 or 1), then shift by S1 (0 or 2)',
    'Each stage is a row of 2:1 muxes choosing between shifted and unshifted',
  ],
};
