import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 64: Conditionals
 *
 * Build a conditional branch unit: given flags (ZERO, NEG, CARRY)
 * and a 2-bit condition code, output whether the branch should be taken.
 * CC: 00=always, 01=if zero, 10=if negative, 11=if carry.
 */
export const level64Conditionals: Level = {
  id: '64-conditionals',
  name: 'Conditionals',
  section: 'CPU Architecture 2',
  prerequisites: ['63-immediate-values-leg'],
  description:
    'Build a conditional branch evaluator. Given three flags (ZERO, NEG, CARRY) and a 2-bit condition code (CC1, CC0), output BRANCH=1 when the condition is met: 00=always branch, 01=branch if ZERO, 10=branch if NEG, 11=branch if CARRY.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.NOR,
    GateType.XNOR,
  ],
  inputs: [
    { name: 'ZERO' },
    { name: 'NEG' },
    { name: 'CARRY' },
    { name: 'CC1' },
    { name: 'CC0' },
  ],
  outputs: [{ name: 'BRANCH' }],
  truthTable: (() => {
    const entries: { inputs: Record<string, boolean>; outputs: Record<string, boolean> }[] = [];
    for (let cc = 0; cc < 4; cc++) {
      for (let flags = 0; flags < 8; flags++) {
        const zero = !!(flags & 1);
        const neg = !!(flags & 2);
        const carry = !!(flags & 4);
        let branch: boolean;
        switch (cc) {
          case 0: branch = true; break;
          case 1: branch = zero; break;
          case 2: branch = neg; break;
          case 3: branch = carry; break;
          default: branch = false;
        }
        entries.push({
          inputs: {
            ZERO: zero, NEG: neg, CARRY: carry,
            CC1: !!(cc & 2), CC0: !!(cc & 1),
          },
          outputs: { BRANCH: branch },
        });
      }
    }
    return entries;
  })(),
  hints: [
    'Build a 4:1 mux selecting among: 1 (always), ZERO, NEG, CARRY',
    'CC1 and CC0 are the select lines for the mux',
    'For CC=00 (always), BRANCH is always 1',
  ],
};
