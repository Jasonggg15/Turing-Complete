import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level03NotGate: Level = {
  id: '03-not-gate',
  name: 'NOT Gate',
  section: 'Basic Logic',
  prerequisites: ['02-nand-gate'],
  description:
    'Create a circuit that outputs the opposite of the input using NAND gates.',
  availableGates: [GateType.NAND],
  inputs: [{ name: 'Input' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { Input: false }, outputs: { Output: true } },
    { inputs: { Input: true }, outputs: { Output: false } },
  ],
  hints: ['Connect both NAND inputs to the same signal'],
};
