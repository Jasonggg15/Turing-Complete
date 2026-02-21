import type { Level } from '../Level';

/**
 * Level 79: Dancing Machine
 *
 * Programming challenge: generate a repeating pattern.
 * Output a sequence that alternates between two values N times.
 */
export const level79DancingMachine: Level = {
  id: '79-dancing-machine',
  name: 'Dancing Machine',
  section: 'Assembly Challenges',
  type: 'programming',
  description:
    'Make the machine dance! R0 contains the number of beats N and R1 contains the dance move value. Output an alternating pattern: R1, 0, R1, 0, ... for N total outputs.',
  availableGates: [],
  availableInstructions: [
    'LOAD', 'MOV', 'ADD', 'SUB', 'AND', 'XOR',
    'CMP', 'JMP', 'JZ', 'JNZ', 'OUT', 'HALT',
  ],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: '4 beats of 7', input: [4, 7], expectedOutput: [7, 0, 7, 0] },
    { name: '3 beats of 1', input: [3, 1], expectedOutput: [1, 0, 1] },
    { name: '1 beat of 255', input: [1, 255], expectedOutput: [255] },
    { name: '6 beats of 10', input: [6, 10], expectedOutput: [10, 0, 10, 0, 10, 0] },
    { name: '2 beats of 50', input: [2, 50], expectedOutput: [50, 0] },
  ],
  hints: [
    'Use a flag to alternate: XOR a toggle register with the move value each iteration',
    'Loop N times: if iteration is even, output R1; if odd, output 0',
    'Use AND with 1 to test if the counter is odd or even',
  ],
  unlocks: ['80-tower-of-alloy'],
};
