import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level27LogicEngine: Level = {
  id: '27-logic-engine',
  name: 'Logic Engine',
  section: 'Arithmetic and Memory',
  prerequisites: ['24-signed-negator', '26-3-bit-decoder'],
  unlocks: ['39-arithmetic-engine'],
  description:
    'Create a logic engine that can perform the selected operation on two data inputs using a 2-bit operation code: 00=OR, 01=NAND, 10=NOR, 11=AND.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [
    { name: 'Input 1' },
    { name: 'Input 2' },
    { name: 'Op 1' },
    { name: 'Op 0' },
  ],
  outputs: [{ name: 'Output' }],
  truthTable: [
    // Op=00 (OR): Output = Input 1 OR Input 2
    {
      inputs: { 'Input 1': false, 'Input 2': false, 'Op 1': false, 'Op 0': false },
      outputs: { Output: false },
    },
    {
      inputs: { 'Input 1': false, 'Input 2': true, 'Op 1': false, 'Op 0': false },
      outputs: { Output: true },
    },
    {
      inputs: { 'Input 1': true, 'Input 2': false, 'Op 1': false, 'Op 0': false },
      outputs: { Output: true },
    },
    {
      inputs: { 'Input 1': true, 'Input 2': true, 'Op 1': false, 'Op 0': false },
      outputs: { Output: true },
    },
    // Op=01 (NAND): Output = NOT(Input 1 AND Input 2)
    {
      inputs: { 'Input 1': false, 'Input 2': false, 'Op 1': false, 'Op 0': true },
      outputs: { Output: true },
    },
    {
      inputs: { 'Input 1': false, 'Input 2': true, 'Op 1': false, 'Op 0': true },
      outputs: { Output: true },
    },
    {
      inputs: { 'Input 1': true, 'Input 2': false, 'Op 1': false, 'Op 0': true },
      outputs: { Output: true },
    },
    {
      inputs: { 'Input 1': true, 'Input 2': true, 'Op 1': false, 'Op 0': true },
      outputs: { Output: false },
    },
    // Op=10 (NOR): Output = NOT(Input 1 OR Input 2)
    {
      inputs: { 'Input 1': false, 'Input 2': false, 'Op 1': true, 'Op 0': false },
      outputs: { Output: true },
    },
    {
      inputs: { 'Input 1': false, 'Input 2': true, 'Op 1': true, 'Op 0': false },
      outputs: { Output: false },
    },
    {
      inputs: { 'Input 1': true, 'Input 2': false, 'Op 1': true, 'Op 0': false },
      outputs: { Output: false },
    },
    {
      inputs: { 'Input 1': true, 'Input 2': true, 'Op 1': true, 'Op 0': false },
      outputs: { Output: false },
    },
    // Op=11 (AND): Output = Input 1 AND Input 2
    {
      inputs: { 'Input 1': false, 'Input 2': false, 'Op 1': true, 'Op 0': true },
      outputs: { Output: false },
    },
    {
      inputs: { 'Input 1': false, 'Input 2': true, 'Op 1': true, 'Op 0': true },
      outputs: { Output: false },
    },
    {
      inputs: { 'Input 1': true, 'Input 2': false, 'Op 1': true, 'Op 0': true },
      outputs: { Output: false },
    },
    {
      inputs: { 'Input 1': true, 'Input 2': true, 'Op 1': true, 'Op 0': true },
      outputs: { Output: true },
    },
  ],
  hints: [
    'Use the operation select bits to choose which gate output reaches the final output',
    'Build all four operations, then use a multiplexer to select the right one',
  ],
};
