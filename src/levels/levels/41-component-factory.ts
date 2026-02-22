import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 41: Component Factory
 *
 * Build a 4-bit parallel load register.
 * When LOAD is high, the 4-bit input is stored on the next tick.
 * When LOAD is low, the register holds its value.
 */
export const level41ComponentFactory: Level = {
  id: '41-component-factory',
  name: 'Component Factory',
  section: 'CPU Architecture',
  prerequisites: ['39-arithmetic-engine'],
  unlocks: ['42-instruction-decoder', '45-conditions'],
  description:
    'Build a parallel load register. When LOAD is high, store the input value. When LOAD is low, hold the current value.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [
    { name: 'D3' },
    { name: 'D2' },
    { name: 'D1' },
    { name: 'D0' },
    { name: 'LOAD' },
  ],
  outputs: [{ name: 'Q3' }, { name: 'Q2' }, { name: 'Q1' }, { name: 'Q0' }],
  truthTable: [],
  testSequence: [
    // Tick 0: initial → 0000
    {
      inputs: { D3: false, D2: false, D1: false, D0: false, LOAD: false },
      outputs: { Q3: false, Q2: false, Q1: false, Q0: false },
    },
    // Tick 1: Load 1010
    {
      inputs: { D3: true, D2: false, D1: true, D0: false, LOAD: true },
      outputs: { Q3: false, Q2: false, Q1: false, Q0: false },
    },
    // Tick 2: Read → 1010
    {
      inputs: { D3: false, D2: false, D1: false, D0: false, LOAD: false },
      outputs: { Q3: true, Q2: false, Q1: true, Q0: false },
    },
    // Tick 3: LOAD=0, value holds even with different D inputs
    {
      inputs: { D3: true, D2: true, D1: true, D0: true, LOAD: false },
      outputs: { Q3: true, Q2: false, Q1: true, Q0: false },
    },
    // Tick 4: Still holds 1010
    {
      inputs: { D3: false, D2: false, D1: false, D0: false, LOAD: false },
      outputs: { Q3: true, Q2: false, Q1: true, Q0: false },
    },
    // Tick 5: Load 0101
    {
      inputs: { D3: false, D2: true, D1: false, D0: true, LOAD: true },
      outputs: { Q3: true, Q2: false, Q1: true, Q0: false },
    },
    // Tick 6: Read → 0101
    {
      inputs: { D3: false, D2: false, D1: false, D0: false, LOAD: false },
      outputs: { Q3: false, Q2: true, Q1: false, Q0: true },
    },
    // Tick 7: Load 1111
    {
      inputs: { D3: true, D2: true, D1: true, D0: true, LOAD: true },
      outputs: { Q3: false, Q2: true, Q1: false, Q0: true },
    },
    // Tick 8: Read → 1111
    {
      inputs: { D3: false, D2: false, D1: false, D0: false, LOAD: false },
      outputs: { Q3: true, Q2: true, Q1: true, Q0: true },
    },
  ],
  hints: [
    'Use a 2:1 mux per bit: when LOAD=1, select D input; when LOAD=0, select current Q (feedback)',
    'Each mux feeds into a D flip-flop',
    'A 2:1 mux can be built with: (D AND LOAD) OR (Q AND NOT LOAD)',
  ],
};
