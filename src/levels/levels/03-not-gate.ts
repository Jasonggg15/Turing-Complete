import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level03NotGate: Level = {
  id: '03-not-gate',
  name: 'NOT Gate',
  section: 'Basic Logic',
  prerequisites: ['02-nand-gate'],
  description:
    'Build a NOT gate using only NAND gates. A NOT gate inverts its input.',
  availableGates: [GateType.NAND],
  inputs: [{ name: 'A' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false }, outputs: { OUT: true } },
    { inputs: { A: true }, outputs: { OUT: false } },
  ],
  hints: ['Connect both NAND inputs to the same signal'],
};
