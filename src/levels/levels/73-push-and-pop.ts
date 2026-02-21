import type { Level } from '../Level';

/**
 * Level 73: PUSH and POP
 *
 * Programming challenge: use stack operations to reverse a sequence.
 */
export const level73PushAndPop: Level = {
  id: '73-push-and-pop',
  name: 'PUSH and POP',
  section: 'Functions',
  type: 'programming',
  description:
    'Use the stack to reverse a sequence! Memory contains a length N at address 0, followed by N values at addresses 1..N. Push all values onto the stack, then pop them off and output each one. The stack reverses their order (LIFO).',
  availableGates: [],
  availableInstructions: [
    'LOAD', 'LOAD_MEM', 'STORE', 'MOV', 'ADD', 'SUB',
    'PUSH', 'POP', 'CMP', 'JMP', 'JZ', 'JNZ', 'OUT', 'HALT',
  ],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    {
      name: 'Reverse 3 items',
      input: [],
      expectedOutput: [3, 2, 1],
      initialMemory: { 0: 3, 1: 1, 2: 2, 3: 3 },
    },
    {
      name: 'Single item',
      input: [],
      expectedOutput: [42],
      initialMemory: { 0: 1, 1: 42 },
    },
    {
      name: 'Reverse 5 items',
      input: [],
      expectedOutput: [50, 40, 30, 20, 10],
      initialMemory: { 0: 5, 1: 10, 2: 20, 3: 30, 4: 40, 5: 50 },
    },
    {
      name: 'Two items',
      input: [],
      expectedOutput: [200, 100],
      initialMemory: { 0: 2, 1: 100, 2: 200 },
    },
  ],
  hints: [
    'First loop: read values from memory[1..N] and PUSH each one',
    'Second loop: POP N times and OUT each value — they come out reversed',
    'Use R0 as a counter, R1 as a memory pointer',
  ],
  unlocks: ['74-functions'],
};
