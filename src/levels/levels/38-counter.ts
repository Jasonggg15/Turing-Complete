import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 38: Counter
 *
 * Build a 3-bit binary counter that increments each tick.
 * Outputs the current count as 3 bits (B2, B1, B0).
 */
export const level38Counter: Level = {
  id: '38-counter',
  name: 'Counter',
  section: 'Arithmetic and Memory',
  prerequisites: ['37-little-box'],
  description:
    'Build a counter that increments by one each tick. The counter wraps around when it overflows.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'CLK' }],
  outputs: [{ name: 'B2' }, { name: 'B1' }, { name: 'B0' }],
  truthTable: [],
  testSequence: (() => {
    const steps: { inputs: Record<string, boolean>; outputs: Record<string, boolean> }[] = [];
    // 9 ticks: count from 0 to 8 (wraps at 8 → 0)
    for (let i = 0; i < 9; i++) {
      const val = i % 8;
      steps.push({
        inputs: { CLK: true },
        outputs: {
          B2: !!(val & 4),
          B1: !!(val & 2),
          B0: !!(val & 1),
        },
      });
    }
    return steps;
  })(),
  hints: [
    'Bit 0 toggles every tick (XOR with 1 / NOT feedback)',
    'Bit 1 toggles when bit 0 is 1 (XOR with B0)',
    'Bit 2 toggles when both B0 and B1 are 1 (XOR with B0 AND B1)',
  ],

};
