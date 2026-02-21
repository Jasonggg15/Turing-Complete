import { GateType } from '../../engine/types';
import type { Level, TruthTableEntry } from '../Level';

/**
 * Level 63: Immediate Values (Leg)
 *
 * Zero-extend a 4-bit immediate to 8 bits (unsigned extension).
 * Unlike sign-extension, the upper bits are always 0.
 */
function zeroExtEntry(v: number): TruthTableEntry {
  const inputs: Record<string, boolean> = {};
  for (let i = 0; i < 4; i++) inputs[`I${i}`] = !!(v & (1 << i));
  const outputs: Record<string, boolean> = {};
  for (let i = 0; i < 8; i++) outputs[`E${i}`] = !!(v & (1 << i));
  return { inputs, outputs };
}

export const level63ImmediateValuesLeg: Level = {
  id: '63-immediate-values-leg',
  name: 'Immediate Values (Leg)',
  section: 'CPU Architecture 2',
  prerequisites: ['62-opcodes'],
  description:
    'Zero-extend a 4-bit immediate value to 8 bits. Copy I3-I0 to E3-E0 and set E7-E4 to 0. Unlike sign extension, the upper bits are always zero regardless of the sign bit.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
  ],
  inputs: [{ name: 'I3' }, { name: 'I2' }, { name: 'I1' }, { name: 'I0' }],
  outputs: [
    { name: 'E7' }, { name: 'E6' }, { name: 'E5' }, { name: 'E4' },
    { name: 'E3' }, { name: 'E2' }, { name: 'E1' }, { name: 'E0' },
  ],
  truthTable: [
    zeroExtEntry(0),
    zeroExtEntry(1),
    zeroExtEntry(5),
    zeroExtEntry(7),
    zeroExtEntry(8),
    zeroExtEntry(10),
    zeroExtEntry(15),
    zeroExtEntry(4),
  ],
  hints: [
    'Wire I0→E0, I1→E1, I2→E2, I3→E3 directly',
    'E4, E5, E6, E7 are always 0 — leave them unconnected or wire to ground',
  ],
};
