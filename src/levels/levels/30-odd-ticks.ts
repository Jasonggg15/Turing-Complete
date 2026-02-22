import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 30: Odd Ticks
 *
 * Output alternates each tick (toggle flip-flop).
 * No external input — use the inverted output fed back to the flip-flop input.
 */
export const level30OddTicks: Level = {
  id: '30-odd-ticks',
  name: 'Odd Ticks',
  section: 'Arithmetic and Memory',
  prerequisites: ['29-delayed-lines'],
  unlocks: ['31-bit-inverter'],
  description:
    'Create a circuit that outputs ON every other tick (oscillator). The output should alternate between OFF and ON each clock cycle.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'CLK' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [],
  testSequence: [
    // Tick 0: initial state → OUT=0
    { inputs: { CLK: true }, outputs: { OUT: false } },
    // Tick 1: toggled → OUT=1
    { inputs: { CLK: true }, outputs: { OUT: true } },
    // Tick 2: toggled → OUT=0
    { inputs: { CLK: true }, outputs: { OUT: false } },
    // Tick 3: toggled → OUT=1
    { inputs: { CLK: true }, outputs: { OUT: true } },
    // Tick 4: toggled → OUT=0
    { inputs: { CLK: true }, outputs: { OUT: false } },
    // Tick 5: toggled → OUT=1
    { inputs: { CLK: true }, outputs: { OUT: true } },
  ],
  hints: [
    'Feed the inverted output (QN) of the flip-flop back to its D input',
    'The NOT output of the D flip-flop toggles the state each cycle',
  ],

};
