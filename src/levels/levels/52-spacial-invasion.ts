import type { Level } from '../Level';

/**
 * Level 52: Spacial Invasion
 *
 * Loop programming challenge: sum the numbers from 1 to N.
 * Requires a loop with a counter and conditional jump.
 */
export const level52SpacialInvasion: Level = {
  id: '52-spacial-invasion',
  name: 'Spacial Invasion',
  section: 'Programming',
  prerequisites: ['49-calibrating-laser-cannons'],
  type: 'programming',
  description:
    'Defend against the spacial invasion! Compute the sum of all integers from 1 to N (where N is the input in R0). Output the total. You will need a loop: add the counter to an accumulator, decrement, and repeat until zero.',
  availableGates: [],
  availableInstructions: [
    'LOAD', 'MOV', 'ADD', 'SUB', 'CMP', 'JMP', 'JZ', 'JNZ', 'OUT', 'HALT',
  ],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: 'Sum 1 to 1', input: [1], expectedOutput: [1] },
    { name: 'Sum 1 to 3', input: [3], expectedOutput: [6] },
    { name: 'Sum 1 to 5', input: [5], expectedOutput: [15] },
    { name: 'Sum 1 to 10', input: [10], expectedOutput: [55] },
    { name: 'Sum 1 to 7', input: [7], expectedOutput: [28] },
  ],
  hints: [
    'Use R1 as an accumulator (start at 0) and R0 as the counter',
    'Loop: ADD R1, R0 then SUB R0, 1',
    'Use JNZ to jump back to the loop start while R0 > 0',
    'After the loop, OUT R1',
  ],
};
