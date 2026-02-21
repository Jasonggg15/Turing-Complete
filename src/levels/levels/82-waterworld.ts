import type { Level } from '../Level';

/**
 * Level 82: Waterworld (Final Level)
 *
 * Programming challenge: simulate water flow.
 * Given terrain heights in memory, compute how much water each cell can hold.
 * For each cell, water level = min of max-height-to-left and max-height-to-right.
 * Water trapped at each cell = max(0, water_level - terrain_height).
 * Output the total trapped water.
 */
export const level82Waterworld: Level = {
  id: '82-waterworld',
  name: 'Waterworld',
  section: 'Assembly Challenges',
  type: 'programming',
  description:
    'Welcome to Waterworld — the final challenge! Memory address 0 contains N (number of terrain columns). Addresses 1..N contain the height of each column. Calculate the total amount of trapped rainwater. For each column, the water level is the minimum of the tallest column to its left and the tallest to its right. Water at each position = max(0, water_level - height). Output the total.',
  availableGates: [],
  availableInstructions: [
    'LOAD', 'LOAD_MEM', 'STORE', 'MOV', 'ADD', 'SUB',
    'AND', 'CMP', 'JMP', 'JZ', 'JNZ', 'JGE', 'JLT', 'OUT', 'HALT',
  ],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    {
      name: 'Classic trap',
      input: [],
      expectedOutput: [6],
      initialMemory: { 0: 6, 1: 3, 2: 0, 3: 2, 4: 0, 5: 4, 6: 2 },
    },
    {
      name: 'No water (ascending)',
      input: [],
      expectedOutput: [0],
      initialMemory: { 0: 4, 1: 1, 2: 2, 3: 3, 4: 4 },
    },
    {
      name: 'No water (descending)',
      input: [],
      expectedOutput: [0],
      initialMemory: { 0: 4, 1: 4, 2: 3, 3: 2, 4: 1 },
    },
    {
      name: 'Bowl shape',
      input: [],
      expectedOutput: [4],
      initialMemory: { 0: 5, 1: 3, 2: 1, 3: 0, 4: 1, 5: 3 },
    },
    {
      name: 'Single column',
      input: [],
      expectedOutput: [0],
      initialMemory: { 0: 1, 1: 5 },
    },
  ],
  hints: [
    'Use a two-pass approach: first pass computes max-height from left, second from right',
    'Store left-max values in a scratch area of memory',
    'For each cell: water = min(left_max, right_max) - height, if positive',
    'Sum all water values and output the total',
  ],
};
