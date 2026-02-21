import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level15BinaryRacer: Level = {
  id: '15-binary-racer',
  name: 'Binary Racer',
  section: 'Arithmetic',
  description:
    'Detect when a 3-bit binary input represents exactly the number 5 (binary 101).',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'B2' }, { name: 'B1' }, { name: 'B0' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { B2: false, B1: false, B0: false }, outputs: { OUT: false } },
    { inputs: { B2: false, B1: false, B0: true }, outputs: { OUT: false } },
    { inputs: { B2: false, B1: true, B0: false }, outputs: { OUT: false } },
    { inputs: { B2: false, B1: true, B0: true }, outputs: { OUT: false } },
    { inputs: { B2: true, B1: false, B0: false }, outputs: { OUT: false } },
    { inputs: { B2: true, B1: false, B0: true }, outputs: { OUT: true } },
    { inputs: { B2: true, B1: true, B0: false }, outputs: { OUT: false } },
    { inputs: { B2: true, B1: true, B0: true }, outputs: { OUT: false } },
  ],
  hints: [
    'The number 5 in binary is 101',
    'Use AND with NOT to detect a specific pattern',
  ],
  unlocks: ['16-counting-signals'],
};
