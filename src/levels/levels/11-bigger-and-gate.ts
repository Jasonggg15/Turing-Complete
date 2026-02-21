import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level11BiggerAndGate: Level = {
  id: '11-bigger-and-gate',
  name: 'Bigger AND Gate',
  section: 'Basic Logic',
  prerequisites: ['09-xor-gate'],
  description:
    'Build a 3-input AND gate. Output is true only if all inputs are true.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false, B: false, C: false }, outputs: { OUT: false } },
    { inputs: { A: false, B: false, C: true }, outputs: { OUT: false } },
    { inputs: { A: false, B: true, C: false }, outputs: { OUT: false } },
    { inputs: { A: false, B: true, C: true }, outputs: { OUT: false } },
    { inputs: { A: true, B: false, C: false }, outputs: { OUT: false } },
    { inputs: { A: true, B: false, C: true }, outputs: { OUT: false } },
    { inputs: { A: true, B: true, C: false }, outputs: { OUT: false } },
    { inputs: { A: true, B: true, C: true }, outputs: { OUT: true } },
  ],
  hints: ['Chain two AND gates'],
};
