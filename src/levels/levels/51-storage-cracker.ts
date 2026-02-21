import type { Level } from '../Level';

/**
 * Level 51: Storage Cracker
 *
 * Memory read/write challenge: read two values from memory,
 * add them, and store the result back.
 */
export const level51StorageCracker: Level = {
  id: '51-storage-cracker',
  name: 'Storage Cracker',
  section: 'Programming',
  prerequisites: ['52-spacial-invasion'],
  type: 'programming',
  description:
    'Crack the storage vault! Read the values at memory addresses 0 and 1, add them together, store the sum at address 2, and output it. Use LOAD_MEM, ADD, STORE, and OUT.',
  availableGates: [],
  availableInstructions: ['LOAD', 'LOAD_MEM', 'STORE', 'MOV', 'ADD', 'SUB', 'OUT', 'HALT'],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    {
      name: 'Simple add',
      input: [],
      expectedOutput: [30],
      initialMemory: { 0: 10, 1: 20 },
    },
    {
      name: 'Zero plus zero',
      input: [],
      expectedOutput: [0],
      initialMemory: { 0: 0, 1: 0 },
    },
    {
      name: 'Max values',
      input: [],
      expectedOutput: [199],
      initialMemory: { 0: 100, 1: 99 },
    },
    {
      name: 'One plus one',
      input: [],
      expectedOutput: [2],
      initialMemory: { 0: 1, 1: 1 },
    },
    {
      name: 'Asymmetric',
      input: [],
      expectedOutput: [137],
      initialMemory: { 0: 42, 1: 95 },
    },
  ],
  hints: [
    'LOAD_MEM R0, 0 reads the value at memory address 0 into R0',
    'LOAD_MEM R1, 1 reads address 1 into R1',
    'ADD R0, R1 then STORE 2, R0 and OUT R0',
  ],
};
