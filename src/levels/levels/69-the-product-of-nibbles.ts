import type { Level } from '../Level';

/**
 * Level 69: The Product of Nibbles
 *
 * Programming challenge: multiply two 4-bit values using only
 * addition in a loop.
 */
export const level69TheProductOfNibbles: Level = {
  id: '69-the-product-of-nibbles',
  name: 'The Product of Nibbles',
  section: 'Functions',
  prerequisites: ['66-shift'],
  type: 'programming',
  description:
    'Compute the product of two nibbles! R0 and R1 contain two values (0-15). Output R0 × R1. You only have addition and loops — no multiply instruction!',
  availableGates: [],
  availableInstructions: ['LOAD', 'MOV', 'ADD', 'SUB', 'CMP', 'JMP', 'JZ', 'JNZ', 'OUT', 'HALT'],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: '3 × 4', input: [3, 4], expectedOutput: [12] },
    { name: '0 × 7', input: [0, 7], expectedOutput: [0] },
    { name: '1 × 15', input: [1, 15], expectedOutput: [15] },
    { name: '5 × 5', input: [5, 5], expectedOutput: [25] },
    { name: '15 × 15', input: [15, 15], expectedOutput: [225] },
    { name: '2 × 0', input: [2, 0], expectedOutput: [0] },
  ],
  hints: [
    'Multiply by repeated addition: add R0 to an accumulator R1 times',
    'Use R2 as accumulator (start at 0), loop R1 times adding R0 each iteration',
    'Handle the zero case: if R1 is 0, skip the loop entirely',
  ],
};
