import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level07AlwaysOn: Level = {
  id: '07-always-on',
  name: 'Always On',
  section: 'Basic Logic',
  prerequisites: ['06-and-gate', '04-nor-gate', '05-or-gate'],
  unlocks: ['08-second-tick'],
  description: 'Create a circuit that always outputs true regardless of input.',
  availableGates: [GateType.NAND, GateType.NOT, GateType.OR],
  inputs: [{ name: 'Input' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { Input: false }, outputs: { Output: true } },
    { inputs: { Input: true }, outputs: { Output: true } },
  ],
  hints: ['A OR NOT A is always true'],
};
