import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 37: Little Box
 *
 * Build a small memory unit — 4 addressable 1-bit cells (mini RAM).
 * 2-bit address, 1-bit data, SAVE signal. Output shows value at address.
 */
export const level37LittleBox: Level = {
  id: '37-little-box',
  name: 'Little Box',
  section: 'Arithmetic and Memory',
  prerequisites: ['25-1-bit-decoder'],
  description:
    'Build a 4x1-bit RAM. Two address bits (A1, A0) select one of four 1-bit cells. When SAVE is high, store DATA into the selected cell. Output always shows the value at the selected address.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'DATA' }, { name: 'A1' }, { name: 'A0' }, { name: 'SAVE' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [],
  testSequence: [
    // Tick 0: all cells start at 0. Read addr 00 → 0
    { inputs: { DATA: false, A1: false, A0: false, SAVE: false }, outputs: { OUT: false } },
    // Tick 1: Save 1 to addr 00
    { inputs: { DATA: true, A1: false, A0: false, SAVE: true }, outputs: { OUT: false } },
    // Tick 2: Read addr 00 → 1
    { inputs: { DATA: false, A1: false, A0: false, SAVE: false }, outputs: { OUT: true } },
    // Tick 3: Save 1 to addr 01
    { inputs: { DATA: true, A1: false, A0: true, SAVE: true }, outputs: { OUT: false } },
    // Tick 4: Read addr 01 → 1
    { inputs: { DATA: false, A1: false, A0: true, SAVE: false }, outputs: { OUT: true } },
    // Tick 5: Save 1 to addr 10
    { inputs: { DATA: true, A1: true, A0: false, SAVE: true }, outputs: { OUT: false } },
    // Tick 6: Read addr 10 → 1
    { inputs: { DATA: false, A1: true, A0: false, SAVE: false }, outputs: { OUT: true } },
    // Tick 7: Read addr 11 → 0 (never written)
    { inputs: { DATA: false, A1: true, A0: true, SAVE: false }, outputs: { OUT: false } },
    // Tick 8: Save 1 to addr 11
    { inputs: { DATA: true, A1: true, A0: true, SAVE: true }, outputs: { OUT: false } },
    // Tick 9: Read addr 11 → 1
    { inputs: { DATA: false, A1: true, A0: true, SAVE: false }, outputs: { OUT: true } },
    // Tick 10: Read addr 00 → still 1
    { inputs: { DATA: false, A1: false, A0: false, SAVE: false }, outputs: { OUT: true } },
    // Tick 11: Save 0 to addr 00
    { inputs: { DATA: false, A1: false, A0: false, SAVE: true }, outputs: { OUT: true } },
    // Tick 12: Read addr 00 → now 0
    { inputs: { DATA: false, A1: false, A0: false, SAVE: false }, outputs: { OUT: false } },
  ],
  hints: [
    'Decode the 2-bit address to enable one of 4 registers for writing',
    'Use a 4-to-1 multiplexer on the output to select which register to read',
  ],

};
