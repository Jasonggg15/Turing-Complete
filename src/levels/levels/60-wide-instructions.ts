import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 60: Wide Instructions
 *
 * Split a 16-bit instruction word into fields:
 * bits [15:12] = opcode, bits [11:8] = regA, bits [7:4] = regB, bits [3:0] = immediate.
 */
export const level60WideInstructions: Level = {
  id: '60-wide-instructions',
  name: 'Wide Instructions',
  section: 'CPU Architecture 2',
  description:
    'Split a 16-bit instruction word into its fields. Bits 15-12 are the opcode (OP3-OP0), bits 11-8 are register A (RA3-RA0), bits 7-4 are register B (RB3-RB0), and bits 3-0 are the immediate value (IM3-IM0). This is a wiring puzzle — route each input bit to the correct output.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
  ],
  inputs: (() => {
    const pins = [];
    for (let i = 15; i >= 0; i--) pins.push({ name: `I${i}` });
    return pins;
  })(),
  outputs: [
    { name: 'OP3' }, { name: 'OP2' }, { name: 'OP1' }, { name: 'OP0' },
    { name: 'RA3' }, { name: 'RA2' }, { name: 'RA1' }, { name: 'RA0' },
    { name: 'RB3' }, { name: 'RB2' }, { name: 'RB1' }, { name: 'RB0' },
    { name: 'IM3' }, { name: 'IM2' }, { name: 'IM1' }, { name: 'IM0' },
  ],
  truthTable: (() => {
    const cases = [0x0000, 0xffff, 0x1234, 0xabcd, 0x5a5a, 0xf00f];
    return cases.map((v) => {
      const inputs: Record<string, boolean> = {};
      for (let i = 0; i < 16; i++) inputs[`I${i}`] = !!(v & (1 << i));
      const op = (v >> 12) & 0xf;
      const ra = (v >> 8) & 0xf;
      const rb = (v >> 4) & 0xf;
      const im = v & 0xf;
      const outputs: Record<string, boolean> = {};
      for (let i = 0; i < 4; i++) {
        outputs[`OP${i}`] = !!(op & (1 << i));
        outputs[`RA${i}`] = !!(ra & (1 << i));
        outputs[`RB${i}`] = !!(rb & (1 << i));
        outputs[`IM${i}`] = !!(im & (1 << i));
      }
      return { inputs, outputs };
    });
  })(),
  hints: [
    'This is purely a wiring puzzle — no logic gates needed',
    'Wire I15→OP3, I14→OP2, ..., I12→OP0, I11→RA3, ..., I0→IM0',
  ],
  unlocks: ['61-wire-spaghetti'],
};
