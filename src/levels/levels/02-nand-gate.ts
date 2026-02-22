import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level02NandGate: Level = {
  id: '02-nand-gate',
  name: 'NAND Gate',
  section: 'Basic Logic',
  prerequisites: ['01-crude-awakening'],
  description:
    'Figure out the behavior of the NAND gate by setting the output correctly for each input combination.',
  availableGates: [GateType.NAND],
  inputs: [{ name: 'Input One' }, { name: 'Input Two' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { 'Input One': false, 'Input Two': false }, outputs: { Output: true } },
    { inputs: { 'Input One': false, 'Input Two': true }, outputs: { Output: true } },
    { inputs: { 'Input One': true, 'Input Two': false }, outputs: { Output: true } },
    { inputs: { 'Input One': true, 'Input Two': true }, outputs: { Output: false } },
  ],
  hints: ['Place a NAND gate and connect both inputs through it'],
};
