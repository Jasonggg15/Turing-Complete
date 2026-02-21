import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 47: Turing Complete
 *
 * Capstone: Build a simple 2-bit programmable computer.
 * The circuit has a 2-bit program counter, a 1-bit output register, and a halt flag.
 *
 * Instructions (provided as I1:I0 each tick):
 *   00 = NOP  (do nothing)
 *   01 = SET  (set OUT to 1)
 *   10 = CLR  (set OUT to 0)
 *   11 = HALT (stop execution, freeze all state)
 *
 * When not halted, PC increments each tick (wraps 3→0).
 * When HALT instruction is decoded, PC freezes and HALT flag is set.
 * When halted, all state is frozen regardless of input.
 */
export const level47TuringComplete: Level = {
  id: '47-turing-complete',
  name: 'Turing Complete',
  section: 'CPU Architecture',
  description:
    'Build a simple programmable computer! Each tick, read a 2-bit instruction (I1, I0): 00=NOP, 01=SET (output→1), 10=CLR (output→0), 11=HALT (freeze). The 2-bit program counter (PC1, PC0) increments each tick unless halted. When HALT is executed, PC and OUT freeze. Output the current PC, OUT value, and HALT flag.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.NOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'I1' }, { name: 'I0' }],
  outputs: [
    { name: 'PC1' },
    { name: 'PC0' },
    { name: 'OUT' },
    { name: 'HALT' },
  ],
  truthTable: [],
  testSequence: [
    // Tick 0: initial state → PC=00, OUT=0, HALT=0. Input: SET (01)
    {
      inputs: { I1: false, I0: true },
      outputs: { PC1: false, PC0: false, OUT: false, HALT: false },
    },
    // Tick 1: SET executed → OUT=1, PC incremented → 01. Input: NOP (00)
    {
      inputs: { I1: false, I0: false },
      outputs: { PC1: false, PC0: true, OUT: true, HALT: false },
    },
    // Tick 2: NOP → OUT=1, PC → 10. Input: CLR (10)
    {
      inputs: { I1: true, I0: false },
      outputs: { PC1: true, PC0: false, OUT: true, HALT: false },
    },
    // Tick 3: CLR executed → OUT=0, PC → 11. Input: HALT (11)
    {
      inputs: { I1: true, I0: true },
      outputs: { PC1: true, PC0: true, OUT: false, HALT: false },
    },
    // Tick 4: HALT executed → PC frozen at 11, HALT=1. Input ignored.
    {
      inputs: { I1: false, I0: false },
      outputs: { PC1: true, PC0: true, OUT: false, HALT: true },
    },
    // Tick 5: still halted → everything frozen
    {
      inputs: { I1: false, I0: true },
      outputs: { PC1: true, PC0: true, OUT: false, HALT: true },
    },
  ],
  hints: [
    'You need three subsystems: instruction decoder, program counter, and output register',
    'Decode I1:I0 into control signals: IS_SET = NOT(I1) AND I0, IS_CLR = I1 AND NOT(I0), IS_HALT = I1 AND I0',
    'Gate all state updates with NOT(HALT) — when halted, feed back current state to all flip-flops',
    'For the output register: new_OUT = (IS_SET) OR (OUT AND NOT(IS_CLR)), then mux with current OUT based on HALT',
  ],
  unlocks: ['48-add-5'],
};
