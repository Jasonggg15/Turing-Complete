import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 62: Opcodes
 *
 * Extended instruction decoder: 4-bit opcode → 8 one-hot control signals.
 */
export const level62Opcodes: Level = {
  id: '62-opcodes',
  name: 'Opcodes',
  section: 'CPU Architecture 2',
  description:
    'Build a 4-bit to 8-line decoder. Given a 4-bit opcode (OP3-OP0), activate exactly one of eight output lines (Y0-Y7) corresponding to opcodes 0-7. For opcodes 8-15, all outputs should be low.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
  ],
  inputs: [{ name: 'OP3' }, { name: 'OP2' }, { name: 'OP1' }, { name: 'OP0' }],
  outputs: [
    { name: 'Y7' }, { name: 'Y6' }, { name: 'Y5' }, { name: 'Y4' },
    { name: 'Y3' }, { name: 'Y2' }, { name: 'Y1' }, { name: 'Y0' },
  ],
  truthTable: (() => {
    const entries = [];
    for (let op = 0; op < 16; op++) {
      const inputs: Record<string, boolean> = {};
      for (let i = 0; i < 4; i++) inputs[`OP${i}`] = !!(op & (1 << i));
      const outputs: Record<string, boolean> = {};
      for (let i = 0; i < 8; i++) outputs[`Y${i}`] = op < 8 && op === i;
      entries.push({ inputs, outputs });
    }
    return entries;
  })(),
  hints: [
    'Use NOT(OP3) as an enable signal — only active for opcodes 0-7',
    'Decode the lower 3 bits (OP2, OP1, OP0) into 8 lines using AND gates',
    'Each Yi = NOT(OP3) AND (combination of OP2/OP1/OP0 matching i)',
  ],
  unlocks: ['63-immediate-values-leg'],
};
