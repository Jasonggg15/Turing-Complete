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

  describe('01-crude-awakening: wire input to output', () => {
    const level = findLevel('01-crude-awakening');

    it('passes when input is wired directly to output', () => {
      const circuit = new Circuit();
      const inp = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'IN');
      const out = circuit.addGate(GateType.OUTPUT, { x: 200, y: 0 }, 'OUT');

      circuit.addWire(inp.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(2);
    });

    it('fails with no wires', () => {
      const circuit = new Circuit();
      circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'IN');
      circuit.addGate(GateType.OUTPUT, { x: 200, y: 0 }, 'OUT');

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('02-nand-gate: NAND gate', () => {
    const level = findLevel('02-nand-gate');

    it('passes with a NAND gate wired correctly', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const nand = circuit.addGate(GateType.NAND, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), nand.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), nand.getInput('b'));
      circuit.addWire(nand.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(4);
    });
  });

  describe('03-not-gate: NOT gate from NAND', () => {
    const level = findLevel('03-not-gate');

    it('passes with NAND with both inputs tied', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const nand = circuit.addGate(GateType.NAND, { x: 200, y: 0 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'OUT');

      // NOT(A) = NAND(A, A)
      circuit.addWire(inputA.getOutput('out'), nand.getInput('a'));
      circuit.addWire(inputA.getOutput('out'), nand.getInput('b'));
      circuit.addWire(nand.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(2);
    });

    it('fails with direct pass-through', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
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

  describe('04-nor-gate: NOR gate', () => {
    const level = findLevel('04-nor-gate');

    it('passes with correct NOR circuit (NOT A, NOT B, NAND)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      // OR(A,B) = NAND(NOT A, NOT B)
      const notA = circuit.addGate(GateType.NOT, { x: 200, y: 0 });
      const notB = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const nand = circuit.addGate(GateType.NAND, { x: 400, y: 50 });
      // NOR = NOT(OR)
      const notOut = circuit.addGate(GateType.NOT, { x: 600, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 800, y: 50 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), notA.getInput('in'));
      circuit.addWire(inputB.getOutput('out'), notB.getInput('in'));
      circuit.addWire(notA.getOutput('out'), nand.getInput('a'));
      circuit.addWire(notB.getOutput('out'), nand.getInput('b'));
      circuit.addWire(nand.getOutput('out'), notOut.getInput('in'));
      circuit.addWire(notOut.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(4);
    });

    it('fails when building OR instead of NOR', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      // OR(A,B) without final NOT
      const notA = circuit.addGate(GateType.NOT, { x: 200, y: 0 });
      const notB = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const nand = circuit.addGate(GateType.NAND, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), notA.getInput('in'));
      circuit.addWire(inputB.getOutput('out'), notB.getInput('in'));
      circuit.addWire(notA.getOutput('out'), nand.getInput('a'));
      circuit.addWire(notB.getOutput('out'), nand.getInput('b'));
      circuit.addWire(nand.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('05-or-gate: OR gate from NAND', () => {
    const level = findLevel('05-or-gate');

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

  describe('06-and-gate: AND gate from NAND', () => {
    const level = findLevel('06-and-gate');

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
      // NOT(NAND) = NAND(nand1, nand1)
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

  describe('07-always-on: constant true output', () => {
    const level = findLevel('07-always-on');

    it('passes with A OR NOT A', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const not = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const or = circuit.addGate(GateType.OR, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'OUT');

      // A OR NOT(A) = always true
      circuit.addWire(inputA.getOutput('out'), not.getInput('in'));
      circuit.addWire(inputA.getOutput('out'), or.getInput('a'));
      circuit.addWire(not.getOutput('out'), or.getInput('b'));
      circuit.addWire(or.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(2);
    });

    it('fails with direct pass-through (off when input is off)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const out = circuit.addGate(GateType.OUTPUT, { x: 200, y: 0 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('08-second-tick: INHIBIT gate (A AND NOT B)', () => {
    const level = findLevel('08-second-tick');

    it('passes with correct INHIBIT circuit (AND + NOT)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const not = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const and = circuit.addGate(GateType.AND, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'OUT');

      // A AND NOT(B)
      circuit.addWire(inputB.getOutput('out'), not.getInput('in'));
      circuit.addWire(inputA.getOutput('out'), and.getInput('a'));
      circuit.addWire(not.getOutput('out'), and.getInput('b'));
      circuit.addWire(and.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(4);
    });

    it('fails with plain AND (not inhibit)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const and = circuit.addGate(GateType.AND, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), and.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), and.getInput('b'));
      circuit.addWire(and.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('09-xor-gate: XOR gate from NAND', () => {
    const level = findLevel('09-xor-gate');

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

  describe('10-bigger-or-gate: 3-input OR', () => {
    const level = findLevel('10-bigger-or-gate');

    it('passes with two chained OR gates', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const inputC = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'C');
      // OR(A, B)
      const or1 = circuit.addGate(GateType.OR, { x: 200, y: 50 });
      // OR(or1, C)
      const or2 = circuit.addGate(GateType.OR, { x: 400, y: 100 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 100 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), or1.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), or1.getInput('b'));
      circuit.addWire(or1.getOutput('out'), or2.getInput('a'));
      circuit.addWire(inputC.getOutput('out'), or2.getInput('b'));
      circuit.addWire(or2.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(8);
    });

    it('fails with only one OR gate (ignores C)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'C');
      const or1 = circuit.addGate(GateType.OR, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), or1.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), or1.getInput('b'));
      circuit.addWire(or1.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('11-bigger-and-gate: 3-input AND', () => {
    const level = findLevel('11-bigger-and-gate');

    it('passes with two chained AND gates', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const inputC = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'C');
      // AND(A, B)
      const and1 = circuit.addGate(GateType.AND, { x: 200, y: 50 });
      // AND(and1, C)
      const and2 = circuit.addGate(GateType.AND, { x: 400, y: 100 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 100 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), and1.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), and1.getInput('b'));
      circuit.addWire(and1.getOutput('out'), and2.getInput('a'));
      circuit.addWire(inputC.getOutput('out'), and2.getInput('b'));
      circuit.addWire(and2.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(8);
    });

    it('fails with only one AND gate (ignores C)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'C');
      const and1 = circuit.addGate(GateType.AND, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), and1.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), and1.getInput('b'));
      circuit.addWire(and1.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('12-xnor-gate: XNOR gate', () => {
    const level = findLevel('12-xnor-gate');

    it('passes with XOR + NOT', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const not = circuit.addGate(GateType.NOT, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'OUT');

      // XNOR = NOT(XOR(A, B))
      circuit.addWire(inputA.getOutput('out'), xor.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), xor.getInput('b'));
      circuit.addWire(xor.getOutput('out'), not.getInput('in'));
      circuit.addWire(not.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(4);
    });

    it('fails with plain XOR (inverted result)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'OUT');

      circuit.addWire(inputA.getOutput('out'), xor.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), xor.getInput('b'));
      circuit.addWire(xor.getOutput('out'), out.getInput('in'));

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

    it('contains exactly 12 levels', () => {
      expect(levels).toHaveLength(12);
    });
  });
});
