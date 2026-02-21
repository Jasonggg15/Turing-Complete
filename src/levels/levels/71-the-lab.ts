import type { Level } from '../Level';

/**
 * Level 71: The Lab
 *
 * Programming challenge: compute the absolute value of a signed 8-bit number.
 */
export const level71TheLab: Level = {
  id: '71-the-lab',
  name: 'The Lab',
  section: 'Functions',
  prerequisites: ['70-stack'],
  type: 'programming',
  description:
    "Welcome to The Lab! Compute the absolute value of a signed 8-bit number. R0 contains a value in two's complement (-128 to 127). Output |R0|. If R0 is negative, negate it; otherwise output it unchanged.",
  availableGates: [],
  availableInstructions: ['LOAD', 'MOV', 'ADD', 'SUB', 'AND', 'XOR', 'CMP', 'JMP', 'JZ', 'JNZ', 'JGE', 'OUT', 'HALT'],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: 'Positive 5', input: [5], expectedOutput: [5] },
    { name: 'Zero', input: [0], expectedOutput: [0] },
    { name: 'Negative -1 (255)', input: [255], expectedOutput: [1] },
    { name: 'Negative -42 (214)', input: [214], expectedOutput: [42] },
    { name: 'Positive 127', input: [127], expectedOutput: [127] },
    { name: 'Negative -128 (128)', input: [128], expectedOutput: [128] },
  ],
  hints: [
    'Check the sign bit (bit 7) — if set, the number is negative',
    'To negate: XOR with 0xFF, then ADD 1 (two\'s complement negation)',
    'Use AND R0, 0x80 and JZ to test the sign bit',
  ],
};
