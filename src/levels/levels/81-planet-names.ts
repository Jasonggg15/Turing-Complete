import type { Level } from '../Level';

/**
 * Level 81: Planet Names
 *
 * Programming challenge: read a null-terminated string from memory
 * and output its length.
 */
export const level81PlanetNames: Level = {
  id: '81-planet-names',
  name: 'Planet Names',
  section: 'Assembly Challenges',
  prerequisites: ['70-stack'],
  type: 'programming',
  description:
    'Measure the planet name! Memory starting at address 0 contains a null-terminated string (sequence of non-zero bytes ending with 0). Count the number of characters (non-zero bytes) and output the length.',
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
      name: 'Earth (5 chars)',
      input: [],
      expectedOutput: [5],
      initialMemory: { 0: 69, 1: 97, 2: 114, 3: 116, 4: 104, 5: 0 },
    },
    {
      name: 'Mars (4 chars)',
      input: [],
      expectedOutput: [4],
      initialMemory: { 0: 77, 1: 97, 2: 114, 3: 115, 4: 0 },
    },
    {
      name: 'Empty string',
      input: [],
      expectedOutput: [0],
      initialMemory: { 0: 0 },
    },
    {
      name: 'X (1 char)',
      input: [],
      expectedOutput: [1],
      initialMemory: { 0: 88, 1: 0 },
    },
    {
      name: 'Jupiter (7 chars)',
      input: [],
      expectedOutput: [7],
      initialMemory: { 0: 74, 1: 117, 2: 112, 3: 105, 4: 116, 5: 101, 6: 114, 7: 0 },
    },
  ],
  hints: [
    'Use R0 as a pointer and R1 as a counter, both starting at 0',
    'Loop: LOAD_MEM R2, R0 — if R2 is 0, output R1 and halt',
    'Otherwise increment both R0 and R1, then loop',
  ],
};
