import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level06AndGate: Level = {
  id: '06-and-gate',
  name: 'AND Gate',
  section: 'Basic Logic',
  prerequisites: ['03-not-gate'],
  description:
    'Build an AND gate. It outputs true only when both inputs are true.',
  availableGates: [GateType.NAND, GateType.NOT, GateType.NOR, GateType.OR],
  inputs: [{ name: 'A' }, { name: 'B' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false, B: false }, outputs: { OUT: false } },
    { inputs: { A: false, B: true }, outputs: { OUT: false } },
    { inputs: { A: true, B: false }, outputs: { OUT: false } },
    { inputs: { A: true, B: true }, outputs: { OUT: true } },
  ],
  hints: ['NAND is the inverse of AND'],
};
