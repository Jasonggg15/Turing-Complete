import { GateType } from '../../engine/types';
import type { Level, TruthTableEntry } from '../Level';

function addBytesEntry(a: number, b: number, cin: number): TruthTableEntry {
  const sum = a + b + cin;
  const inputs: Record<string, boolean> = { CIN: !!cin };
  const outputs: Record<string, boolean> = { COUT: sum > 255 };
  for (let i = 0; i < 8; i++) {
    inputs[`A${i}`] = !!(a & (1 << i));
    inputs[`B${i}`] = !!(b & (1 << i));
    outputs[`S${i}`] = !!(sum & (1 << i));
  }
  return { inputs, outputs };
}

export const level22AddingBytes: Level = {
  id: '22-adding-bytes',
  name: 'Adding Bytes',
  section: 'Arithmetic',
  description:
    'Add two 8-bit binary numbers with a carry-in. Chain full adders to build an 8-bit ripple-carry adder.',
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
    { name: 'A0' },
    { name: 'A1' },
    { name: 'A2' },
    { name: 'A3' },
    { name: 'A4' },
    { name: 'A5' },
    { name: 'A6' },
    { name: 'A7' },
    { name: 'B0' },
    { name: 'B1' },
    { name: 'B2' },
    { name: 'B3' },
    { name: 'B4' },
    { name: 'B5' },
    { name: 'B6' },
    { name: 'B7' },
    { name: 'CIN' },
  ],
  outputs: [
    { name: 'S0' },
    { name: 'S1' },
    { name: 'S2' },
    { name: 'S3' },
    { name: 'S4' },
    { name: 'S5' },
    { name: 'S6' },
    { name: 'S7' },
    { name: 'COUT' },
  ],
  truthTable: [
    addBytesEntry(0, 0, 0),
    addBytesEntry(1, 1, 0),
    addBytesEntry(0, 0, 1),
    addBytesEntry(1, 0, 1),
    addBytesEntry(127, 1, 0),
    addBytesEntry(255, 1, 0),
    addBytesEntry(255, 255, 0),
    addBytesEntry(255, 255, 1),
    addBytesEntry(170, 85, 0),
    addBytesEntry(85, 170, 0),
    addBytesEntry(128, 128, 0),
    addBytesEntry(100, 55, 0),
    addBytesEntry(200, 100, 0),
    addBytesEntry(0x0f, 0xf0, 0),
    addBytesEntry(0xaa, 0x55, 1),
    addBytesEntry(0x01, 0x01, 0),
    addBytesEntry(0x80, 0x7f, 0),
    addBytesEntry(0x80, 0x7f, 1),
    addBytesEntry(0x37, 0x48, 0),
    addBytesEntry(0xfe, 0x01, 0),
    addBytesEntry(0xfe, 0x01, 1),
  ],
  hints: [
    'Chain 8 full adders from LSB to MSB',
    "Each full adder's carry-out connects to the next one's carry-in",
  ],
  unlocks: ['23-negative-numbers'],
};
