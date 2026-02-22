import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 29: Delayed Lines
 *
 * Signals take time to propagate — concept of clock cycles.
 * Output the input delayed by one tick using a D flip-flop.
 */
export const level29DelayedLines: Level = {
  id: '29-delayed-lines',
  name: 'Delayed Lines',
  section: 'Arithmetic and Memory',
  prerequisites: ['28-circular-dependency'],
  description:
    'Create a circuit that delays the input signal. The output at tick N should equal the input at tick N-1.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'IN' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [],
  testSequence: [
    // Tick 0: IN=0 → OUT=0 (initial state)
    { inputs: { IN: false }, outputs: { OUT: false } },
    // Tick 1: IN=1 → OUT=0 (delayed: was 0)
    { inputs: { IN: true }, outputs: { OUT: false } },
    // Tick 2: IN=0 → OUT=1 (delayed: was 1)
    { inputs: { IN: false }, outputs: { OUT: true } },
    // Tick 3: IN=1 → OUT=0 (delayed: was 0)
    { inputs: { IN: true }, outputs: { OUT: false } },
    // Tick 4: IN=1 → OUT=1 (delayed: was 1)
    { inputs: { IN: true }, outputs: { OUT: true } },
    // Tick 5: IN=0 → OUT=1 (delayed: was 1)
    { inputs: { IN: false }, outputs: { OUT: true } },
  ],
  hints: [
    'A D flip-flop delays its input by exactly one clock cycle',
    'Wire IN directly to the D input and Q to the output',
  ],

};
