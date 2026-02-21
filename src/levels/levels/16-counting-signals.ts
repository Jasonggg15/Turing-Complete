import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level16CountingSignals: Level = {
  id: '16-counting-signals',
  name: 'Counting Signals',
  section: 'Arithmetic and Memory',
  prerequisites: ['14-double-trouble'],
  description:
    'Count how many of the 3 inputs are ON and output the count as a 2-bit binary number.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
  outputs: [{ name: 'S1' }, { name: 'S0' }],
  truthTable: [
    {
      inputs: { A: false, B: false, C: false },
      outputs: { S1: false, S0: false },
    },
    {
      inputs: { A: false, B: false, C: true },
      outputs: { S1: false, S0: true },
    },
    {
      inputs: { A: false, B: true, C: false },
      outputs: { S1: false, S0: true },
    },
    {
      inputs: { A: false, B: true, C: true },
      outputs: { S1: true, S0: false },
    },
    {
      inputs: { A: true, B: false, C: false },
      outputs: { S1: false, S0: true },
    },
    {
      inputs: { A: true, B: false, C: true },
      outputs: { S1: true, S0: false },
    },
    {
      inputs: { A: true, B: true, C: false },
      outputs: { S1: true, S0: false },
    },
    { inputs: { A: true, B: true, C: true }, outputs: { S1: true, S0: true } },
  ],
  hints: [
    'S0 is 1 when an odd number of inputs are on (parity)',
    'S1 is 1 when at least 2 inputs are on (majority)',
  ],
};
