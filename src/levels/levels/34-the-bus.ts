import { GateType } from '../../engine/types';
import type { Level } from '../Level';

/**
 * Level 34: The Bus
 *
 * Route data along a shared bus using control signals.
 * 4 data inputs, 2 select bits → route the selected input to output.
 * 4-to-1 multiplexer.
 */
export const level34TheBus: Level = {
  id: '34-the-bus',
  name: 'The Bus',
  section: 'Arithmetic and Memory',
  prerequisites: ['33-input-selector'],
  description:
    'Build a 4-to-1 multiplexer. Four data inputs (D0-D3) and two select bits (S1, S0). Output the selected input: 00→D0, 01→D1, 10→D2, 11→D3.',
  availableGates: [
    GateType.NAND,
    GateType.NOT,
    GateType.AND,
    GateType.OR,
    GateType.XOR,
    GateType.XNOR,
  ],
  inputs: [
    { name: 'D0' },
    { name: 'D1' },
    { name: 'D2' },
    { name: 'D3' },
    { name: 'S1' },
    { name: 'S0' },
  ],
  outputs: [{ name: 'OUT' }],
  truthTable: (() => {
    const entries: { inputs: Record<string, boolean>; outputs: Record<string, boolean> }[] = [];
    // Test each select combination with the selected input on and off
    for (let sel = 0; sel < 4; sel++) {
      const s1 = !!(sel & 2);
      const s0 = !!(sel & 1);
      // Case 1: selected input is ON, others OFF
      const inputs1: Record<string, boolean> = {
        D0: sel === 0,
        D1: sel === 1,
        D2: sel === 2,
        D3: sel === 3,
        S1: s1,
        S0: s0,
      };
      entries.push({ inputs: inputs1, outputs: { OUT: true } });
      // Case 2: selected input is OFF, others ON
      const inputs2: Record<string, boolean> = {
        D0: sel !== 0,
        D1: sel !== 1,
        D2: sel !== 2,
        D3: sel !== 3,
        S1: s1,
        S0: s0,
      };
      entries.push({ inputs: inputs2, outputs: { OUT: false } });
    }
    // Case 3: all inputs ON
    for (let sel = 0; sel < 4; sel++) {
      entries.push({
        inputs: { D0: true, D1: true, D2: true, D3: true, S1: !!(sel & 2), S0: !!(sel & 1) },
        outputs: { OUT: true },
      });
    }
    // Case 4: all inputs OFF
    for (let sel = 0; sel < 4; sel++) {
      entries.push({
        inputs: { D0: false, D1: false, D2: false, D3: false, S1: !!(sel & 2), S0: !!(sel & 1) },
        outputs: { OUT: false },
      });
    }
    return entries;
  })(),
  hints: [
    'Decode the select bits to enable one of 4 AND gates',
    'AND each data input with its select condition, then OR all results',
  ],

};
