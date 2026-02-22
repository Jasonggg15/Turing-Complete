import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 32: Bit Switch
 *
 * Store and switch a single bit. SET turns the bit on, RESET turns it off.
 * If neither is active, hold the current value. SET takes priority over RESET.
 */
export const level32BitSwitch: Level = {
  id: '32-bit-switch',
  name: 'Bit Switch',
  section: 'Arithmetic and Memory',
  prerequisites: ['17-double-the-number', '13-odd-number-of-signals'],
  description:
    'Build an SR latch: SET turns it on, RESET turns it off. If neither is active, hold the value. SET has priority over RESET.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'SET' }, { name: 'RESET' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [],
  testSequence: [
    // Tick 0: initial state → OUT=0
    { inputs: { SET: false, RESET: false }, outputs: { OUT: false } },
    // Tick 1: SET=1 → latch will store 1, but output still 0
    { inputs: { SET: true, RESET: false }, outputs: { OUT: false } },
    // Tick 2: hold → output now 1
    { inputs: { SET: false, RESET: false }, outputs: { OUT: true } },
    // Tick 3: hold → still 1
    { inputs: { SET: false, RESET: false }, outputs: { OUT: true } },
    // Tick 4: RESET=1 → latch will store 0, output still 1
    { inputs: { SET: false, RESET: true }, outputs: { OUT: true } },
    // Tick 5: hold → output now 0
    { inputs: { SET: false, RESET: false }, outputs: { OUT: false } },
    // Tick 6: SET + RESET → SET wins, latch stores 1
    { inputs: { SET: true, RESET: true }, outputs: { OUT: false } },
    // Tick 7: hold → output now 1
    { inputs: { SET: false, RESET: false }, outputs: { OUT: true } },
  ],
  hints: [
    'D = (SET) OR (Q AND NOT RESET)',
    'Use OR to set, AND with NOT RESET to clear, feedback Q to hold',
  ],

};
