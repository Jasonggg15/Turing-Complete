import { GateType } from '../../engine/types';
import type { Level } from '../Level';

export const level13OddNumberOfSignals: Level = {
  id: '13-odd-number-of-signals',
  name: 'ODD Number of Signals',
  section: 'Arithmetic and Memory',
  prerequisites: ['12-xnor-gate'],
  description:
    'Output ON when an odd number of inputs (1 or 3) are ON.',
  availableGates: [GateType.XOR],
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
        outputs: { Output: count % 2 === 1 },
      });
    }
    return entries;
  })(),
  hints: [
    'XOR of two signals is 1 when they differ',
    'Chain 3 XOR gates together for 4 inputs',
  ],
};
