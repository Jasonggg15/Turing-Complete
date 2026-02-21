import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level07AlwaysOn: Level = {
  id: '07-always-on',
  name: 'Always On',
  section: 'Basic Logic',
  description: 'Build a circuit that always outputs true, regardless of input.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
  ],
  inputs: [{ name: 'A' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false }, outputs: { OUT: true } },
    { inputs: { A: true }, outputs: { OUT: true } },
  ],
  hints: ['A OR NOT A is always true'],
  unlocks: ['08-second-tick'],
};
