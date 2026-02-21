import type { Level } from '../Level';

/**
 * Level 77: Unseen Fruit
 *
 * Programming challenge: find the missing number in a sequence.
 * Memory contains N-1 of the numbers 1..N; find the one that's missing.
 */
export const level77UnseenFruit: Level = {
  id: '77-unseen-fruit',
  name: 'Unseen Fruit',
  section: 'Assembly Challenges',
  prerequisites: ['75-ai-showdown'],
  type: 'programming',
  description:
    'Find the unseen fruit! Memory address 0 contains N. Addresses 1..N-1 contain N-1 distinct numbers from the range 1..N (one is missing). Find and output the missing number. Hint: sum of 1..N minus sum of given numbers = missing number.',
  availableGates: [],
  availableInstructions: [
    'LOAD', 'LOAD_MEM', 'MOV', 'ADD', 'SUB',
    'CMP', 'JMP', 'JZ', 'JNZ', 'OUT', 'HALT',
  ],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    {
      name: 'Missing 3 from 1-5',
      input: [],
      expectedOutput: [3],
      initialMemory: { 0: 5, 1: 1, 2: 2, 3: 4, 4: 5 },
    },
    {
      name: 'Missing 1 from 1-3',
      input: [],
      expectedOutput: [1],
      initialMemory: { 0: 3, 1: 2, 2: 3 },
    },
    {
      name: 'Missing 4 from 1-4',
      input: [],
      expectedOutput: [4],
      initialMemory: { 0: 4, 1: 1, 2: 2, 3: 3 },
    },
    {
      name: 'Missing 2 from 1-6',
      input: [],
      expectedOutput: [2],
      initialMemory: { 0: 6, 1: 1, 2: 3, 3: 4, 4: 5, 5: 6 },
    },
  ],
  hints: [
    'Expected sum = N × (N + 1) / 2 — compute this with a loop',
    'Actual sum = sum of all values in memory[1..N-1]',
    'Missing number = expected sum - actual sum',
  ],
};
