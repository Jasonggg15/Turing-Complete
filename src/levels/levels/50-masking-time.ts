import type { Level } from '../Level';

/**
 * Level 50: Masking Time
 *
 * Bitwise masking: extract the upper and lower nibbles of a byte.
 * Output the upper nibble (shifted right by 4) first, then the lower nibble.
 */
export const level50MaskingTime: Level = {
  id: '50-masking-time',
  name: 'Masking Time',
  section: 'Programming',
  type: 'programming',
  description:
    'Extract the upper and lower nibbles of a byte using bitwise operations. R0 contains the input byte. Output two values: first the lower nibble (bits 0-3), then the upper nibble (bits 4-7). Use AND to mask bits.',
  availableGates: [],
  availableInstructions: ['LOAD', 'MOV', 'ADD', 'AND', 'OR', 'XOR', 'SHR', 'OUT', 'HALT'],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: 'Zero', input: [0x00], expectedOutput: [0x00, 0x00] },
    { name: 'All ones', input: [0xff], expectedOutput: [0x0f, 0x0f] },
    { name: 'Mixed 0x37', input: [0x37], expectedOutput: [0x07, 0x03] },
    { name: 'Mixed 0xab', input: [0xab], expectedOutput: [0x0b, 0x0a] },
    { name: 'Upper only', input: [0xf0], expectedOutput: [0x00, 0x0f] },
    { name: 'Lower only', input: [0x0f], expectedOutput: [0x0f, 0x00] },
  ],
  hints: [
    'AND R0, 0x0F masks the lower nibble',
    'To get the upper nibble, use SHR (shift right) by 4 bits',
    'Use MOV to save the original value before masking',
  ],
  unlocks: ['51-storage-cracker'],
};
