import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 28: Circular Dependency
 *
 * Introduction to feedback loops. The player learns that a D flip-flop
 * can store a value and feed it back. The task is simple: wire the
 * flip-flop output back to its own input, creating a latch that holds
 * whatever value it was given.
 *
 * The test sequence feeds a value, then checks it persists.
 */
export const level28CircularDependency: Level = {
  id: '28-circular-dependency',
  name: 'Circular Dependency',
  section: 'Memory',
  description:
    'Introduction to feedback loops. Use a D flip-flop to store a signal. When STORE is on, save the value of IN. The output should always reflect the stored value.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'IN' }, { name: 'STORE' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [],
  testSequence: [
    // Tick 0: STORE=1 IN=1 → latch 1, but FF outputs old state (0)
    { inputs: { IN: true, STORE: true }, outputs: { OUT: false } },
    // Tick 1: STORE=0 IN=0 → hold. FF now outputs 1 (latched from tick 0)
    { inputs: { IN: false, STORE: false }, outputs: { OUT: true } },
    // Tick 2: STORE=0 IN=0 → still holds 1
    { inputs: { IN: false, STORE: false }, outputs: { OUT: true } },
    // Tick 3: STORE=1 IN=0 → latch 0, but FF still outputs old (1)
    { inputs: { IN: false, STORE: true }, outputs: { OUT: true } },
    // Tick 4: hold → now outputs 0 (latched from tick 3)
    { inputs: { IN: true, STORE: false }, outputs: { OUT: false } },
  ],
  hints: [
    'Use a D flip-flop to store values across clock cycles',
    'Gate the input with the STORE signal using an AND gate, and OR with the feedback to hold state',
  ],
  unlocks: ['29-delayed-lines'],
};
