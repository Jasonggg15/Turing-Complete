import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level14DoubleTrouble: Level = {
  id: '14-double-trouble',
  name: 'Double Trouble',
  section: 'Arithmetic and Memory',
  prerequisites: ['10-bigger-or-gate'],
  unlocks: ['16-counting-signals'],
  description:
    'Output an ON signal when at least two of the four inputs are receiving an ON signal.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
  ],
  inputs: [{ name: 'Input 1' }, { name: 'Input 2' }, { name: 'Input 3' }, { name: 'Input 4' }],
  outputs: [{ name: 'Output' }],
  truthTable: (() => {
    const entries: { inputs: Record<string, boolean>; outputs: Record<string, boolean> }[] = [];
    for (let i = 0; i < 16; i++) {
      const i1 = !!(i & 1);
      const i2 = !!(i & 2);
      const i3 = !!(i & 4);
      const i4 = !!(i & 8);
      const count = (i1 ? 1 : 0) + (i2 ? 1 : 0) + (i3 ? 1 : 0) + (i4 ? 1 : 0);
      entries.push({
        inputs: { 'Input 1': i1, 'Input 2': i2, 'Input 3': i3, 'Input 4': i4 },
        outputs: { Output: count >= 2 },
      });
    }
    return entries;
  })(),
  hints: [
    'Output is ON when any two inputs are both ON',
    'Check all 6 pairs with AND, then OR the results together',
  ],
};
