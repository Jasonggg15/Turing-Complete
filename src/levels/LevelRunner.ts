import { GateType } from '../engine/types';
import { Circuit } from '../engine/Circuit';
import { Simulator } from '../engine/Simulator';
import type { Level, LevelResult } from './Level';

export class LevelRunner {
  run(level: Level, circuit: Circuit): LevelResult {
    if (level.testSequence && level.testSequence.length > 0) {
      return this.runSequential(level, circuit);
    }
    return this.runCombinational(level, circuit);
  }

  private runCombinational(level: Level, circuit: Circuit): LevelResult {
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

  private runSequential(level: Level, circuit: Circuit): LevelResult {
    const simulator = new Simulator();
    const gates = circuit.getGates();
    const inputGates = gates.filter((g) => g.type === GateType.INPUT);
    const outputGates = gates.filter((g) => g.type === GateType.OUTPUT);

    simulator.resetState(circuit);

    const results: LevelResult['results'] = [];

    for (let tick = 0; tick < level.testSequence!.length; tick++) {
      const step = level.testSequence![tick]!;

      const inputsMap = new Map<string, boolean>();
      for (const inputGate of inputGates) {
        const value = step.inputs[inputGate.label];
        if (value !== undefined) {
          const outPin = inputGate.outputs[0];
          if (outPin) {
            inputsMap.set(outPin.id, value);
          }
        }
      }

      // Evaluate combinational logic for this tick
      const simResult = simulator.simulateStep(circuit, inputsMap);

      const outputs: Record<string, boolean> = {};
      let pass = true;

      for (const outputGate of outputGates) {
        const inPin = outputGate.inputs[0];
        if (inPin) {
          const actual = simResult.get(inPin.id) ?? false;
          outputs[outputGate.label] = actual;
          const expected = step.outputs[outputGate.label];
          if (expected !== undefined && actual !== expected) {
            pass = false;
          }
        }
      }

      results.push({
        tick,
        inputs: step.inputs,
        outputs,
        expected: step.outputs,
        pass,
      });

      // Advance stateful gates (latch D inputs)
      simulator.tick(circuit);
    }

    return {
      passed: results.every((r) => r.pass),
      results,
    };
  }
}
