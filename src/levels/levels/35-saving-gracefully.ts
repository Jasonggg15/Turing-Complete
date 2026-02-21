import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 35: Saving Gracefully
 *
 * Store a byte (single bit here simplified) into a register.
 * When SAVE is high, latch the input value. Otherwise hold.
 */
export const level35SavingGracefully: Level = {
  id: '35-saving-gracefully',
  name: 'Saving Gracefully',
  section: 'Memory',
  description:
    'Build a 1-bit register. When SAVE is high, store the value of IN. When SAVE is low, hold the stored value. Output the stored value.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'IN' }, { name: 'SAVE' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [],
  testSequence: [
    // Tick 0: no save → hold initial 0
    { inputs: { IN: true, SAVE: false }, outputs: { OUT: false } },
    // Tick 1: still no save → hold 0
    { inputs: { IN: true, SAVE: false }, outputs: { OUT: false } },
    // Tick 2: SAVE=1 IN=1 → latch 1, output still shows old (0)
    { inputs: { IN: true, SAVE: true }, outputs: { OUT: false } },
    // Tick 3: no save → output now shows 1
    { inputs: { IN: false, SAVE: false }, outputs: { OUT: true } },
    // Tick 4: SAVE=1 IN=0 → latch 0, output still 1
    { inputs: { IN: false, SAVE: true }, outputs: { OUT: true } },
    // Tick 5: no save → output now 0
    { inputs: { IN: true, SAVE: false }, outputs: { OUT: false } },
    // Tick 6: SAVE=1 IN=1 → latch 1
    { inputs: { IN: true, SAVE: true }, outputs: { OUT: false } },
    // Tick 7: hold → output 1
    { inputs: { IN: false, SAVE: false }, outputs: { OUT: true } },
  ],
  hints: [
    'Use a mux pattern: D = SAVE ? IN : Q',
    'AND the input with SAVE, AND the feedback with NOT SAVE, OR them together',
  ],
  unlocks: ['36-saving-bytes'],
};
