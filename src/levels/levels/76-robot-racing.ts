import type { Level } from '../Level';

/**
 * Level 76: Robot Racing
 *
 * Programming challenge: simulate a race by accumulating speed values.
 * Given speeds in memory, sum them and output the total distance.
 */
export const level76RobotRacing: Level = {
  id: '76-robot-racing',
  name: 'Robot Racing',
  section: 'Assembly Challenges',
  type: 'programming',
  description:
    'Race your robot! Memory address 0 contains the number of time steps N. Addresses 1..N contain speed values for each step. Compute the total distance (sum of all speeds) and output it.',
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
      name: 'Three steps',
      input: [],
      expectedOutput: [60],
      initialMemory: { 0: 3, 1: 10, 2: 20, 3: 30 },
    },
    {
      name: 'Single step',
      input: [],
      expectedOutput: [50],
      initialMemory: { 0: 1, 1: 50 },
    },
    {
      name: 'Five equal steps',
      input: [],
      expectedOutput: [25],
      initialMemory: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5 },
    },
    {
      name: 'Zero steps',
      input: [],
      expectedOutput: [0],
      initialMemory: { 0: 0 },
    },
  ],
  hints: [
    'Initialize sum=0 and pointer=1',
    'Loop N times: LOAD_MEM from pointer, add to sum, increment pointer',
    'After the loop, OUT the sum',
  ],
  unlocks: ['77-unseen-fruit'],
};
