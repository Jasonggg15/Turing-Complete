import type { Level } from '../Level';

export const level01CrudeAwakening: Level = {
  id: '01-crude-awakening',
  name: 'Crude Awakening',
  section: 'Basic Logic',
  prerequisites: [],
  unlocks: ['02-nand-gate'],
  description:
    'Click the input to turn it off to prove you are not a plant.',
  availableGates: [],
  inputs: [{ name: 'Input' }],
  outputs: [{ name: 'Output' }],
  truthTable: [
    { inputs: { Input: false }, outputs: { Output: false } },
    { inputs: { Input: true }, outputs: { Output: true } },
  ],
  hints: ['Connect the input directly to the output'],
};
