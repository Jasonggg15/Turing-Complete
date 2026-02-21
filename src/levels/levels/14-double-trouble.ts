import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level14DoubleTrouble: Level = {
  id: '14-double-trouble',
  name: 'Double Trouble',
  section: 'Arithmetic',
  description:
    'Solve two independent logic problems at once. Output X = A AND B, and Y = C OR D.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.NOR,
    GateType.OR,
    GateType.AND,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
  outputs: [{ name: 'X' }, { name: 'Y' }],
  truthTable: [
    {
      inputs: { A: false, B: false, C: false, D: false },
      outputs: { X: false, Y: false },
    },
    {
      inputs: { A: false, B: false, C: false, D: true },
      outputs: { X: false, Y: true },
    },
    {
      inputs: { A: false, B: false, C: true, D: false },
      outputs: { X: false, Y: true },
    },
    {
      inputs: { A: false, B: false, C: true, D: true },
      outputs: { X: false, Y: true },
    },
    {
      inputs: { A: false, B: true, C: false, D: false },
      outputs: { X: false, Y: false },
    },
    {
      inputs: { A: false, B: true, C: false, D: true },
      outputs: { X: false, Y: true },
    },
    {
      inputs: { A: false, B: true, C: true, D: false },
      outputs: { X: false, Y: true },
    },
    {
      inputs: { A: false, B: true, C: true, D: true },
      outputs: { X: false, Y: true },
    },
    {
      inputs: { A: true, B: false, C: false, D: false },
      outputs: { X: false, Y: false },
    },
    {
      inputs: { A: true, B: false, C: false, D: true },
      outputs: { X: false, Y: true },
    },
    {
      inputs: { A: true, B: false, C: true, D: false },
      outputs: { X: false, Y: true },
    },
    {
      inputs: { A: true, B: false, C: true, D: true },
      outputs: { X: false, Y: true },
    },
    {
      inputs: { A: true, B: true, C: false, D: false },
      outputs: { X: true, Y: false },
    },
    {
      inputs: { A: true, B: true, C: false, D: true },
      outputs: { X: true, Y: true },
    },
    {
      inputs: { A: true, B: true, C: true, D: false },
      outputs: { X: true, Y: true },
    },
    {
      inputs: { A: true, B: true, C: true, D: true },
      outputs: { X: true, Y: true },
    },
  ],
  hints: [
    'Each output depends on a different pair of inputs',
    'X needs AND, Y needs OR',
  ],
  unlocks: ['15-binary-racer'],
};
