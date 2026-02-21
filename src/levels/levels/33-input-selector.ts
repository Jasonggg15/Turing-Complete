import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 33: Input Selector (2-to-1 Multiplexer)
 *
 * Select between two inputs using a select signal.
 * When SEL=0, output A. When SEL=1, output B.
 * This is a purely combinational level (no testSequence needed).
 */
export const level33InputSelector: Level = {
  id: '33-input-selector',
  name: 'Input Selector',
  section: 'Memory',
  description:
    'Build a 2-to-1 multiplexer. When SEL is off, output A. When SEL is on, output B.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [{ name: 'A' }, { name: 'B' }, { name: 'SEL' }],
  outputs: [{ name: 'OUT' }],
  truthTable: [
    { inputs: { A: false, B: false, SEL: false }, outputs: { OUT: false } },
    { inputs: { A: false, B: true, SEL: false }, outputs: { OUT: false } },
    { inputs: { A: true, B: false, SEL: false }, outputs: { OUT: true } },
    { inputs: { A: true, B: true, SEL: false }, outputs: { OUT: true } },
    { inputs: { A: false, B: false, SEL: true }, outputs: { OUT: false } },
    { inputs: { A: false, B: true, SEL: true }, outputs: { OUT: true } },
    { inputs: { A: true, B: false, SEL: true }, outputs: { OUT: false } },
    { inputs: { A: true, B: true, SEL: true }, outputs: { OUT: true } },
  ],
  hints: [
    'OUT = (A AND NOT SEL) OR (B AND SEL)',
    'AND each input with the appropriate select condition, then OR the results',
  ],
  unlocks: ['34-the-bus'],
};
