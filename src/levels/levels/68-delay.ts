import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 68: Delay
 *
 * Build a 4-bit delay line: output the input value from 2 ticks ago.
 * Uses chained D flip-flops for a 2-stage pipeline.
 */
export const level68Delay: Level = {
  id: '68-delay',
  name: 'Delay',
  section: 'Functions',
  prerequisites: ['64-conditionals'],
  description:
    'Build a 4-bit delay line that outputs the input from 2 ticks ago. Chain two stages of D flip-flops to create a 2-tick pipeline delay.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.D_FLIPFLOP,
  ],
  inputs: [{ name: 'D3' }, { name: 'D2' }, { name: 'D1' }, { name: 'D0' }],
  outputs: [{ name: 'Q3' }, { name: 'Q2' }, { name: 'Q1' }, { name: 'Q0' }],
  truthTable: [],
  testSequence: (() => {
    const values = [0b0000, 0b1010, 0b0101, 0b1111, 0b0011, 0b1100, 0b0001];
    const steps: { inputs: Record<string, boolean>; outputs: Record<string, boolean> }[] = [];
    for (let t = 0; t < values.length; t++) {
      const d = values[t]!;
      const q = t >= 2 ? values[t - 2]! : 0;
      const inputs: Record<string, boolean> = {};
      const outputs: Record<string, boolean> = {};
      for (let i = 0; i < 4; i++) {
        inputs[`D${i}`] = !!(d & (1 << i));
        outputs[`Q${i}`] = !!(q & (1 << i));
      }
      steps.push({ inputs, outputs });
    }
    return steps;
  })(),
  hints: [
    'Chain two D flip-flops per bit: D → FF1 → FF2 → Q',
    'The first stage delays by 1 tick, the second by another tick = 2 ticks total',
  ],
};
