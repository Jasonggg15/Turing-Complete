import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level27LogicEngine: Level = {
  id: '27-logic-engine',
  name: 'Logic Engine',
  section: 'Arithmetic',
  description:
    'Build a programmable logic unit. Given two data inputs and two operation-select inputs, perform the selected operation: 00=AND, 01=OR, 10=XOR, 11=NAND.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }, { name: 'OP1' }, { name: 'OP0' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    {
      inputs: { A: false, B: false, OP1: false, OP0: false },
      outputs: { OUT: false },
    },
    {
      inputs: { A: false, B: true, OP1: false, OP0: false },
      outputs: { OUT: false },
    },
    {
      inputs: { A: true, B: false, OP1: false, OP0: false },
      outputs: { OUT: false },
    },
    {
      inputs: { A: true, B: true, OP1: false, OP0: false },
      outputs: { OUT: true },
    },
    {
      inputs: { A: false, B: false, OP1: false, OP0: true },
      outputs: { OUT: false },
    },
    {
      inputs: { A: false, B: true, OP1: false, OP0: true },
      outputs: { OUT: true },
    },
    {
      inputs: { A: true, B: false, OP1: false, OP0: true },
      outputs: { OUT: true },
    },
    {
      inputs: { A: true, B: true, OP1: false, OP0: true },
      outputs: { OUT: true },
    },
    {
      inputs: { A: false, B: false, OP1: true, OP0: false },
      outputs: { OUT: false },
    },
    {
      inputs: { A: false, B: true, OP1: true, OP0: false },
      outputs: { OUT: true },
    },
    {
      inputs: { A: true, B: false, OP1: true, OP0: false },
      outputs: { OUT: true },
    },
    {
      inputs: { A: true, B: true, OP1: true, OP0: false },
      outputs: { OUT: false },
    },
    {
      inputs: { A: false, B: false, OP1: true, OP0: true },
      outputs: { OUT: true },
    },
    {
      inputs: { A: false, B: true, OP1: true, OP0: true },
      outputs: { OUT: true },
    },
    {
      inputs: { A: true, B: false, OP1: true, OP0: true },
      outputs: { OUT: true },
    },
    {
      inputs: { A: true, B: true, OP1: true, OP0: true },
      outputs: { OUT: false },
    },
  ],
  hints: [
    'Use the operation select bits to choose which gate output reaches the final output',
    'Build all four operations, then use a multiplexer to select the right one',
  ],
  unlocks: ['28-circular-dependency'],
};
