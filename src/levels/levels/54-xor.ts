import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 54: XOR
 *
 * Build a multi-bit XOR: apply XOR to two 4-bit inputs, producing a 4-bit output.
 */
export const level54Xor: Level = {
  id: '54-xor',
  name: 'XOR',
  section: 'CPU Architecture 2',
  prerequisites: ['53-the-maze'],
  description:
    'Build a 4-bit bitwise XOR unit. Each output bit Ri = Ai XOR Bi.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
  ],
  inputs: [
    { name: 'A3' }, { name: 'A2' }, { name: 'A1' }, { name: 'A0' },
    { name: 'B3' }, { name: 'B2' }, { name: 'B1' }, { name: 'B0' },
  ],
  outputs: [{ name: 'R3' }, { name: 'R2' }, { name: 'R1' }, { name: 'R0' }],
  truthTable: (() => {
    const cases = [
      [0x0, 0x0], [0xf, 0x0], [0x0, 0xf], [0xf, 0xf],
      [0xa, 0x5], [0x5, 0xa], [0x3, 0xc], [0x6, 0x9],
    ];
    return cases.map((pair) => {
      const a = pair[0]!;
      const b = pair[1]!;
      const r = a ^ b;
      const inputs: Record<string, boolean> = {};
      const outputs: Record<string, boolean> = {};
      for (let i = 0; i < 4; i++) {
        inputs[`A${i}`] = !!(a & (1 << i));
        inputs[`B${i}`] = !!(b & (1 << i));
        outputs[`R${i}`] = !!(r & (1 << i));
      }
      return { inputs, outputs };
    });
  })(),
  hints: [
    'Simply wire 4 parallel XOR gates: R0 = A0 XOR B0, etc.',
  ],
};
