import type { Level } from '../Level';

/**
 * Level 74: Functions
 *
 * Programming challenge: implement and call a "function" using
 * CALL and RET instructions to compute factorial.
 */
export const level74Functions: Level = {
  id: '74-functions',
  name: 'Functions',
  section: 'Functions',
  type: 'programming',
  description:
    'Master functions! Compute the factorial of R0 (R0!). Use CALL to jump to a subroutine and RET to return. Factorial: 0!=1, 1!=1, N!=N×(N-1)×...×1. Use a loop with repeated multiplication (via addition).',
  availableGates: [],
  availableInstructions: [
    'LOAD', 'MOV', 'ADD', 'SUB', 'CMP',
    'JMP', 'JZ', 'JNZ', 'CALL', 'RET',
    'PUSH', 'POP', 'OUT', 'HALT',
  ],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: '0!', input: [0], expectedOutput: [1] },
    { name: '1!', input: [1], expectedOutput: [1] },
    { name: '3!', input: [3], expectedOutput: [6] },
    { name: '5!', input: [5], expectedOutput: [120] },
    { name: '4!', input: [4], expectedOutput: [24] },
  ],
  hints: [
    'Implement multiply as a subroutine: CALL multiply, which adds R0 to an accumulator R1 times',
    'Main loop: result=1, for i=R0 down to 1: result = result × i',
    'Use PUSH/POP to save registers before CALL and restore after RET',
  ],
  unlocks: ['75-ai-showdown'],
};
