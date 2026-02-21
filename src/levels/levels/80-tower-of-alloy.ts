import type { Level } from '../Level';

/**
 * Level 80: Tower of Alloy
 *
 * Programming challenge: compute the number of moves needed
 * to solve the Tower of Hanoi with N disks (2^N - 1).
 */
export const level80TowerOfAlloy: Level = {
  id: '80-tower-of-alloy',
  name: 'Tower of Alloy',
  section: 'Assembly Challenges',
  type: 'programming',
  description:
    'Solve the Tower of Alloy! Given N disks in R0, compute the minimum number of moves to solve the Tower of Hanoi puzzle: 2^N - 1. Output the result. You only have addition — compute 2^N by doubling.',
  availableGates: [],
  availableInstructions: [
    'LOAD', 'MOV', 'ADD', 'SUB', 'CMP',
    'JMP', 'JZ', 'JNZ', 'OUT', 'HALT',
  ],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: '1 disk', input: [1], expectedOutput: [1] },
    { name: '2 disks', input: [2], expectedOutput: [3] },
    { name: '3 disks', input: [3], expectedOutput: [7] },
    { name: '4 disks', input: [4], expectedOutput: [15] },
    { name: '5 disks', input: [5], expectedOutput: [31] },
    { name: '7 disks', input: [7], expectedOutput: [127] },
  ],
  hints: [
    'Compute 2^N by starting at 1 and doubling N times: ADD R1, R1',
    'Then subtract 1: SUB R1, 1',
    'Loop: decrement counter, double accumulator, repeat until counter is 0',
  ],
  unlocks: ['81-planet-names'],
};
