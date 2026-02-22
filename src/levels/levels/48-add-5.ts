import type { Level } from '../Level';

/**
 * Level 48: Add 5
 *
 * First programming challenge. Write assembly to add 5 to the input value.
 * Input is pre-loaded into R0. Output using the OUT instruction.
 */
export const level48Add5: Level = {
  id: '48-add-5',
  name: 'Add 5',
  section: 'Programming',
  prerequisites: ['47-turing-complete'],
  type: 'programming',
  description:
    'Write assembly to read input, add 5, and output the result.',
  availableGates: [],
  availableInstructions: ['LOAD', 'ADD', 'SUB', 'OUT', 'HALT'],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: 'Zero plus 5', input: [0], expectedOutput: [5] },
    { name: 'Three plus 5', input: [3], expectedOutput: [8] },
    { name: 'Ten plus 5', input: [10], expectedOutput: [15] },
    { name: 'Large value', input: [250], expectedOutput: [255] },
  ],
  hints: [
    'R0 already contains the input value',
    'Use ADD R0, 5 to add 5 to R0',
    'Use OUT R0 to output the result',
  ],
};
