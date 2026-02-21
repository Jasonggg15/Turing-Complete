import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level13OddNumberOfSignals: Level = {
  id: '13-odd-number-of-signals',
  name: 'ODD Number of Signals',
  section: 'Arithmetic',
  description:
    'Determine if an odd number of inputs are ON. Output true when the count of active inputs is odd.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    {
      inputs: { A: false, B: false, C: false, D: false },
      outputs: { OUT: false },
    },
    {
      inputs: { A: false, B: false, C: false, D: true },
      outputs: { OUT: true },
    },
    {
      inputs: { A: false, B: false, C: true, D: false },
      outputs: { OUT: true },
    },
    {
      inputs: { A: false, B: false, C: true, D: true },
      outputs: { OUT: false },
    },
    {
      inputs: { A: false, B: true, C: false, D: false },
      outputs: { OUT: true },
    },
    {
      inputs: { A: false, B: true, C: false, D: true },
      outputs: { OUT: false },
    },
    {
      inputs: { A: false, B: true, C: true, D: false },
      outputs: { OUT: false },
    },
    { inputs: { A: false, B: true, C: true, D: true }, outputs: { OUT: true } },
    {
      inputs: { A: true, B: false, C: false, D: false },
      outputs: { OUT: true },
    },
    {
      inputs: { A: true, B: false, C: false, D: true },
      outputs: { OUT: false },
    },
    {
      inputs: { A: true, B: false, C: true, D: false },
      outputs: { OUT: false },
    },
    { inputs: { A: true, B: false, C: true, D: true }, outputs: { OUT: true } },
    {
      inputs: { A: true, B: true, C: false, D: false },
      outputs: { OUT: false },
    },
    { inputs: { A: true, B: true, C: false, D: true }, outputs: { OUT: true } },
    { inputs: { A: true, B: true, C: true, D: false }, outputs: { OUT: true } },
    { inputs: { A: true, B: true, C: true, D: true }, outputs: { OUT: false } },
  ],
  hints: [
    'XOR of two signals is 1 when they differ',
    'Chain XOR gates together',
  ],
  unlocks: ['14-double-trouble'],
};
