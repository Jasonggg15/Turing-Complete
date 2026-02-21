import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 42: Instruction Decoder
 *
 * Decode a 3-bit opcode into one-hot control signals.
 * 000=ADD, 001=SUB, 010=LOAD, 011=STORE, 100=JUMP
 * Other opcodes → all outputs low.
 */
export const level42InstructionDecoder: Level = {
  id: '42-instruction-decoder',
  name: 'Instruction Decoder',
  section: 'CPU Architecture',
  prerequisites: ['41-component-factory'],
  description:
    'Decode a 3-bit opcode into one-hot control signals. Map: 000→ADD, 001→SUB, 010→LOAD, 011→STORE, 100→JUMP. For all other opcodes (101, 110, 111), all outputs should be low.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.NOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'OP2' }, { name: 'OP1' }, { name: 'OP0' }],
  outputs: [
    { name: 'ADD' },
    { name: 'SUB' },
    { name: 'LOAD' },
    { name: 'STORE' },
    { name: 'JUMP' },
  ],
  truthTable: [
    // 000 → ADD
    {
      inputs: { OP2: false, OP1: false, OP0: false },
      outputs: { ADD: true, SUB: false, LOAD: false, STORE: false, JUMP: false },
    },
    // 001 → SUB
    {
      inputs: { OP2: false, OP1: false, OP0: true },
      outputs: { ADD: false, SUB: true, LOAD: false, STORE: false, JUMP: false },
    },
    // 010 → LOAD
    {
      inputs: { OP2: false, OP1: true, OP0: false },
      outputs: { ADD: false, SUB: false, LOAD: true, STORE: false, JUMP: false },
    },
    // 011 → STORE
    {
      inputs: { OP2: false, OP1: true, OP0: true },
      outputs: { ADD: false, SUB: false, LOAD: false, STORE: true, JUMP: false },
    },
    // 100 → JUMP
    {
      inputs: { OP2: true, OP1: false, OP0: false },
      outputs: { ADD: false, SUB: false, LOAD: false, STORE: false, JUMP: true },
    },
    // 101 → nothing
    {
      inputs: { OP2: true, OP1: false, OP0: true },
      outputs: { ADD: false, SUB: false, LOAD: false, STORE: false, JUMP: false },
    },
    // 110 → nothing
    {
      inputs: { OP2: true, OP1: true, OP0: false },
      outputs: { ADD: false, SUB: false, LOAD: false, STORE: false, JUMP: false },
    },
    // 111 → nothing
    {
      inputs: { OP2: true, OP1: true, OP0: true },
      outputs: { ADD: false, SUB: false, LOAD: false, STORE: false, JUMP: false },
    },
  ],
  hints: [
    'This is a 3-to-5 decoder: each output is a unique AND combination of the input bits (or their complements)',
    'ADD = NOT(OP2) AND NOT(OP1) AND NOT(OP0)',
    'JUMP = OP2 AND NOT(OP1) AND NOT(OP0)',
  ],
};
