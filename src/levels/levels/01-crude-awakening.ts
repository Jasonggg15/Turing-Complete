import type { Level } from '../Level';

export const level01CrudeAwakening: Level = {
  id: '01-crude-awakening',
  name: 'Crude Awakening',
  description:
    'Welcome! Click the input gate to toggle it and observe the output. Just wire the input to the output.',
  availableGates: [],
  inputs: [{ name: 'IN' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { IN: false }, outputs: { OUT: false } },
    { inputs: { IN: true }, outputs: { OUT: true } },
  ],
  hints: ['Connect the input directly to the output'],
  unlocks: ['02-nand-gate'],
};
