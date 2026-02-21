import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level10BiggerOrGate: Level = {
  id: '10-bigger-or-gate',
  name: 'Bigger OR Gate',
  section: 'Basic Logic',
  description: 'Build a 3-input OR gate. Output is true if any input is true.',
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
    { inputs: { A: false, B: false, C: true }, outputs: { OUT: true } },
    { inputs: { A: false, B: true, C: false }, outputs: { OUT: true } },
    { inputs: { A: false, B: true, C: true }, outputs: { OUT: true } },
    { inputs: { A: true, B: false, C: false }, outputs: { OUT: true } },
    { inputs: { A: true, B: false, C: true }, outputs: { OUT: true } },
    { inputs: { A: true, B: true, C: false }, outputs: { OUT: true } },
    { inputs: { A: true, B: true, C: true }, outputs: { OUT: true } },
  ],
  hints: ['Chain two OR gates'],
  unlocks: ['11-bigger-and-gate'],
};
