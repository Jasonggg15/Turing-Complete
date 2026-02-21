import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level12XnorGate: Level = {
  id: '12-xnor-gate',
  name: 'XNOR Gate',
  section: 'Basic Logic',
  description:
    'Build an XNOR gate. It outputs true if the inputs are the same.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false, B: false }, outputs: { OUT: true } },
    { inputs: { A: false, B: true }, outputs: { OUT: false } },
    { inputs: { A: true, B: false }, outputs: { OUT: false } },
    { inputs: { A: true, B: true }, outputs: { OUT: true } },
  ],
  hints: ['XNOR is the inverse of XOR'],
  unlocks: ['13-odd-number-of-signals'],
};
