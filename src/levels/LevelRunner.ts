import { GateType } from '../engine/types';
import { Circuit } from '../engine/Circuit';
import { Simulator } from '../engine/Simulator';
import type { Level, LevelResult } from './Level';

export class LevelRunner {
  run(level: Level, circuit: Circuit): LevelResult {
    const simulator = new Simulator();
    const gates = circuit.getGates();
    const inputGates = gates.filter((g) => g.type === GateType.INPUT);
    const outputGates = gates.filter((g) => g.type === GateType.OUTPUT);

    const results: LevelResult['results'] = [];

    for (const entry of level.truthTable) {
      const inputsMap = new Map<string, boolean>();

      for (const inputGate of inputGates) {
        const value = entry.inputs[inputGate.label];
        if (value !== undefined) {
          const outPin = inputGate.outputs[0];
          if (outPin) {
            inputsMap.set(outPin.id, value);
          }
        }
      }

      const simResult = simulator.simulate(circuit, inputsMap);

      const outputs: Record<string, boolean> = {};
      let pass = true;

      for (const outputGate of outputGates) {
        const inPin = outputGate.inputs[0];
        if (inPin) {
          const actual = simResult.get(inPin.id) ?? false;
          outputs[outputGate.label] = actual;
          const expected = entry.outputs[outputGate.label];
          if (expected !== undefined && actual !== expected) {
            pass = false;
          }
        }
      }

      results.push({
        inputs: entry.inputs,
        outputs,
        expected: entry.outputs,
        pass,
      });
    }

    return {
      passed: results.every((r) => r.pass),
      results,
    };
  }
}
