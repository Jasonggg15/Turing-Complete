import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 40: Registers
 *
 * Build a register file with two 2-bit registers.
 * ADDR selects which register to read/write.
 * When WRITE is high, store D1:D0 into the selected register.
 * Output always shows the selected register's value.
 */
export const level40Registers: Level = {
  id: '40-registers',
  name: 'Registers',
  section: 'CPU Architecture',
  description:
    'Build a register file with two 2-bit registers. ADDR selects the register. When WRITE is high, store the 2-bit input (D1, D0) into the selected register. Outputs Q1, Q0 always show the selected register value.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'D1' }, { name: 'D0' }, { name: 'ADDR' }, { name: 'WRITE' }],
  outputs: [{ name: 'Q1' }, { name: 'Q0' }],
  truthTable: [],
  testSequence: [
    // Tick 0: initial state, both registers = 00. Read reg 0 → 00
    { inputs: { D1: false, D0: false, ADDR: false, WRITE: false }, outputs: { Q1: false, Q0: false } },
    // Tick 1: Write 11 to reg 0
    { inputs: { D1: true, D0: true, ADDR: false, WRITE: true }, outputs: { Q1: false, Q0: false } },
    // Tick 2: Read reg 0 → 11
    { inputs: { D1: false, D0: false, ADDR: false, WRITE: false }, outputs: { Q1: true, Q0: true } },
    // Tick 3: Read reg 1 → 00 (never written)
    { inputs: { D1: false, D0: false, ADDR: true, WRITE: false }, outputs: { Q1: false, Q0: false } },
    // Tick 4: Write 10 to reg 1
    { inputs: { D1: true, D0: false, ADDR: true, WRITE: true }, outputs: { Q1: false, Q0: false } },
    // Tick 5: Read reg 1 → 10
    { inputs: { D1: false, D0: false, ADDR: true, WRITE: false }, outputs: { Q1: true, Q0: false } },
    // Tick 6: Read reg 0 → still 11
    { inputs: { D1: false, D0: false, ADDR: false, WRITE: false }, outputs: { Q1: true, Q0: true } },
    // Tick 7: Write 01 to reg 0
    { inputs: { D1: false, D0: true, ADDR: false, WRITE: true }, outputs: { Q1: true, Q0: true } },
    // Tick 8: Read reg 0 → 01
    { inputs: { D1: false, D0: false, ADDR: false, WRITE: false }, outputs: { Q1: false, Q0: true } },
    // Tick 9: Read reg 1 → still 10
    { inputs: { D1: false, D0: false, ADDR: true, WRITE: false }, outputs: { Q1: true, Q0: false } },
  ],
  hints: [
    'Use ADDR to decode which register receives the WRITE signal',
    'Each register needs two D flip-flops (one per bit)',
    'Use a mux on the output to select which register to read based on ADDR',
  ],
  unlocks: ['41-component-factory'],
};
