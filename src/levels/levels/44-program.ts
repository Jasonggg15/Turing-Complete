import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 44: Program
 *
 * Build a 2-bit program counter with jump capability.
 * Each tick the PC increments by 1 (wraps at 3→0).
 * When JUMP=1, load the jump target J1:J0 instead of incrementing.
 */
export const level44Program: Level = {
  id: '44-program',
  name: 'Program',
  section: 'CPU Architecture',
  prerequisites: ['45-conditions'],
  description:
    'Build a 2-bit program counter. Each tick, the PC increments by 1 (wrapping from 3 back to 0). When JUMP=1, load the jump target (J1, J0) into the PC instead of incrementing.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'JUMP' }, { name: 'J1' }, { name: 'J0' }],
  outputs: [{ name: 'PC1' }, { name: 'PC0' }],
  truthTable: [],
  testSequence: [
    // Tick 0: initial PC = 00
    { inputs: { JUMP: false, J1: false, J0: false }, outputs: { PC1: false, PC0: false } },
    // Tick 1: PC incremented → 01
    { inputs: { JUMP: false, J1: false, J0: false }, outputs: { PC1: false, PC0: true } },
    // Tick 2: PC incremented → 10
    { inputs: { JUMP: false, J1: false, J0: false }, outputs: { PC1: true, PC0: false } },
    // Tick 3: PC incremented → 11
    { inputs: { JUMP: false, J1: false, J0: false }, outputs: { PC1: true, PC0: true } },
    // Tick 4: PC wraps → 00
    { inputs: { JUMP: false, J1: false, J0: false }, outputs: { PC1: false, PC0: false } },
    // Tick 5: JUMP to 10 → next tick shows 10
    { inputs: { JUMP: true, J1: true, J0: false }, outputs: { PC1: false, PC0: true } },
    // Tick 6: PC = 10 (jumped)
    { inputs: { JUMP: false, J1: false, J0: false }, outputs: { PC1: true, PC0: false } },
    // Tick 7: PC incremented → 11
    { inputs: { JUMP: false, J1: false, J0: false }, outputs: { PC1: true, PC0: true } },
    // Tick 8: JUMP to 00
    { inputs: { JUMP: true, J1: false, J0: false }, outputs: { PC1: false, PC0: false } },
    // Tick 9: PC = 00 (jumped)
    { inputs: { JUMP: false, J1: false, J0: false }, outputs: { PC1: false, PC0: false } },
    // Tick 10: PC incremented → 01
    { inputs: { JUMP: false, J1: false, J0: false }, outputs: { PC1: false, PC0: true } },
  ],
  hints: [
    'Build a 2-bit incrementer (half adder chain) for PC + 1',
    'Use a mux per bit: when JUMP=1, select J input; when JUMP=0, select incremented PC',
    'Feed the mux output into D flip-flops for state storage',
  ],
};
