import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level04NorGate: Level = {
  id: '04-nor-gate',
  name: 'NOR Gate',
  section: 'Basic Logic',
  prerequisites: ['03-not-gate'],
  description: 'Create the NOR gate.',
  availableGates: [GateType.NAND, GateType.NOT],
  inputs: [{ name: 'Input 1' }, { name: 'Input 2' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { 'Input 1': false, 'Input 2': false }, outputs: { Output: true } },
    { inputs: { 'Input 1': false, 'Input 2': true }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': false }, outputs: { Output: false } },
    { inputs: { 'Input 1': true, 'Input 2': true }, outputs: { Output: false } },
  ],
  hints: ['OR is NAND with inverted inputs. NOR is NOT of OR.'],
};
