import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 36: Saving Bytes
 *
 * Store multiple bits using addressing. Two 1-bit registers addressed by ADDR.
 * SAVE stores DATA into the selected register. Output always shows the
 * selected register's value.
 */
export const level36SavingBytes: Level = {
  id: '36-saving-bytes',
  name: 'Saving Bytes',
  section: 'Arithmetic and Memory',
  prerequisites: ['34-the-bus', '35-saving-gracefully'],
  unlocks: ['25-1-bit-decoder', '37-little-box'],
  description:
    'Create a component that saves and loads data values using addressed memory. When SAVE is high, store DATA into the register selected by ADDR.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'DATA' }, { name: 'ADDR' }, { name: 'SAVE' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [],
  testSequence: [
    // Tick 0: initial → both registers 0. Read addr 0 → 0
    { inputs: { DATA: false, ADDR: false, SAVE: false }, outputs: { OUT: false } },
    // Tick 1: Save 1 to addr 0, output still shows old (0)
    { inputs: { DATA: true, ADDR: false, SAVE: true }, outputs: { OUT: false } },
    // Tick 2: Read addr 0 → now 1
    { inputs: { DATA: false, ADDR: false, SAVE: false }, outputs: { OUT: true } },
    // Tick 3: Read addr 1 → 0 (never written)
    { inputs: { DATA: false, ADDR: true, SAVE: false }, outputs: { OUT: false } },
    // Tick 4: Save 1 to addr 1
    { inputs: { DATA: true, ADDR: true, SAVE: true }, outputs: { OUT: false } },
    // Tick 5: Read addr 1 → now 1
    { inputs: { DATA: false, ADDR: true, SAVE: false }, outputs: { OUT: true } },
    // Tick 6: Read addr 0 → still 1
    { inputs: { DATA: false, ADDR: false, SAVE: false }, outputs: { OUT: true } },
    // Tick 7: Save 0 to addr 0
    { inputs: { DATA: false, ADDR: false, SAVE: true }, outputs: { OUT: true } },
    // Tick 8: Read addr 0 → now 0
    { inputs: { DATA: false, ADDR: false, SAVE: false }, outputs: { OUT: false } },
    // Tick 9: Read addr 1 → still 1
    { inputs: { DATA: false, ADDR: true, SAVE: false }, outputs: { OUT: true } },
  ],
  hints: [
    'Use ADDR to decode which register gets the SAVE signal',
    'Use a mux on the output to select which register to read',
  ],

};
