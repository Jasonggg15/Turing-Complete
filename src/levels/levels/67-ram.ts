import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 67: RAM
 *
 * Build a 4x2-bit RAM (4 addresses, 2 bits per cell).
 * 2-bit address, 2-bit data, WRITE signal.
 */
export const level67Ram: Level = {
  id: '67-ram',
  name: 'RAM',
  section: 'Functions',
  description:
    'Build a 4×2-bit RAM. Two address bits (A1, A0) select one of four 2-bit cells. When WRITE is high, store the data (D1, D0) into the selected cell. Outputs Q1, Q0 always show the value at the selected address.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [
    { name: 'D1' }, { name: 'D0' },
    { name: 'A1' }, { name: 'A0' },
    { name: 'WRITE' },
  ],
  outputs: [{ name: 'Q1' }, { name: 'Q0' }],
  truthTable: [],
  testSequence: [
    // Tick 0: all cells = 00. Read addr 00 → 00
    { inputs: { D1: false, D0: false, A1: false, A0: false, WRITE: false }, outputs: { Q1: false, Q0: false } },
    // Tick 1: Write 11 to addr 00
    { inputs: { D1: true, D0: true, A1: false, A0: false, WRITE: true }, outputs: { Q1: false, Q0: false } },
    // Tick 2: Read addr 00 → 11
    { inputs: { D1: false, D0: false, A1: false, A0: false, WRITE: false }, outputs: { Q1: true, Q0: true } },
    // Tick 3: Write 10 to addr 01
    { inputs: { D1: true, D0: false, A1: false, A0: true, WRITE: true }, outputs: { Q1: false, Q0: false } },
    // Tick 4: Read addr 01 → 10
    { inputs: { D1: false, D0: false, A1: false, A0: true, WRITE: false }, outputs: { Q1: true, Q0: false } },
    // Tick 5: Read addr 00 → still 11
    { inputs: { D1: false, D0: false, A1: false, A0: false, WRITE: false }, outputs: { Q1: true, Q0: true } },
    // Tick 6: Write 01 to addr 10
    { inputs: { D1: false, D0: true, A1: true, A0: false, WRITE: true }, outputs: { Q1: false, Q0: false } },
    // Tick 7: Read addr 10 → 01
    { inputs: { D1: false, D0: false, A1: true, A0: false, WRITE: false }, outputs: { Q1: false, Q0: true } },
    // Tick 8: Write 11 to addr 11
    { inputs: { D1: true, D0: true, A1: true, A0: true, WRITE: true }, outputs: { Q1: false, Q0: false } },
    // Tick 9: Read addr 11 → 11
    { inputs: { D1: false, D0: false, A1: true, A0: true, WRITE: false }, outputs: { Q1: true, Q0: true } },
  ],
  hints: [
    'Decode the 2-bit address to enable one of 4 register pairs for writing',
    'Use a 4:1 mux on the output to select which register pair to read',
    'Each cell needs 2 D flip-flops (one per bit), gated by WRITE AND address decode',
  ],
  unlocks: ['68-delay'],
};
