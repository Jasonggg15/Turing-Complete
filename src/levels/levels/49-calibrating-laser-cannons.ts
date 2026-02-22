import type { Level } from '../Level';

/**
 * Level 49: Calibrating Laser Cannons
 *
 * Compute output = input * 3 + 1.
 * Requires using register-to-register operations and immediate adds.
 */
export const level49CalibratingLaserCannons: Level = {
  id: '49-calibrating-laser-cannons',
  name: 'Calibrating Laser Cannons',
  section: 'Programming',
  prerequisites: ['48-add-5'],
  type: 'programming',
  description:
    'Write assembly to perform arithmetic calibration on input values.',
  availableGates: [],
  availableInstructions: ['LOAD', 'MOV', 'ADD', 'SUB', 'OUT', 'HALT'],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    { name: 'Zero', input: [0], expectedOutput: [1] },
    { name: 'One', input: [1], expectedOutput: [4] },
    { name: 'Five', input: [5], expectedOutput: [16] },
    { name: 'Ten', input: [10], expectedOutput: [31] },
    { name: 'Twenty', input: [20], expectedOutput: [61] },
  ],
  hints: [
    'Copy R0 to R1 with MOV R1, R0 to keep the original value',
    'ADD R0, R1 doubles R0. ADD R0, R1 again triples the original.',
    'Then ADD R0, 1 and OUT R0',
  ],
};
