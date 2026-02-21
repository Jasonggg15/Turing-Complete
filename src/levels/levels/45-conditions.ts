import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 45: Conditions
 *
 * Build a condition evaluator for CPU branching.
 * Given a 4-bit value and condition select inputs, evaluate:
 *   SEL=0: ZERO flag (value == 0)
 *   SEL=1: NEGATIVE flag (MSB set, i.e. value bit 3 = 1)
 * Output RESULT = selected condition flag.
 */
export const level45Conditions: Level = {
  id: '45-conditions',
  name: 'Conditions',
  section: 'CPU Architecture',
  description:
    'Build a condition evaluator. Given a 4-bit value (A3-A0) and a SEL input: when SEL=0, output RESULT=1 if the value is zero (all bits 0). When SEL=1, output RESULT=1 if the value is negative (A3=1, sign bit set).',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.NOR,
    GateType.XNOR,
  ],
  inputs: [
    { name: 'A3' },
    { name: 'A2' },
    { name: 'A1' },
    { name: 'A0' },
    { name: 'SEL' },
  ],
  outputs: [{ name: 'RESULT' }],
  truthTable: [
    // SEL=0 (ZERO check): value=0000 → RESULT=1
    { inputs: { A3: false, A2: false, A1: false, A0: false, SEL: false }, outputs: { RESULT: true } },
    // SEL=0: value=0001 → RESULT=0
    { inputs: { A3: false, A2: false, A1: false, A0: true, SEL: false }, outputs: { RESULT: false } },
    // SEL=0: value=0100 → RESULT=0
    { inputs: { A3: false, A2: true, A1: false, A0: false, SEL: false }, outputs: { RESULT: false } },
    // SEL=0: value=1111 → RESULT=0
    { inputs: { A3: true, A2: true, A1: true, A0: true, SEL: false }, outputs: { RESULT: false } },
    // SEL=0: value=1000 → RESULT=0
    { inputs: { A3: true, A2: false, A1: false, A0: false, SEL: false }, outputs: { RESULT: false } },
    // SEL=1 (NEGATIVE check): value=0000 → RESULT=0
    { inputs: { A3: false, A2: false, A1: false, A0: false, SEL: true }, outputs: { RESULT: false } },
    // SEL=1: value=0111 → RESULT=0
    { inputs: { A3: false, A2: true, A1: true, A0: true, SEL: true }, outputs: { RESULT: false } },
    // SEL=1: value=1000 → RESULT=1 (negative)
    { inputs: { A3: true, A2: false, A1: false, A0: false, SEL: true }, outputs: { RESULT: true } },
    // SEL=1: value=1111 → RESULT=1 (negative)
    { inputs: { A3: true, A2: true, A1: true, A0: true, SEL: true }, outputs: { RESULT: true } },
    // SEL=1: value=1010 → RESULT=1 (negative)
    { inputs: { A3: true, A2: false, A1: true, A0: false, SEL: true }, outputs: { RESULT: true } },
    // SEL=1: value=0010 → RESULT=0
    { inputs: { A3: false, A2: false, A1: true, A0: false, SEL: true }, outputs: { RESULT: false } },
    // SEL=0: value=0010 → RESULT=0
    { inputs: { A3: false, A2: false, A1: true, A0: false, SEL: false }, outputs: { RESULT: false } },
  ],
  hints: [
    'ZERO flag = NOR of all 4 bits (output 1 only when all inputs are 0)',
    'NEGATIVE flag = A3 (just the sign bit)',
    'Use a 2:1 mux to select between ZERO and NEGATIVE based on SEL',
  ],
  unlocks: ['46-immediate-values'],
};
