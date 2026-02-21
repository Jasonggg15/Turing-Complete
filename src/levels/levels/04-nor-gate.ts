import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level04NorGate: Level = {
  id: '04-nor-gate',
  name: 'NOR Gate',
  section: 'Basic Logic',
  prerequisites: ['03-not-gate'],
  description:
    'Build a NOR gate. It outputs true only when both inputs are false.',
  availableGates: [GateType.NAND, GateType.NOT],
  inputs: [{ name: 'A' }, { name: 'B' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false, B: false }, outputs: { OUT: true } },
    { inputs: { A: false, B: true }, outputs: { OUT: false } },
    { inputs: { A: true, B: false }, outputs: { OUT: false } },
    { inputs: { A: true, B: true }, outputs: { OUT: false } },
  ],
  hints: ['OR is NAND with inverted inputs. NOR is NOT of OR.'],
};
