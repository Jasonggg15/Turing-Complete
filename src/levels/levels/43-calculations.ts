import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 43: Calculations
 *
 * Build a 2-bit accumulator. When ADD=1, the accumulator adds the 2-bit
 * input value V to its stored value. When ADD=0, it holds its value.
 * Outputs show the current accumulator value.
 */
export const level43Calculations: Level = {
  id: '43-calculations',
  name: 'Calculations',
  section: 'CPU Architecture',
  prerequisites: ['42-instruction-decoder', '40-registers'],
  description:
    'Build a 2-bit accumulator register. When ADD=1, add the input value (V1, V0) to the stored accumulator value. When ADD=0, hold the current value. Output the accumulator value as A1, A0.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'V1' }, { name: 'V0' }, { name: 'ADD' }],
  outputs: [{ name: 'A1' }, { name: 'A0' }],
  truthTable: [],
  testSequence: [
    // Tick 0: initial accumulator = 00
    { inputs: { V1: false, V0: false, ADD: false }, outputs: { A1: false, A0: false } },
    // Tick 1: ADD 01 → acc = 00 + 01 = 01
    { inputs: { V1: false, V0: true, ADD: true }, outputs: { A1: false, A0: false } },
    // Tick 2: read → 01
    { inputs: { V1: false, V0: false, ADD: false }, outputs: { A1: false, A0: true } },
    // Tick 3: ADD 10 → acc = 01 + 10 = 11
    { inputs: { V1: true, V0: false, ADD: true }, outputs: { A1: false, A0: true } },
    // Tick 4: read → 11
    { inputs: { V1: false, V0: false, ADD: false }, outputs: { A1: true, A0: true } },
    // Tick 5: ADD 01 → acc = 11 + 01 = 00 (overflow wraps)
    { inputs: { V1: false, V0: true, ADD: true }, outputs: { A1: true, A0: true } },
    // Tick 6: read → 00
    { inputs: { V1: false, V0: false, ADD: false }, outputs: { A1: false, A0: false } },
    // Tick 7: ADD 11 → acc = 00 + 11 = 11
    { inputs: { V1: true, V0: true, ADD: true }, outputs: { A1: false, A0: false } },
    // Tick 8: HOLD (ADD=0, even with V input) → still 11
    { inputs: { V1: true, V0: true, ADD: false }, outputs: { A1: true, A0: true } },
    // Tick 9: read → still 11
    { inputs: { V1: false, V0: false, ADD: false }, outputs: { A1: true, A0: true } },
  ],
  hints: [
    'Use a 2-bit adder to compute accumulator + V',
    'Use a mux per bit: when ADD=1, feed adder result to flip-flop; when ADD=0, feed back current value',
    'Chain the carry from bit 0 adder to bit 1 adder',
  ],
};
