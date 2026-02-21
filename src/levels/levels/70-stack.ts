import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 70: Stack
 *
 * Build a 4-entry stack with PUSH and POP operations.
 * 1-bit data, PUSH/POP control signals.
 */
export const level70Stack: Level = {
  id: '70-stack',
  name: 'Stack',
  section: 'Functions',
  prerequisites: ['67-ram'],
  description:
    'Build a 4-entry 1-bit stack. When PUSH=1, push DATA onto the stack. When POP=1, pop the top value and output it on OUT. The stack pointer starts at 0 (empty). OUT shows the most recently pushed value (top of stack) when idle.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'DATA' }, { name: 'PUSH' }, { name: 'POP' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [],
  testSequence: [
    // Tick 0: empty stack
    { inputs: { DATA: false, PUSH: false, POP: false }, outputs: { OUT: false } },
    // Tick 1: PUSH 1
    { inputs: { DATA: true, PUSH: true, POP: false }, outputs: { OUT: false } },
    // Tick 2: idle → top = 1
    { inputs: { DATA: false, PUSH: false, POP: false }, outputs: { OUT: true } },
    // Tick 3: PUSH 0
    { inputs: { DATA: false, PUSH: true, POP: false }, outputs: { OUT: true } },
    // Tick 4: idle → top = 0
    { inputs: { DATA: false, PUSH: false, POP: false }, outputs: { OUT: false } },
    // Tick 5: PUSH 1
    { inputs: { DATA: true, PUSH: true, POP: false }, outputs: { OUT: false } },
    // Tick 6: idle → top = 1
    { inputs: { DATA: false, PUSH: false, POP: false }, outputs: { OUT: true } },
    // Tick 7: POP → removes top (1), reveals 0
    { inputs: { DATA: false, PUSH: false, POP: true }, outputs: { OUT: true } },
    // Tick 8: idle → top = 0
    { inputs: { DATA: false, PUSH: false, POP: false }, outputs: { OUT: false } },
    // Tick 9: POP → removes 0, reveals 1
    { inputs: { DATA: false, PUSH: false, POP: true }, outputs: { OUT: false } },
    // Tick 10: idle → top = 1
    { inputs: { DATA: false, PUSH: false, POP: false }, outputs: { OUT: true } },
  ],
  hints: [
    'Use a 2-bit counter as the stack pointer',
    'PUSH increments SP and writes DATA at the new SP position',
    'POP decrements SP — the output mux reads the value at current SP',
  ],
};
