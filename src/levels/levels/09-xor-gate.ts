import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level09XorGate: Level = {
  id: '09-xor-gate',
  name: 'XOR Gate',
  description:
    'Build an XOR gate. It outputs true if the inputs are different.',
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
    { inputs: { A: false, B: true }, outputs: { OUT: true } },
    { inputs: { A: true, B: false }, outputs: { OUT: true } },
    { inputs: { A: true, B: true }, outputs: { OUT: false } },
  ],
  hints: ['Classic solution uses exactly 4 NAND gates'],
  unlocks: ['10-bigger-or-gate'],
};
