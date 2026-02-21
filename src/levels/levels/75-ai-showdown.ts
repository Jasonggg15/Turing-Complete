import type { Level } from '../Level';

/**
 * Level 75: AI Showdown
 *
 * Programming challenge: implement a simple decision-making AI.
 * Given two scores, output the higher one (max function).
 */
export const level75AiShowdown: Level = {
  id: '75-ai-showdown',
  name: 'AI Showdown',
  section: 'Assembly Challenges',
  type: 'programming',
  description:
    'AI Showdown! Given two scores in R0 and R1, output the higher value. If they are equal, output either one. Implement the max function in assembly.',
  availableGates: [],
  availableInstructions: [
    'LOAD', 'MOV', 'ADD', 'SUB', 'CMP',
    'JMP', 'JZ', 'JNZ', 'JGE', 'JLT', 'OUT', 'HALT',
  ],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: '10 vs 5', input: [10, 5], expectedOutput: [10] },
    { name: '3 vs 7', input: [3, 7], expectedOutput: [7] },
    { name: 'Equal', input: [42, 42], expectedOutput: [42] },
    { name: '0 vs 255', input: [0, 255], expectedOutput: [255] },
    { name: '100 vs 1', input: [100, 1], expectedOutput: [100] },
  ],
  hints: [
    'Compare R0 and R1 using CMP',
    'If R0 >= R1, output R0; otherwise output R1',
    'Use JGE to branch based on comparison result',
  ],
  unlocks: ['76-robot-racing'],
};
