import { GateType } from '../../engine/types';
import type { Level, TruthTableEntry } from '../Level';

/**
 * Level 39: Arithmetic Engine
 *
 * Build a 2-bit ALU that can add or subtract.
 * When SUB=0: R = A + B. When SUB=1: R = A - B (two's complement).
 * XOR each B bit with SUB to conditionally invert, then feed SUB as carry-in.
 */
function aluEntry(a: number, b: number, sub: boolean): TruthTableEntry {
  let sum: number;
  if (sub) {
    const notB = (~b) & 0x3;
    sum = a + notB + 1;
  } else {
    sum = a + b;
  }
  const result = sum & 0x3;
  const carry = sum > 3;

  return {
    inputs: {
      A1: !!(a & 2),
      A0: !!(a & 1),
      B1: !!(b & 2),
      B0: !!(b & 1),
      SUB: sub,
    },
    outputs: {
      R1: !!(result & 2),
      R0: !!(result & 1),
      CARRY: carry,
    },
  };
}

export const level39ArithmeticEngine: Level = {
  id: '39-arithmetic-engine',
  name: 'Arithmetic Engine',
  section: 'CPU Architecture',
  prerequisites: ['27-logic-engine', '38-counter'],
  description:
    'Build an arithmetic engine that performs addition and subtraction on two values.',
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
    { name: 'A1' },
    { name: 'A0' },
    { name: 'B1' },
    { name: 'B0' },
    { name: 'SUB' },
  ],
  outputs: [{ name: 'R1' }, { name: 'R0' }, { name: 'CARRY' }],
  truthTable: [
    // ADD operations (SUB=false)
    aluEntry(0, 0, false),
    aluEntry(1, 1, false),
    aluEntry(2, 1, false),
    aluEntry(3, 1, false),
    aluEntry(3, 3, false),
    aluEntry(2, 2, false),
    aluEntry(1, 0, false),
    aluEntry(0, 3, false),
    // SUB operations (SUB=true)
    aluEntry(2, 1, true),
    aluEntry(3, 2, true),
    aluEntry(1, 1, true),
    aluEntry(0, 1, true),
    aluEntry(1, 2, true),
    aluEntry(0, 0, true),
    aluEntry(3, 0, true),
    aluEntry(3, 3, true),
  ],
  hints: [
    'XOR each B bit with SUB to conditionally invert B for subtraction',
    'Feed SUB as carry-in to the first full adder',
    'Chain two full adders for the 2-bit operation',
  ],
};
