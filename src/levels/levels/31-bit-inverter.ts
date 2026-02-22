import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 31: Bit Inverter
 *
 * Invert a stored bit using feedback. When TOGGLE is high, flip the
 * stored value. Otherwise hold the current value.
 */
export const level31BitInverter: Level = {
  id: '31-bit-inverter',
  name: 'Bit Inverter',
  section: 'Arithmetic and Memory',
  prerequisites: ['30-odd-ticks'],
  description:
    'Create a circuit that inverts the stored bit each time TOGGLE goes high. Uses a D flip-flop to store the current state.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'TOGGLE' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [],
  testSequence: [
    // Tick 0: TOGGLE=0 → hold (initial 0)
    { inputs: { TOGGLE: false }, outputs: { OUT: false } },
    // Tick 1: TOGGLE=1 → invert, will latch 1 but output is still 0
    { inputs: { TOGGLE: true }, outputs: { OUT: false } },
    // Tick 2: TOGGLE=0 → hold, output shows latched 1
    { inputs: { TOGGLE: false }, outputs: { OUT: true } },
    // Tick 3: TOGGLE=1 → invert, will latch 0 but output is still 1
    { inputs: { TOGGLE: true }, outputs: { OUT: true } },
    // Tick 4: TOGGLE=0 → hold, output shows latched 0
    { inputs: { TOGGLE: false }, outputs: { OUT: false } },
    // Tick 5: TOGGLE=1 → invert again
    { inputs: { TOGGLE: true }, outputs: { OUT: false } },
    // Tick 6: hold → output 1
    { inputs: { TOGGLE: false }, outputs: { OUT: true } },
  ],
  hints: [
    'XOR the current stored value with TOGGLE to compute the next value',
    'Feed Q back through XOR with TOGGLE into D',
  ],

};
