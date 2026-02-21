import type { Level } from '../Level';

/**
 * Level 65: Hex Racer
 *
 * Programming challenge: convert a decimal value to its hexadecimal digit outputs.
 * Output the upper and lower hex digits of the input byte.
 */
export const level65HexRacer: Level = {
  id: '65-hex-racer',
  name: 'Hex Racer',
  section: 'Functions',
  prerequisites: ['64-conditionals'],
  type: 'programming',
  description:
    'Race through hex conversion! Given a byte in R0, output its two hexadecimal digits: first the upper nibble (bits 7-4), then the lower nibble (bits 3-0). Each digit is a value 0-15.',
  availableGates: [],
  availableInstructions: ['LOAD', 'MOV', 'ADD', 'SUB', 'AND', 'SHR', 'OUT', 'HALT'],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: 'Zero', input: [0x00], expectedOutput: [0x0, 0x0] },
    { name: '0xFF', input: [0xff], expectedOutput: [0xf, 0xf] },
    { name: '0x4B', input: [0x4b], expectedOutput: [0x4, 0xb] },
    { name: '0xA0', input: [0xa0], expectedOutput: [0xa, 0x0] },
    { name: '0x07', input: [0x07], expectedOutput: [0x0, 0x7] },
  ],
  hints: [
    'Use SHR R0, 4 to get the upper nibble',
    'Use AND R0, 0x0F to get the lower nibble',
    'Save the original value before shifting',
  ],
};
