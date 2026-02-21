import type { Level } from '../Level';

/**
 * Level 78: Delicious Order
 *
 * Programming challenge: sort a small array in ascending order using bubble sort.
 */
export const level78DeliciousOrder: Level = {
  id: '78-delicious-order',
  name: 'Delicious Order',
  section: 'Assembly Challenges',
  prerequisites: ['77-unseen-fruit'],
  type: 'programming',
  description:
    'Put things in delicious order! Memory address 0 contains N (the count). Addresses 1..N contain N values. Sort them in ascending order and output all N values from smallest to largest.',
  availableGates: [],
  availableInstructions: [
    'LOAD', 'LOAD_MEM', 'STORE', 'MOV', 'ADD', 'SUB',
    'CMP', 'JMP', 'JZ', 'JNZ', 'JGE', 'JLT', 'OUT', 'HALT',
  ],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    {
      name: 'Sort 3 items',
      input: [],
      expectedOutput: [1, 2, 3],
      initialMemory: { 0: 3, 1: 3, 2: 1, 3: 2 },
    },
    {
      name: 'Already sorted',
      input: [],
      expectedOutput: [10, 20, 30],
      initialMemory: { 0: 3, 1: 10, 2: 20, 3: 30 },
    },
    {
      name: 'Reverse order',
      input: [],
      expectedOutput: [1, 2, 3, 4],
      initialMemory: { 0: 4, 1: 4, 2: 3, 3: 2, 4: 1 },
    },
    {
      name: 'Two items',
      input: [],
      expectedOutput: [5, 50],
      initialMemory: { 0: 2, 1: 50, 2: 5 },
    },
    {
      name: 'Single item',
      input: [],
      expectedOutput: [99],
      initialMemory: { 0: 1, 1: 99 },
    },
  ],
  hints: [
    'Implement bubble sort: repeatedly scan through the array, swapping adjacent elements if out of order',
    'Outer loop runs N-1 times, inner loop compares adjacent pairs',
    'Use LOAD_MEM and STORE to swap values in memory',
  ],
};
