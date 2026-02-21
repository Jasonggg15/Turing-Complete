import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level08SecondTick: Level = {
  id: '08-second-tick',
  name: 'Second Tick',
  section: 'Basic Logic',
  description:
    'Build an INHIBIT gate: output is true only when the first input is true AND the second input is false.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false, B: false }, outputs: { OUT: false } },
    { inputs: { A: false, B: true }, outputs: { OUT: false } },
    { inputs: { A: true, B: false }, outputs: { OUT: true } },
    { inputs: { A: true, B: true }, outputs: { OUT: false } },
  ],
  hints: ['Invert the second input, then AND'],
  unlocks: ['09-xor-gate'],
};
