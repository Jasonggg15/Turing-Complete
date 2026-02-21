import type { Level } from '../Level';

/**
 * Level 72: Divide
 *
 * Programming challenge: integer division using repeated subtraction.
 */
export const level72Divide: Level = {
  id: '72-divide',
  name: 'Divide',
  section: 'Functions',
  prerequisites: ['69-the-product-of-nibbles'],
  type: 'programming',
  description:
    'Implement integer division! R0 contains the dividend and R1 the divisor. Output the quotient (R0 / R1) using integer division (round toward zero). Use repeated subtraction to count how many times the divisor fits.',
  availableGates: [],
  availableInstructions: ['LOAD', 'MOV', 'ADD', 'SUB', 'CMP', 'JMP', 'JZ', 'JNZ', 'JGE', 'JLT', 'OUT', 'HALT'],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: '10 / 2', input: [10, 2], expectedOutput: [5] },
    { name: '7 / 3', input: [7, 3], expectedOutput: [2] },
    { name: '0 / 5', input: [0, 5], expectedOutput: [0] },
    { name: '15 / 1', input: [15, 1], expectedOutput: [15] },
    { name: '100 / 10', input: [100, 10], expectedOutput: [10] },
    { name: '9 / 4', input: [9, 4], expectedOutput: [2] },
    { name: '255 / 17', input: [255, 17], expectedOutput: [15] },
  ],
  hints: [
    'Use repeated subtraction: subtract divisor from dividend, count iterations',
    'Loop: if R0 >= R1, subtract R1 from R0 and increment quotient counter',
    'Stop when R0 < R1 — the counter holds the quotient',
  ],
};
