import { describe, it, expect } from 'vitest';
import { Circuit } from '../../engine/Circuit';
import type { Gate } from '../../engine/Gate';
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

  // --- Arithmetic Section Tests (Levels 13-27) ---

  describe('13-odd-number-of-signals: 4-input XOR parity', () => {
    const level = findLevel('13-odd-number-of-signals');

    it('passes with chained XOR gates', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const inC = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'C');
      const inD = circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'D');
      const xor1 = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const xor2 = circuit.addGate(GateType.XOR, { x: 200, y: 250 });
      const xor3 = circuit.addGate(GateType.XOR, { x: 400, y: 150 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 150 }, 'OUT');

      circuit.addWire(inA.getOutput('out'), xor1.getInput('a'));
      circuit.addWire(inB.getOutput('out'), xor1.getInput('b'));
      circuit.addWire(inC.getOutput('out'), xor2.getInput('a'));
      circuit.addWire(inD.getOutput('out'), xor2.getInput('b'));
      circuit.addWire(xor1.getOutput('out'), xor3.getInput('a'));
      circuit.addWire(xor2.getOutput('out'), xor3.getInput('b'));
      circuit.addWire(xor3.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(16);
    });

    it('fails with single XOR (ignores C, D)', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'C');
      circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'D');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'OUT');

      circuit.addWire(inA.getOutput('out'), xor.getInput('a'));
      circuit.addWire(inB.getOutput('out'), xor.getInput('b'));
      circuit.addWire(xor.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('14-double-trouble: AND for X, OR for Y', () => {
    const level = findLevel('14-double-trouble');

    it('passes with AND for X and OR for Y', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const inC = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'C');
      const inD = circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'D');
      const andGate = circuit.addGate(GateType.AND, { x: 200, y: 50 });
      const orGate = circuit.addGate(GateType.OR, { x: 200, y: 250 });
      const outX = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'X');
      const outY = circuit.addGate(GateType.OUTPUT, { x: 400, y: 250 }, 'Y');

      circuit.addWire(inA.getOutput('out'), andGate.getInput('a'));
      circuit.addWire(inB.getOutput('out'), andGate.getInput('b'));
      circuit.addWire(inC.getOutput('out'), orGate.getInput('a'));
      circuit.addWire(inD.getOutput('out'), orGate.getInput('b'));
      circuit.addWire(andGate.getOutput('out'), outX.getInput('in'));
      circuit.addWire(orGate.getOutput('out'), outY.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(16);
    });

    it('fails with swapped gates (OR for X, AND for Y)', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const inC = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'C');
      const inD = circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'D');
      const orGate = circuit.addGate(GateType.OR, { x: 200, y: 50 });
      const andGate = circuit.addGate(GateType.AND, { x: 200, y: 250 });
      const outX = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'X');
      const outY = circuit.addGate(GateType.OUTPUT, { x: 400, y: 250 }, 'Y');

      circuit.addWire(inA.getOutput('out'), orGate.getInput('a'));
      circuit.addWire(inB.getOutput('out'), orGate.getInput('b'));
      circuit.addWire(inC.getOutput('out'), andGate.getInput('a'));
      circuit.addWire(inD.getOutput('out'), andGate.getInput('b'));
      circuit.addWire(orGate.getOutput('out'), outX.getInput('in'));
      circuit.addWire(andGate.getOutput('out'), outY.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('15-binary-racer: detect binary 5 (101)', () => {
    const level = findLevel('15-binary-racer');

    it('passes with B2 AND NOT(B1) AND B0', () => {
      const circuit = new Circuit();
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'B2');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B1');
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'B0');
      const notB1 = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const and1 = circuit.addGate(GateType.AND, { x: 400, y: 50 });
      const and2 = circuit.addGate(GateType.AND, { x: 600, y: 100 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 800, y: 100 }, 'OUT');

      circuit.addWire(inB1.getOutput('out'), notB1.getInput('in'));
      circuit.addWire(inB2.getOutput('out'), and1.getInput('a'));
      circuit.addWire(notB1.getOutput('out'), and1.getInput('b'));
      circuit.addWire(and1.getOutput('out'), and2.getInput('a'));
      circuit.addWire(inB0.getOutput('out'), and2.getInput('b'));
      circuit.addWire(and2.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(8);
    });

    it('fails with 3-input AND (detects 7 instead of 5)', () => {
      const circuit = new Circuit();
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'B2');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B1');
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'B0');
      const and1 = circuit.addGate(GateType.AND, { x: 200, y: 50 });
      const and2 = circuit.addGate(GateType.AND, { x: 400, y: 100 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 100 }, 'OUT');

      circuit.addWire(inB2.getOutput('out'), and1.getInput('a'));
      circuit.addWire(inB1.getOutput('out'), and1.getInput('b'));
      circuit.addWire(and1.getOutput('out'), and2.getInput('a'));
      circuit.addWire(inB0.getOutput('out'), and2.getInput('b'));
      circuit.addWire(and2.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('16-counting-signals: 2-bit count of 3 inputs', () => {
    const level = findLevel('16-counting-signals');

    it('passes with parity for S0 and majority for S1', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const inC = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'C');
      // S0 = A XOR B XOR C (parity)
      const xor1 = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const xor2 = circuit.addGate(GateType.XOR, { x: 400, y: 100 });
      // S1 = (A AND B) OR (A AND C) OR (B AND C) (majority)
      const andAB = circuit.addGate(GateType.AND, { x: 200, y: 300 });
      const andAC = circuit.addGate(GateType.AND, { x: 200, y: 400 });
      const andBC = circuit.addGate(GateType.AND, { x: 200, y: 500 });
      const or1 = circuit.addGate(GateType.OR, { x: 400, y: 350 });
      const or2 = circuit.addGate(GateType.OR, { x: 600, y: 400 });
      const outS0 = circuit.addGate(GateType.OUTPUT, { x: 600, y: 100 }, 'S0');
      const outS1 = circuit.addGate(GateType.OUTPUT, { x: 800, y: 400 }, 'S1');

      // Parity: XOR chain
      circuit.addWire(inA.getOutput('out'), xor1.getInput('a'));
      circuit.addWire(inB.getOutput('out'), xor1.getInput('b'));
      circuit.addWire(xor1.getOutput('out'), xor2.getInput('a'));
      circuit.addWire(inC.getOutput('out'), xor2.getInput('b'));
      circuit.addWire(xor2.getOutput('out'), outS0.getInput('in'));

      // Majority: (A&B) | (A&C) | (B&C)
      circuit.addWire(inA.getOutput('out'), andAB.getInput('a'));
      circuit.addWire(inB.getOutput('out'), andAB.getInput('b'));
      circuit.addWire(inA.getOutput('out'), andAC.getInput('a'));
      circuit.addWire(inC.getOutput('out'), andAC.getInput('b'));
      circuit.addWire(inB.getOutput('out'), andBC.getInput('a'));
      circuit.addWire(inC.getOutput('out'), andBC.getInput('b'));
      circuit.addWire(andAB.getOutput('out'), or1.getInput('a'));
      circuit.addWire(andAC.getOutput('out'), or1.getInput('b'));
      circuit.addWire(or1.getOutput('out'), or2.getInput('a'));
      circuit.addWire(andBC.getOutput('out'), or2.getInput('b'));
      circuit.addWire(or2.getOutput('out'), outS1.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(8);
    });

    it('fails with only parity (S1 unconnected)', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const inC = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'C');
      const xor1 = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const xor2 = circuit.addGate(GateType.XOR, { x: 400, y: 100 });
      const outS0 = circuit.addGate(GateType.OUTPUT, { x: 600, y: 100 }, 'S0');
      circuit.addGate(GateType.OUTPUT, { x: 600, y: 300 }, 'S1');

      circuit.addWire(inA.getOutput('out'), xor1.getInput('a'));
      circuit.addWire(inB.getOutput('out'), xor1.getInput('b'));
      circuit.addWire(xor1.getOutput('out'), xor2.getInput('a'));
      circuit.addWire(inC.getOutput('out'), xor2.getInput('b'));
      circuit.addWire(xor2.getOutput('out'), outS0.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('17-double-the-number: shift left by 1', () => {
    const level = findLevel('17-double-the-number');

    it('passes with correct shift-left wiring', () => {
      const circuit = new Circuit();
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'B2');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B1');
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'B0');
      const outR3 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'R3');
      const outR2 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 100 }, 'R2');
      const outR1 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 200 }, 'R1');
      circuit.addGate(GateType.OUTPUT, { x: 400, y: 300 }, 'R0'); // always false

      circuit.addWire(inB2.getOutput('out'), outR3.getInput('in'));
      circuit.addWire(inB1.getOutput('out'), outR2.getInput('in'));
      circuit.addWire(inB0.getOutput('out'), outR1.getInput('in'));
      // R0 left unconnected → defaults to false

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(8);
    });

    it('fails with direct pass-through (no shift)', () => {
      const circuit = new Circuit();
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'B2');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B1');
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'B0');
      circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'R3');
      const outR2 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 100 }, 'R2');
      const outR1 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 200 }, 'R1');
      const outR0 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 300 }, 'R0');

      circuit.addWire(inB2.getOutput('out'), outR2.getInput('in'));
      circuit.addWire(inB1.getOutput('out'), outR1.getInput('in'));
      circuit.addWire(inB0.getOutput('out'), outR0.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('18-byte-or: 8-bit bitwise OR', () => {
    const level = findLevel('18-byte-or');

    it('passes with 8 parallel OR gates', () => {
      const circuit = new Circuit();
      for (let i = 0; i < 8; i++) {
        const a = circuit.addGate(
          GateType.INPUT,
          { x: 0, y: i * 100 },
          `A${i}`,
        );
        const b = circuit.addGate(
          GateType.INPUT,
          { x: 0, y: 800 + i * 100 },
          `B${i}`,
        );
        const orGate = circuit.addGate(GateType.OR, { x: 200, y: i * 100 });
        const out = circuit.addGate(
          GateType.OUTPUT,
          { x: 400, y: i * 100 },
          `O${i}`,
        );
        circuit.addWire(a.getOutput('out'), orGate.getInput('a'));
        circuit.addWire(b.getOutput('out'), orGate.getInput('b'));
        circuit.addWire(orGate.getOutput('out'), out.getInput('in'));
      }

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(20);
    });

    it('fails with AND gates instead of OR', () => {
      const circuit = new Circuit();
      for (let i = 0; i < 8; i++) {
        const a = circuit.addGate(
          GateType.INPUT,
          { x: 0, y: i * 100 },
          `A${i}`,
        );
        const b = circuit.addGate(
          GateType.INPUT,
          { x: 0, y: 800 + i * 100 },
          `B${i}`,
        );
        const andGate = circuit.addGate(GateType.AND, { x: 200, y: i * 100 });
        const out = circuit.addGate(
          GateType.OUTPUT,
          { x: 400, y: i * 100 },
          `O${i}`,
        );
        circuit.addWire(a.getOutput('out'), andGate.getInput('a'));
        circuit.addWire(b.getOutput('out'), andGate.getInput('b'));
        circuit.addWire(andGate.getOutput('out'), out.getInput('in'));
      }

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('19-byte-not: 8-bit bitwise NOT', () => {
    const level = findLevel('19-byte-not');

    it('passes with 8 parallel NOT gates', () => {
      const circuit = new Circuit();
      for (let i = 0; i < 8; i++) {
        const inp = circuit.addGate(
          GateType.INPUT,
          { x: 0, y: i * 100 },
          `I${i}`,
        );
        const notGate = circuit.addGate(GateType.NOT, { x: 200, y: i * 100 });
        const out = circuit.addGate(
          GateType.OUTPUT,
          { x: 400, y: i * 100 },
          `O${i}`,
        );
        circuit.addWire(inp.getOutput('out'), notGate.getInput('in'));
        circuit.addWire(notGate.getOutput('out'), out.getInput('in'));
      }

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(16);
    });

    it('fails with pass-through (no inversion)', () => {
      const circuit = new Circuit();
      for (let i = 0; i < 8; i++) {
        const inp = circuit.addGate(
          GateType.INPUT,
          { x: 0, y: i * 100 },
          `I${i}`,
        );
        const out = circuit.addGate(
          GateType.OUTPUT,
          { x: 200, y: i * 100 },
          `O${i}`,
        );
        circuit.addWire(inp.getOutput('out'), out.getInput('in'));
      }

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('20-half-adder: XOR for SUM, AND for CARRY', () => {
    const level = findLevel('20-half-adder');

    it('passes with XOR and AND', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 0 });
      const and = circuit.addGate(GateType.AND, { x: 200, y: 100 });
      const outSum = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'SUM');
      const outCarry = circuit.addGate(
        GateType.OUTPUT,
        { x: 400, y: 100 },
        'CARRY',
      );

      circuit.addWire(inA.getOutput('out'), xor.getInput('a'));
      circuit.addWire(inB.getOutput('out'), xor.getInput('b'));
      circuit.addWire(inA.getOutput('out'), and.getInput('a'));
      circuit.addWire(inB.getOutput('out'), and.getInput('b'));
      circuit.addWire(xor.getOutput('out'), outSum.getInput('in'));
      circuit.addWire(and.getOutput('out'), outCarry.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(4);
    });

    it('fails with swapped outputs (AND→SUM, XOR→CARRY)', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 0 });
      const and = circuit.addGate(GateType.AND, { x: 200, y: 100 });
      const outSum = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'SUM');
      const outCarry = circuit.addGate(
        GateType.OUTPUT,
        { x: 400, y: 100 },
        'CARRY',
      );

      circuit.addWire(inA.getOutput('out'), xor.getInput('a'));
      circuit.addWire(inB.getOutput('out'), xor.getInput('b'));
      circuit.addWire(inA.getOutput('out'), and.getInput('a'));
      circuit.addWire(inB.getOutput('out'), and.getInput('b'));
      circuit.addWire(and.getOutput('out'), outSum.getInput('in'));
      circuit.addWire(xor.getOutput('out'), outCarry.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('21-full-adder: two half-adders chained', () => {
    const level = findLevel('21-full-adder');

    it('passes with correct full adder circuit', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const inCin = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'CIN');
      // Half adder 1: A + B
      const xor1 = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const and1 = circuit.addGate(GateType.AND, { x: 200, y: 150 });
      // Half adder 2: (A XOR B) + CIN
      const xor2 = circuit.addGate(GateType.XOR, { x: 400, y: 100 });
      const and2 = circuit.addGate(GateType.AND, { x: 400, y: 200 });
      // Carry out
      const or = circuit.addGate(GateType.OR, { x: 600, y: 200 });
      const outSum = circuit.addGate(
        GateType.OUTPUT,
        { x: 600, y: 100 },
        'SUM',
      );
      const outCout = circuit.addGate(
        GateType.OUTPUT,
        { x: 800, y: 200 },
        'COUT',
      );

      circuit.addWire(inA.getOutput('out'), xor1.getInput('a'));
      circuit.addWire(inB.getOutput('out'), xor1.getInput('b'));
      circuit.addWire(inA.getOutput('out'), and1.getInput('a'));
      circuit.addWire(inB.getOutput('out'), and1.getInput('b'));
      circuit.addWire(xor1.getOutput('out'), xor2.getInput('a'));
      circuit.addWire(inCin.getOutput('out'), xor2.getInput('b'));
      circuit.addWire(xor1.getOutput('out'), and2.getInput('a'));
      circuit.addWire(inCin.getOutput('out'), and2.getInput('b'));
      circuit.addWire(and1.getOutput('out'), or.getInput('a'));
      circuit.addWire(and2.getOutput('out'), or.getInput('b'));
      circuit.addWire(xor2.getOutput('out'), outSum.getInput('in'));
      circuit.addWire(or.getOutput('out'), outCout.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(8);
    });

    it('fails with half adder (ignores carry-in)', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'CIN');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 0 });
      const and = circuit.addGate(GateType.AND, { x: 200, y: 100 });
      const outSum = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'SUM');
      const outCout = circuit.addGate(
        GateType.OUTPUT,
        { x: 400, y: 100 },
        'COUT',
      );

      circuit.addWire(inA.getOutput('out'), xor.getInput('a'));
      circuit.addWire(inB.getOutput('out'), xor.getInput('b'));
      circuit.addWire(inA.getOutput('out'), and.getInput('a'));
      circuit.addWire(inB.getOutput('out'), and.getInput('b'));
      circuit.addWire(xor.getOutput('out'), outSum.getInput('in'));
      circuit.addWire(and.getOutput('out'), outCout.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('22-adding-bytes: 8-bit ripple-carry adder', () => {
    const level = findLevel('22-adding-bytes');

    it('passes with 8 chained full adders', () => {
      const circuit = new Circuit();
      const cin = circuit.addGate(GateType.INPUT, { x: 0, y: 900 }, 'CIN');
      let prevCarry: Gate = cin;

      for (let i = 0; i < 8; i++) {
        const a = circuit.addGate(
          GateType.INPUT,
          { x: 0, y: i * 100 },
          `A${i}`,
        );
        const b = circuit.addGate(
          GateType.INPUT,
          { x: 100, y: i * 100 },
          `B${i}`,
        );
        const out = circuit.addGate(
          GateType.OUTPUT,
          { x: 800, y: i * 100 },
          `S${i}`,
        );
        // Full adder: two half-adders + OR for carry
        const xor1 = circuit.addGate(GateType.XOR, { x: 200, y: i * 100 });
        const and1 = circuit.addGate(GateType.AND, { x: 300, y: i * 100 });
        const xor2 = circuit.addGate(GateType.XOR, { x: 400, y: i * 100 });
        const and2 = circuit.addGate(GateType.AND, { x: 500, y: i * 100 });
        const or = circuit.addGate(GateType.OR, { x: 600, y: i * 100 });

        circuit.addWire(a.getOutput('out'), xor1.getInput('a'));
        circuit.addWire(b.getOutput('out'), xor1.getInput('b'));
        circuit.addWire(a.getOutput('out'), and1.getInput('a'));
        circuit.addWire(b.getOutput('out'), and1.getInput('b'));
        circuit.addWire(xor1.getOutput('out'), xor2.getInput('a'));
        circuit.addWire(prevCarry.getOutput('out'), xor2.getInput('b'));
        circuit.addWire(xor1.getOutput('out'), and2.getInput('a'));
        circuit.addWire(prevCarry.getOutput('out'), and2.getInput('b'));
        circuit.addWire(and1.getOutput('out'), or.getInput('a'));
        circuit.addWire(and2.getOutput('out'), or.getInput('b'));
        circuit.addWire(xor2.getOutput('out'), out.getInput('in'));
        prevCarry = or;
      }

      const cout = circuit.addGate(GateType.OUTPUT, { x: 800, y: 900 }, 'COUT');
      circuit.addWire(prevCarry.getOutput('out'), cout.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(21);
    });

    it('fails with XOR only (no carry propagation)', () => {
      const circuit = new Circuit();
      for (let i = 0; i < 8; i++) {
        const a = circuit.addGate(
          GateType.INPUT,
          { x: 0, y: i * 100 },
          `A${i}`,
        );
        const b = circuit.addGate(
          GateType.INPUT,
          { x: 100, y: i * 100 },
          `B${i}`,
        );
        const xor = circuit.addGate(GateType.XOR, { x: 200, y: i * 100 });
        const out = circuit.addGate(
          GateType.OUTPUT,
          { x: 400, y: i * 100 },
          `S${i}`,
        );
        circuit.addWire(a.getOutput('out'), xor.getInput('a'));
        circuit.addWire(b.getOutput('out'), xor.getInput('b'));
        circuit.addWire(xor.getOutput('out'), out.getInput('in'));
      }
      circuit.addGate(GateType.INPUT, { x: 0, y: 900 }, 'CIN');
      circuit.addGate(GateType.OUTPUT, { x: 400, y: 900 }, 'COUT');

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('23-negative-numbers: sign bit detection', () => {
    const level = findLevel('23-negative-numbers');

    it('passes with B3 wired to IS_NEG', () => {
      const circuit = new Circuit();
      const inB3 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'B3');
      circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B2');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'B1');
      circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'B0');
      const out = circuit.addGate(GateType.OUTPUT, { x: 200, y: 0 }, 'IS_NEG');

      circuit.addWire(inB3.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(16);
    });

    it('fails with B0 wired to IS_NEG', () => {
      const circuit = new Circuit();
      circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'B3');
      circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B2');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'B1');
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'B0');
      const out = circuit.addGate(GateType.OUTPUT, { x: 200, y: 0 }, 'IS_NEG');

      circuit.addWire(inB0.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe("24-signed-negator: 4-bit two's complement negation", () => {
    const level = findLevel('24-signed-negator');

    it('passes with NOT + ripple carry add 1', () => {
      const circuit = new Circuit();
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'B0');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B1');
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'B2');
      const inB3 = circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'B3');
      const outN0 = circuit.addGate(GateType.OUTPUT, { x: 800, y: 0 }, 'N0');
      const outN1 = circuit.addGate(GateType.OUTPUT, { x: 800, y: 100 }, 'N1');
      const outN2 = circuit.addGate(GateType.OUTPUT, { x: 800, y: 200 }, 'N2');
      const outN3 = circuit.addGate(GateType.OUTPUT, { x: 800, y: 300 }, 'N3');

      // NOT all bits
      const notB0 = circuit.addGate(GateType.NOT, { x: 200, y: 0 });
      const notB1 = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const notB2 = circuit.addGate(GateType.NOT, { x: 200, y: 200 });
      const notB3 = circuit.addGate(GateType.NOT, { x: 200, y: 300 });
      circuit.addWire(inB0.getOutput('out'), notB0.getInput('in'));
      circuit.addWire(inB1.getOutput('out'), notB1.getInput('in'));
      circuit.addWire(inB2.getOutput('out'), notB2.getInput('in'));
      circuit.addWire(inB3.getOutput('out'), notB3.getInput('in'));

      // Bit 0: since carry_in=1, N0 = NOT(B0) XOR 1 = B0, carry0 = NOT(B0)
      circuit.addWire(inB0.getOutput('out'), outN0.getInput('in'));

      // Bit 1: half adder(NOT(B1), carry0=NOT(B0))
      const xor1 = circuit.addGate(GateType.XOR, { x: 400, y: 100 });
      const and1 = circuit.addGate(GateType.AND, { x: 400, y: 150 });
      circuit.addWire(notB1.getOutput('out'), xor1.getInput('a'));
      circuit.addWire(notB0.getOutput('out'), xor1.getInput('b'));
      circuit.addWire(notB1.getOutput('out'), and1.getInput('a'));
      circuit.addWire(notB0.getOutput('out'), and1.getInput('b'));
      circuit.addWire(xor1.getOutput('out'), outN1.getInput('in'));

      // Bit 2: half adder(NOT(B2), carry1)
      const xor2 = circuit.addGate(GateType.XOR, { x: 600, y: 200 });
      const and2 = circuit.addGate(GateType.AND, { x: 600, y: 250 });
      circuit.addWire(notB2.getOutput('out'), xor2.getInput('a'));
      circuit.addWire(and1.getOutput('out'), xor2.getInput('b'));
      circuit.addWire(notB2.getOutput('out'), and2.getInput('a'));
      circuit.addWire(and1.getOutput('out'), and2.getInput('b'));
      circuit.addWire(xor2.getOutput('out'), outN2.getInput('in'));

      // Bit 3: just XOR(NOT(B3), carry2) — no carry out needed
      const xor3 = circuit.addGate(GateType.XOR, { x: 600, y: 300 });
      circuit.addWire(notB3.getOutput('out'), xor3.getInput('a'));
      circuit.addWire(and2.getOutput('out'), xor3.getInput('b'));
      circuit.addWire(xor3.getOutput('out'), outN3.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(16);
    });

    it('fails with only NOT (no add 1)', () => {
      const circuit = new Circuit();
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'B0');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B1');
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'B2');
      const inB3 = circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'B3');
      const notB0 = circuit.addGate(GateType.NOT, { x: 200, y: 0 });
      const notB1 = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const notB2 = circuit.addGate(GateType.NOT, { x: 200, y: 200 });
      const notB3 = circuit.addGate(GateType.NOT, { x: 200, y: 300 });
      const outN0 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'N0');
      const outN1 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 100 }, 'N1');
      const outN2 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 200 }, 'N2');
      const outN3 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 300 }, 'N3');

      circuit.addWire(inB0.getOutput('out'), notB0.getInput('in'));
      circuit.addWire(inB1.getOutput('out'), notB1.getInput('in'));
      circuit.addWire(inB2.getOutput('out'), notB2.getInput('in'));
      circuit.addWire(inB3.getOutput('out'), notB3.getInput('in'));
      circuit.addWire(notB0.getOutput('out'), outN0.getInput('in'));
      circuit.addWire(notB1.getOutput('out'), outN1.getInput('in'));
      circuit.addWire(notB2.getOutput('out'), outN2.getInput('in'));
      circuit.addWire(notB3.getOutput('out'), outN3.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('25-1-bit-decoder: 1-to-2 decoder', () => {
    const level = findLevel('25-1-bit-decoder');

    it('passes with NOT for O0 and pass-through for O1', () => {
      const circuit = new Circuit();
      const inp = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'IN');
      const notGate = circuit.addGate(GateType.NOT, { x: 200, y: 0 });
      const outO0 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'O0');
      const outO1 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 100 }, 'O1');

      circuit.addWire(inp.getOutput('out'), notGate.getInput('in'));
      circuit.addWire(notGate.getOutput('out'), outO0.getInput('in'));
      circuit.addWire(inp.getOutput('out'), outO1.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(2);
    });

    it('fails with both outputs as pass-through', () => {
      const circuit = new Circuit();
      const inp = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'IN');
      const outO0 = circuit.addGate(GateType.OUTPUT, { x: 200, y: 0 }, 'O0');
      const outO1 = circuit.addGate(GateType.OUTPUT, { x: 200, y: 100 }, 'O1');

      circuit.addWire(inp.getOutput('out'), outO0.getInput('in'));
      circuit.addWire(inp.getOutput('out'), outO1.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('26-3-bit-decoder: 3-to-8 decoder', () => {
    const level = findLevel('26-3-bit-decoder');

    it('passes with AND/NOT combinations for each output', () => {
      const circuit = new Circuit();
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'B2');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B1');
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'B0');
      const notB2 = circuit.addGate(GateType.NOT, { x: 200, y: 0 });
      const notB1 = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const notB0 = circuit.addGate(GateType.NOT, { x: 200, y: 200 });
      circuit.addWire(inB2.getOutput('out'), notB2.getInput('in'));
      circuit.addWire(inB1.getOutput('out'), notB1.getInput('in'));
      circuit.addWire(inB0.getOutput('out'), notB0.getInput('in'));

      // Each output Oi activates when inputs = binary i
      const selectors: [Gate, Gate, Gate][] = [
        [notB2, notB1, notB0], // O0: 000
        [notB2, notB1, inB0], // O1: 001
        [notB2, inB1, notB0], // O2: 010
        [notB2, inB1, inB0], // O3: 011
        [inB2, notB1, notB0], // O4: 100
        [inB2, notB1, inB0], // O5: 101
        [inB2, inB1, notB0], // O6: 110
        [inB2, inB1, inB0], // O7: 111
      ];

      selectors.forEach((sel, i) => {
        const out = circuit.addGate(
          GateType.OUTPUT,
          { x: 800, y: i * 100 },
          `O${i}`,
        );
        const and1 = circuit.addGate(GateType.AND, { x: 400, y: i * 100 });
        const and2 = circuit.addGate(GateType.AND, { x: 600, y: i * 100 });
        circuit.addWire(sel[0].getOutput('out'), and1.getInput('a'));
        circuit.addWire(sel[1].getOutput('out'), and1.getInput('b'));
        circuit.addWire(and1.getOutput('out'), and2.getInput('a'));
        circuit.addWire(sel[2].getOutput('out'), and2.getInput('b'));
        circuit.addWire(and2.getOutput('out'), out.getInput('in'));
      });

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(8);
    });

    it('fails with all outputs wired to B0', () => {
      const circuit = new Circuit();
      circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'B2');
      circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B1');
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'B0');
      for (let i = 0; i < 8; i++) {
        const out = circuit.addGate(
          GateType.OUTPUT,
          { x: 200, y: i * 100 },
          `O${i}`,
        );
        circuit.addWire(inB0.getOutput('out'), out.getInput('in'));
      }

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('27-logic-engine: programmable logic unit', () => {
    const level = findLevel('27-logic-engine');

    it('passes with 4 operations and a multiplexer', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      const inOP1 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'OP1');
      const inOP0 = circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'OP0');

      // Compute all 4 operations
      const andGate = circuit.addGate(GateType.AND, { x: 200, y: 0 });
      const orGate = circuit.addGate(GateType.OR, { x: 200, y: 100 });
      const xorGate = circuit.addGate(GateType.XOR, { x: 200, y: 200 });
      const nandGate = circuit.addGate(GateType.NAND, { x: 200, y: 300 });
      circuit.addWire(inA.getOutput('out'), andGate.getInput('a'));
      circuit.addWire(inB.getOutput('out'), andGate.getInput('b'));
      circuit.addWire(inA.getOutput('out'), orGate.getInput('a'));
      circuit.addWire(inB.getOutput('out'), orGate.getInput('b'));
      circuit.addWire(inA.getOutput('out'), xorGate.getInput('a'));
      circuit.addWire(inB.getOutput('out'), xorGate.getInput('b'));
      circuit.addWire(inA.getOutput('out'), nandGate.getInput('a'));
      circuit.addWire(inB.getOutput('out'), nandGate.getInput('b'));

      // NOT for selects
      const notOP1 = circuit.addGate(GateType.NOT, { x: 200, y: 400 });
      const notOP0 = circuit.addGate(GateType.NOT, { x: 200, y: 500 });
      circuit.addWire(inOP1.getOutput('out'), notOP1.getInput('in'));
      circuit.addWire(inOP0.getOutput('out'), notOP0.getInput('in'));

      // Select lines: 00=AND, 01=OR, 10=XOR, 11=NAND
      const sel00 = circuit.addGate(GateType.AND, { x: 400, y: 0 });
      const sel01 = circuit.addGate(GateType.AND, { x: 400, y: 100 });
      const sel10 = circuit.addGate(GateType.AND, { x: 400, y: 200 });
      const sel11 = circuit.addGate(GateType.AND, { x: 400, y: 300 });
      circuit.addWire(notOP1.getOutput('out'), sel00.getInput('a'));
      circuit.addWire(notOP0.getOutput('out'), sel00.getInput('b'));
      circuit.addWire(notOP1.getOutput('out'), sel01.getInput('a'));
      circuit.addWire(inOP0.getOutput('out'), sel01.getInput('b'));
      circuit.addWire(inOP1.getOutput('out'), sel10.getInput('a'));
      circuit.addWire(notOP0.getOutput('out'), sel10.getInput('b'));
      circuit.addWire(inOP1.getOutput('out'), sel11.getInput('a'));
      circuit.addWire(inOP0.getOutput('out'), sel11.getInput('b'));

      // Mask each operation with its select
      const mask0 = circuit.addGate(GateType.AND, { x: 600, y: 0 });
      const mask1 = circuit.addGate(GateType.AND, { x: 600, y: 100 });
      const mask2 = circuit.addGate(GateType.AND, { x: 600, y: 200 });
      const mask3 = circuit.addGate(GateType.AND, { x: 600, y: 300 });
      circuit.addWire(andGate.getOutput('out'), mask0.getInput('a'));
      circuit.addWire(sel00.getOutput('out'), mask0.getInput('b'));
      circuit.addWire(orGate.getOutput('out'), mask1.getInput('a'));
      circuit.addWire(sel01.getOutput('out'), mask1.getInput('b'));
      circuit.addWire(xorGate.getOutput('out'), mask2.getInput('a'));
      circuit.addWire(sel10.getOutput('out'), mask2.getInput('b'));
      circuit.addWire(nandGate.getOutput('out'), mask3.getInput('a'));
      circuit.addWire(sel11.getOutput('out'), mask3.getInput('b'));

      // OR all masked results
      const or1 = circuit.addGate(GateType.OR, { x: 800, y: 50 });
      const or2 = circuit.addGate(GateType.OR, { x: 800, y: 250 });
      const or3 = circuit.addGate(GateType.OR, { x: 1000, y: 150 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 1200, y: 150 }, 'OUT');
      circuit.addWire(mask0.getOutput('out'), or1.getInput('a'));
      circuit.addWire(mask1.getOutput('out'), or1.getInput('b'));
      circuit.addWire(mask2.getOutput('out'), or2.getInput('a'));
      circuit.addWire(mask3.getOutput('out'), or2.getInput('b'));
      circuit.addWire(or1.getOutput('out'), or3.getInput('a'));
      circuit.addWire(or2.getOutput('out'), or3.getInput('b'));
      circuit.addWire(or3.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(16);
    });

    it('fails with just AND (ignores operation select)', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'B');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'OP1');
      circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'OP0');
      const andGate = circuit.addGate(GateType.AND, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'OUT');

      circuit.addWire(inA.getOutput('out'), andGate.getInput('a'));
      circuit.addWire(inB.getOutput('out'), andGate.getInput('b'));
      circuit.addWire(andGate.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('level definitions', () => {
    it('all levels have valid truth tables or test sequences', () => {
      for (const level of levels) {
        const hasTruthTable = level.truthTable && level.truthTable.length > 0;
        const hasTestSequence = (level as any).testSequence && (level as any).testSequence.length > 0;
        const hasProgramTestCases = level.programTestCases && level.programTestCases.length > 0;
        expect(hasTruthTable || hasTestSequence || hasProgramTestCases).toBe(true);
        if (hasTruthTable) {
          for (const entry of level.truthTable) {
            for (const input of level.inputs) {
              expect(entry.inputs).toHaveProperty(input.name);
            }
            for (const output of level.outputs) {
              expect(entry.outputs).toHaveProperty(output.name);
            }
          }
        }
      }
    });

    it('all levels have required fields', () => {
      for (const level of levels) {
        expect(level.id).toBeTruthy();
        expect(level.name).toBeTruthy();
        expect(level.description).toBeTruthy();
        if (level.type !== 'programming') {
          expect(level.inputs.length).toBeGreaterThan(0);
          expect(level.outputs.length).toBeGreaterThan(0);
        }
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

    it('contains exactly 27 levels', () => {
      expect(levels).toHaveLength(82);
    });
  });
});
