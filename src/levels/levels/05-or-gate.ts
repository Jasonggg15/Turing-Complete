import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level05OrGate: Level = {
  id: '05-or-gate',
  name: 'OR Gate',
  description:
    'Build an OR gate. It outputs true if at least one input is true.',
  availableGates: [GateType.NAND, GateType.NOT],
  inputs: [{ name: 'A' }, { name: 'B' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false, B: false }, outputs: { OUT: false } },
    { inputs: { A: false, B: true }, outputs: { OUT: true } },
    { inputs: { A: true, B: false }, outputs: { OUT: true } },
    { inputs: { A: true, B: true }, outputs: { OUT: true } },
  ],
  hints: ['Invert both inputs, then NAND them'],
  unlocks: ['06-and-gate'],
};
