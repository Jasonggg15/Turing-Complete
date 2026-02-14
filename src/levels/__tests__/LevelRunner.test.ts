import { describe, it, expect } from 'vitest';
import { Circuit } from '../../engine/Circuit';
import { GateType } from '../../engine/types';
import { LevelRunner } from '../LevelRunner';
import { levels } from '../levels/index';

function findLevel(id: string) {
  const level = levels.find((l) => l.id === id);
  if (!level) throw new Error(`Level ${id} not found`);
  return level;
}

describe('LevelRunner', () => {
  const runner = new LevelRunner();

  describe('01-not: NOT gate from NAND', () => {
    const level = findLevel('01-not');

    it('passes a correct NOT circuit (NAND with both inputs tied)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const nand = circuit.addGate(GateType.NAND, { x: 200, y: 0 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), nand.getInput('a'));
      circuit.addWire(inputA.getOutput('out'), nand.getInput('b'));
      circuit.addWire(nand.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(2);
      expect(result.results.every((r) => r.pass)).toBe(true);
    });

    it('fails with empty circuit (no wires)', () => {
      const circuit = new Circuit();
      circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'OUT');

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });

    it('fails with direct pass-through (not inverted)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
      expect(result.results.filter((r) => r.pass)).toHaveLength(0);
    });

    it('returns detailed results per truth table entry', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const nand = circuit.addGate(GateType.NAND, { x: 200, y: 0 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), nand.getInput('a'));
      circuit.addWire(inputA.getOutput('out'), nand.getInput('b'));
      circuit.addWire(nand.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.results).toHaveLength(2);

      const row0 = result.results[0]!;
      expect(row0.inputs).toEqual({ A: false });
      expect(row0.expected).toEqual({ OUT: true });
      expect(row0.outputs).toEqual({ OUT: true });
      expect(row0.pass).toBe(true);

      const row1 = result.results[1]!;
      expect(row1.inputs).toEqual({ A: true });
      expect(row1.expected).toEqual({ OUT: false });
      expect(row1.outputs).toEqual({ OUT: false });
      expect(row1.pass).toBe(true);
    });
  });

  describe('02-and: AND gate from NAND', () => {
    const level = findLevel('02-and');

    it('passes with correct AND circuit (NAND + NOT)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const nand1 = circuit.addGate(GateType.NAND, { x: 200, y: 50 });
      const nand2 = circuit.addGate(GateType.NAND, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'OUT');

      // NAND(A, B)
      circuit.addWire(inputA.getOutput('out'), nand1.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), nand1.getInput('b'));
      // NOT(nand1) = NAND(nand1, nand1)
      circuit.addWire(nand1.getOutput('out'), nand2.getInput('a'));
      circuit.addWire(nand1.getOutput('out'), nand2.getInput('b'));
      circuit.addWire(nand2.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(4);
    });

    it('fails with only one NAND (gives NAND, not AND)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const nand = circuit.addGate(GateType.NAND, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), nand.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), nand.getInput('b'));
      circuit.addWire(nand.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('03-or: OR gate from NAND', () => {
    const level = findLevel('03-or');

    it('passes with correct OR circuit', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      // NOT A = NAND(A, A)
      const notA = circuit.addGate(GateType.NAND, { x: 200, y: 0 });
      // NOT B = NAND(B, B)
      const notB = circuit.addGate(GateType.NAND, { x: 200, y: 100 });
      // NAND(NOT A, NOT B) = OR(A, B)
      const orNand = circuit.addGate(GateType.NAND, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), notA.getInput('a'));
      circuit.addWire(inputA.getOutput('out'), notA.getInput('b'));
      circuit.addWire(inputB.getOutput('out'), notB.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), notB.getInput('b'));
      circuit.addWire(notA.getOutput('out'), orNand.getInput('a'));
      circuit.addWire(notB.getOutput('out'), orNand.getInput('b'));
      circuit.addWire(orNand.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(4);
    });
  });

  describe('04-xor: XOR gate from NAND', () => {
    const level = findLevel('04-xor');

    it('passes with correct XOR circuit (4 NANDs)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      // nand1 = NAND(A, B)
      const nand1 = circuit.addGate(GateType.NAND, { x: 200, y: 50 });
      // nand2 = NAND(A, nand1)
      const nand2 = circuit.addGate(GateType.NAND, { x: 400, y: 0 });
      // nand3 = NAND(B, nand1)
      const nand3 = circuit.addGate(GateType.NAND, { x: 400, y: 100 });
      // nand4 = NAND(nand2, nand3) = XOR
      const nand4 = circuit.addGate(GateType.NAND, { x: 600, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 800, y: 50 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), nand1.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), nand1.getInput('b'));
      circuit.addWire(inputA.getOutput('out'), nand2.getInput('a'));
      circuit.addWire(nand1.getOutput('out'), nand2.getInput('b'));
      circuit.addWire(inputB.getOutput('out'), nand3.getInput('a'));
      circuit.addWire(nand1.getOutput('out'), nand3.getInput('b'));
      circuit.addWire(nand2.getOutput('out'), nand4.getInput('a'));
      circuit.addWire(nand3.getOutput('out'), nand4.getInput('b'));
      circuit.addWire(nand4.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(4);
    });
  });

  describe('05-half-adder', () => {
    const level = findLevel('05-half-adder');

    it('passes with correct half adder (XOR for SUM, AND for CARRY)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 0 });
      const and = circuit.addGate(GateType.AND, { x: 200, y: 100 });
      const sum = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'SUM');
      const carry = circuit.addGate(
        GateType.OUTPUT,
        { x: 400, y: 100 },
        'CARRY',
      );

      circuit.addWire(inputA.getOutput('out'), xor.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), xor.getInput('b'));
      circuit.addWire(inputA.getOutput('out'), and.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), and.getInput('b'));
      circuit.addWire(xor.getOutput('out'), sum.getInput('in'));
      circuit.addWire(and.getOutput('out'), carry.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(4);
    });

    it('fails with swapped outputs (SUM↔CARRY)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const and = circuit.addGate(GateType.AND, { x: 200, y: 0 });
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 100 });
      const sum = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'SUM');
      const carry = circuit.addGate(
        GateType.OUTPUT,
        { x: 400, y: 100 },
        'CARRY',
      );

      // AND → SUM (wrong), XOR → CARRY (wrong)
      circuit.addWire(inputA.getOutput('out'), and.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), and.getInput('b'));
      circuit.addWire(inputA.getOutput('out'), xor.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), xor.getInput('b'));
      circuit.addWire(and.getOutput('out'), sum.getInput('in'));
      circuit.addWire(xor.getOutput('out'), carry.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('level definitions', () => {
    it('all levels have valid truth tables', () => {
      for (const level of levels) {
        expect(level.truthTable.length).toBeGreaterThan(0);
        for (const entry of level.truthTable) {
          for (const input of level.inputs) {
            expect(entry.inputs).toHaveProperty(input.name);
          }
          for (const output of level.outputs) {
            expect(entry.outputs).toHaveProperty(output.name);
          }
        }
      }
    });

    it('all levels have required fields', () => {
      for (const level of levels) {
        expect(level.id).toBeTruthy();
        expect(level.name).toBeTruthy();
        expect(level.description).toBeTruthy();
        expect(level.availableGates.length).toBeGreaterThan(0);
        expect(level.inputs.length).toBeGreaterThan(0);
        expect(level.outputs.length).toBeGreaterThan(0);
      }
    });

    it('unlock chain is valid (each unlocked level exists)', () => {
      const ids = new Set(levels.map((l) => l.id));
      for (const level of levels) {
        if (level.unlocks) {
          for (const unlockId of level.unlocks) {
            expect(ids.has(unlockId)).toBe(true);
          }
        }
      }
    });
  });
});
