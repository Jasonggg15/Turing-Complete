import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level02NandGate: Level = {
  id: '02-nand-gate',
  name: 'NAND Gate',
  section: 'Basic Logic',
  description:
    'The NAND gate outputs false only when both inputs are true. Build a circuit that implements this truth table.',
  availableGates: [GateType.NAND],
  inputs: [{ name: 'A' }, { name: 'B' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false, B: false }, outputs: { OUT: true } },
    { inputs: { A: false, B: true }, outputs: { OUT: true } },
    { inputs: { A: true, B: false }, outputs: { OUT: true } },
    { inputs: { A: true, B: true }, outputs: { OUT: false } },
  ],
  hints: ['Place a NAND gate and connect both inputs through it'],
  unlocks: ['03-not-gate'],
};
