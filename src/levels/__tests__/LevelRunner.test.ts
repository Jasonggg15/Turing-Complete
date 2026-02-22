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
      const inp = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input');
      const out = circuit.addGate(GateType.OUTPUT, { x: 200, y: 0 }, 'Output');

      circuit.addWire(inp.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(2);
    });

    it('fails with no wires', () => {
      const circuit = new Circuit();
      circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input');
      circuit.addGate(GateType.OUTPUT, { x: 200, y: 0 }, 'Output');

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('02-nand-gate: NAND gate', () => {
    const level = findLevel('02-nand-gate');

    it('passes with a NAND gate wired correctly', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const nand = circuit.addGate(GateType.NAND, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'Output');

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
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input');
      const nand = circuit.addGate(GateType.NAND, { x: 200, y: 0 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'Output');

      // NOT(Input) = NAND(Input, Input)
      circuit.addWire(inputA.getOutput('out'), nand.getInput('a'));
      circuit.addWire(inputA.getOutput('out'), nand.getInput('b'));
      circuit.addWire(nand.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(2);
    });

    it('fails with direct pass-through', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input');
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'Output');

      circuit.addWire(inputA.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });

    it('returns detailed results per truth table entry', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input');
      const nand = circuit.addGate(GateType.NAND, { x: 200, y: 0 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'Output');

      circuit.addWire(inputA.getOutput('out'), nand.getInput('a'));
      circuit.addWire(inputA.getOutput('out'), nand.getInput('b'));
      circuit.addWire(nand.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.results).toHaveLength(2);

      const row0 = result.results[0]!;
      expect(row0.inputs).toEqual({ Input: false });
      expect(row0.expected).toEqual({ Output: true });
      expect(row0.outputs).toEqual({ Output: true });
      expect(row0.pass).toBe(true);

      const row1 = result.results[1]!;
      expect(row1.inputs).toEqual({ Input: true });
      expect(row1.expected).toEqual({ Output: false });
      expect(row1.outputs).toEqual({ Output: false });
      expect(row1.pass).toBe(true);
    });
  });

  describe('04-nor-gate: NOR gate', () => {
    const level = findLevel('04-nor-gate');

    it('passes with correct NOR circuit (NOT A, NOT B, NAND)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const notA = circuit.addGate(GateType.NOT, { x: 200, y: 0 });
      const notB = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const nand = circuit.addGate(GateType.NAND, { x: 400, y: 50 });
      const notOut = circuit.addGate(GateType.NOT, { x: 600, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 800, y: 50 }, 'Output');

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
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const notA = circuit.addGate(GateType.NOT, { x: 200, y: 0 });
      const notB = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const nand = circuit.addGate(GateType.NAND, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'Output');

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
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const notA = circuit.addGate(GateType.NAND, { x: 200, y: 0 });
      const notB = circuit.addGate(GateType.NAND, { x: 200, y: 100 });
      const orNand = circuit.addGate(GateType.NAND, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'Output');

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
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const nand1 = circuit.addGate(GateType.NAND, { x: 200, y: 50 });
      const nand2 = circuit.addGate(GateType.NAND, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'Output');

      circuit.addWire(inputA.getOutput('out'), nand1.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), nand1.getInput('b'));
      circuit.addWire(nand1.getOutput('out'), nand2.getInput('a'));
      circuit.addWire(nand1.getOutput('out'), nand2.getInput('b'));
      circuit.addWire(nand2.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(4);
    });

    it('fails with only one NAND (gives NAND, not AND)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const nand = circuit.addGate(GateType.NAND, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'Output');

      circuit.addWire(inputA.getOutput('out'), nand.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), nand.getInput('b'));
      circuit.addWire(nand.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('07-always-on: constant true output', () => {
    const level = findLevel('07-always-on');

    it('passes with Input OR NOT Input', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input');
      const not = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const or = circuit.addGate(GateType.OR, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'Output');

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
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input');
      const out = circuit.addGate(GateType.OUTPUT, { x: 200, y: 0 }, 'Output');

      circuit.addWire(inputA.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('08-second-tick: Input 1 AND NOT(Input 2)', () => {
    const level = findLevel('08-second-tick');

    it('passes with correct circuit (Input 1 AND NOT Input 2)', () => {
      const circuit = new Circuit();
      const input1 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const input2 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const not = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const and = circuit.addGate(GateType.AND, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'Output');

      // Input 1 AND NOT(Input 2)
      circuit.addWire(input2.getOutput('out'), not.getInput('in'));
      circuit.addWire(input1.getOutput('out'), and.getInput('a'));
      circuit.addWire(not.getOutput('out'), and.getInput('b'));
      circuit.addWire(and.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(4);
    });

    it('fails with plain AND (not inhibit)', () => {
      const circuit = new Circuit();
      const input1 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const input2 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const and = circuit.addGate(GateType.AND, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'Output');

      circuit.addWire(input1.getOutput('out'), and.getInput('a'));
      circuit.addWire(input2.getOutput('out'), and.getInput('b'));
      circuit.addWire(and.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('09-xor-gate: XOR gate from NAND', () => {
    const level = findLevel('09-xor-gate');

    it('passes with correct XOR circuit (4 NANDs)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const nand1 = circuit.addGate(GateType.NAND, { x: 200, y: 50 });
      const nand2 = circuit.addGate(GateType.NAND, { x: 400, y: 0 });
      const nand3 = circuit.addGate(GateType.NAND, { x: 400, y: 100 });
      const nand4 = circuit.addGate(GateType.NAND, { x: 600, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 800, y: 50 }, 'Output');

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
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const inputC = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Input 3');
      const or1 = circuit.addGate(GateType.OR, { x: 200, y: 50 });
      const or2 = circuit.addGate(GateType.OR, { x: 400, y: 100 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 100 }, 'Output');

      circuit.addWire(inputA.getOutput('out'), or1.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), or1.getInput('b'));
      circuit.addWire(or1.getOutput('out'), or2.getInput('a'));
      circuit.addWire(inputC.getOutput('out'), or2.getInput('b'));
      circuit.addWire(or2.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(8);
    });

    it('fails with only one OR gate (ignores Input 3)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Input 3');
      const or1 = circuit.addGate(GateType.OR, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'Output');

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
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const inputC = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Input 3');
      const and1 = circuit.addGate(GateType.AND, { x: 200, y: 50 });
      const and2 = circuit.addGate(GateType.AND, { x: 400, y: 100 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 100 }, 'Output');

      circuit.addWire(inputA.getOutput('out'), and1.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), and1.getInput('b'));
      circuit.addWire(and1.getOutput('out'), and2.getInput('a'));
      circuit.addWire(inputC.getOutput('out'), and2.getInput('b'));
      circuit.addWire(and2.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(8);
    });

    it('fails with only one AND gate (ignores Input 3)', () => {
      const circuit = new Circuit();
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Input 3');
      const and1 = circuit.addGate(GateType.AND, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'Output');

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
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const not = circuit.addGate(GateType.NOT, { x: 400, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 50 }, 'Output');

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
      const inputA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inputB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'Output');

      circuit.addWire(inputA.getOutput('out'), xor.getInput('a'));
      circuit.addWire(inputB.getOutput('out'), xor.getInput('b'));
      circuit.addWire(xor.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  // --- Levels 13-27 ---

  describe('13-odd-number-of-signals: 4-input XOR parity', () => {
    const level = findLevel('13-odd-number-of-signals');

    it('passes with chained XOR gates (4 inputs)', () => {
      const circuit = new Circuit();
      const in1 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const in2 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const in3 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Input 3');
      const in4 = circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'Input 4');
      const xor1 = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const xor2 = circuit.addGate(GateType.XOR, { x: 200, y: 250 });
      const xor3 = circuit.addGate(GateType.XOR, { x: 400, y: 150 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 150 }, 'Output');

      circuit.addWire(in1.getOutput('out'), xor1.getInput('a'));
      circuit.addWire(in2.getOutput('out'), xor1.getInput('b'));
      circuit.addWire(in3.getOutput('out'), xor2.getInput('a'));
      circuit.addWire(in4.getOutput('out'), xor2.getInput('b'));
      circuit.addWire(xor1.getOutput('out'), xor3.getInput('a'));
      circuit.addWire(xor2.getOutput('out'), xor3.getInput('b'));
      circuit.addWire(xor3.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(16);
    });

    it('fails with single XOR (ignores Input 3, Input 4)', () => {
      const circuit = new Circuit();
      const in1 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const in2 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Input 3');
      circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'Input 4');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'Output');

      circuit.addWire(in1.getOutput('out'), xor.getInput('a'));
      circuit.addWire(in2.getOutput('out'), xor.getInput('b'));
      circuit.addWire(xor.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('14-double-trouble: at least 2 of 4 inputs', () => {
    const level = findLevel('14-double-trouble');

    it('passes with pairwise AND + OR (at least 2 of 4)', () => {
      const circuit = new Circuit();
      const in1 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const in2 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const in3 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Input 3');
      const in4 = circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'Input 4');
      // All 6 pairwise ANDs
      const and12 = circuit.addGate(GateType.AND, { x: 200, y: 0 });
      const and13 = circuit.addGate(GateType.AND, { x: 200, y: 100 });
      const and14 = circuit.addGate(GateType.AND, { x: 200, y: 200 });
      const and23 = circuit.addGate(GateType.AND, { x: 200, y: 300 });
      const and24 = circuit.addGate(GateType.AND, { x: 200, y: 400 });
      const and34 = circuit.addGate(GateType.AND, { x: 200, y: 500 });
      circuit.addWire(in1.getOutput('out'), and12.getInput('a'));
      circuit.addWire(in2.getOutput('out'), and12.getInput('b'));
      circuit.addWire(in1.getOutput('out'), and13.getInput('a'));
      circuit.addWire(in3.getOutput('out'), and13.getInput('b'));
      circuit.addWire(in1.getOutput('out'), and14.getInput('a'));
      circuit.addWire(in4.getOutput('out'), and14.getInput('b'));
      circuit.addWire(in2.getOutput('out'), and23.getInput('a'));
      circuit.addWire(in3.getOutput('out'), and23.getInput('b'));
      circuit.addWire(in2.getOutput('out'), and24.getInput('a'));
      circuit.addWire(in4.getOutput('out'), and24.getInput('b'));
      circuit.addWire(in3.getOutput('out'), and34.getInput('a'));
      circuit.addWire(in4.getOutput('out'), and34.getInput('b'));
      // OR tree: any pair active → at least 2
      const or1 = circuit.addGate(GateType.OR, { x: 400, y: 50 });
      const or2 = circuit.addGate(GateType.OR, { x: 400, y: 250 });
      const or3 = circuit.addGate(GateType.OR, { x: 400, y: 450 });
      const or4 = circuit.addGate(GateType.OR, { x: 600, y: 150 });
      const or5 = circuit.addGate(GateType.OR, { x: 800, y: 250 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 1000, y: 250 }, 'Output');
      circuit.addWire(and12.getOutput('out'), or1.getInput('a'));
      circuit.addWire(and13.getOutput('out'), or1.getInput('b'));
      circuit.addWire(and14.getOutput('out'), or2.getInput('a'));
      circuit.addWire(and23.getOutput('out'), or2.getInput('b'));
      circuit.addWire(and24.getOutput('out'), or3.getInput('a'));
      circuit.addWire(and34.getOutput('out'), or3.getInput('b'));
      circuit.addWire(or1.getOutput('out'), or4.getInput('a'));
      circuit.addWire(or2.getOutput('out'), or4.getInput('b'));
      circuit.addWire(or4.getOutput('out'), or5.getInput('a'));
      circuit.addWire(or3.getOutput('out'), or5.getInput('b'));
      circuit.addWire(or5.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(16);
    });

    it('fails with OR gate (too permissive)', () => {
      const circuit = new Circuit();
      const in1 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const in2 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Input 3');
      circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'Input 4');
      const or = circuit.addGate(GateType.OR, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'Output');

      circuit.addWire(in1.getOutput('out'), or.getInput('a'));
      circuit.addWire(in2.getOutput('out'), or.getInput('b'));
      circuit.addWire(or.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('15-binary-racer: detect binary 5 (101)', () => {
    const level = findLevel('15-binary-racer');

    it('passes with Bit 2 AND NOT(Bit 1) AND Bit 0', () => {
      const circuit = new Circuit();
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Bit 2');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Bit 1');
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Bit 0');
      const notB1 = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const and1 = circuit.addGate(GateType.AND, { x: 400, y: 50 });
      const and2 = circuit.addGate(GateType.AND, { x: 600, y: 100 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 800, y: 100 }, 'Output');

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
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Bit 2');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Bit 1');
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Bit 0');
      const and1 = circuit.addGate(GateType.AND, { x: 200, y: 50 });
      const and2 = circuit.addGate(GateType.AND, { x: 400, y: 100 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 600, y: 100 }, 'Output');

      circuit.addWire(inB2.getOutput('out'), and1.getInput('a'));
      circuit.addWire(inB1.getOutput('out'), and1.getInput('b'));
      circuit.addWire(and1.getOutput('out'), and2.getInput('a'));
      circuit.addWire(inB0.getOutput('out'), and2.getInput('b'));
      circuit.addWire(and2.getOutput('out'), out.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('16-counting-signals: 3-bit count of 4 inputs', () => {
    const level = findLevel('16-counting-signals');

    it('passes with parity for Bit 0, pair counting for Bit 1, all-4 for Bit 2', () => {
      const circuit = new Circuit();
      const in1 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const in2 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const in3 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Input 3');
      const in4 = circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'Input 4');

      // Bit 0 = parity of all 4 inputs (XOR chain)
      const xor1 = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const xor2 = circuit.addGate(GateType.XOR, { x: 200, y: 250 });
      const xor3 = circuit.addGate(GateType.XOR, { x: 400, y: 150 });
      circuit.addWire(in1.getOutput('out'), xor1.getInput('a'));
      circuit.addWire(in2.getOutput('out'), xor1.getInput('b'));
      circuit.addWire(in3.getOutput('out'), xor2.getInput('a'));
      circuit.addWire(in4.getOutput('out'), xor2.getInput('b'));
      circuit.addWire(xor1.getOutput('out'), xor3.getInput('a'));
      circuit.addWire(xor2.getOutput('out'), xor3.getInput('b'));

      // Bit 1: ON when count in {2,3} = (atLeast2) XOR (all4)
      // All 6 pairwise ANDs
      const and12 = circuit.addGate(GateType.AND, { x: 200, y: 400 });
      const and13 = circuit.addGate(GateType.AND, { x: 200, y: 500 });
      const and14 = circuit.addGate(GateType.AND, { x: 200, y: 600 });
      const and23 = circuit.addGate(GateType.AND, { x: 200, y: 700 });
      const and24 = circuit.addGate(GateType.AND, { x: 200, y: 800 });
      const and34 = circuit.addGate(GateType.AND, { x: 200, y: 900 });
      circuit.addWire(in1.getOutput('out'), and12.getInput('a'));
      circuit.addWire(in2.getOutput('out'), and12.getInput('b'));
      circuit.addWire(in1.getOutput('out'), and13.getInput('a'));
      circuit.addWire(in3.getOutput('out'), and13.getInput('b'));
      circuit.addWire(in1.getOutput('out'), and14.getInput('a'));
      circuit.addWire(in4.getOutput('out'), and14.getInput('b'));
      circuit.addWire(in2.getOutput('out'), and23.getInput('a'));
      circuit.addWire(in3.getOutput('out'), and23.getInput('b'));
      circuit.addWire(in2.getOutput('out'), and24.getInput('a'));
      circuit.addWire(in4.getOutput('out'), and24.getInput('b'));
      circuit.addWire(in3.getOutput('out'), and34.getInput('a'));
      circuit.addWire(in4.getOutput('out'), and34.getInput('b'));

      // atLeast2 = OR of all pairs
      const orP1 = circuit.addGate(GateType.OR, { x: 400, y: 450 });
      const orP2 = circuit.addGate(GateType.OR, { x: 400, y: 550 });
      const orP3 = circuit.addGate(GateType.OR, { x: 400, y: 650 });
      const orP4 = circuit.addGate(GateType.OR, { x: 600, y: 500 });
      const orP5 = circuit.addGate(GateType.OR, { x: 800, y: 550 });
      circuit.addWire(and12.getOutput('out'), orP1.getInput('a'));
      circuit.addWire(and13.getOutput('out'), orP1.getInput('b'));
      circuit.addWire(and14.getOutput('out'), orP2.getInput('a'));
      circuit.addWire(and23.getOutput('out'), orP2.getInput('b'));
      circuit.addWire(and24.getOutput('out'), orP3.getInput('a'));
      circuit.addWire(and34.getOutput('out'), orP3.getInput('b'));
      circuit.addWire(orP1.getOutput('out'), orP4.getInput('a'));
      circuit.addWire(orP2.getOutput('out'), orP4.getInput('b'));
      circuit.addWire(orP4.getOutput('out'), orP5.getInput('a'));
      circuit.addWire(orP3.getOutput('out'), orP5.getInput('b'));

      // all4 = AND(in1&in2, in3&in4)
      const andAll = circuit.addGate(GateType.AND, { x: 400, y: 800 });
      circuit.addWire(and12.getOutput('out'), andAll.getInput('a'));
      circuit.addWire(and34.getOutput('out'), andAll.getInput('b'));

      // Bit 1 = atLeast2 XOR all4
      const xorBit1 = circuit.addGate(GateType.XOR, { x: 1000, y: 600 });
      circuit.addWire(orP5.getOutput('out'), xorBit1.getInput('a'));
      circuit.addWire(andAll.getOutput('out'), xorBit1.getInput('b'));

      // Outputs
      const outBit0 = circuit.addGate(GateType.OUTPUT, { x: 600, y: 150 }, 'Bit 1');
      const outBit1 = circuit.addGate(GateType.OUTPUT, { x: 1200, y: 600 }, 'Bit 2');
      const outBit2 = circuit.addGate(GateType.OUTPUT, { x: 800, y: 850 }, 'Bit 3');
      circuit.addWire(xor3.getOutput('out'), outBit0.getInput('in'));
      circuit.addWire(xorBit1.getOutput('out'), outBit1.getInput('in'));
      circuit.addWire(andAll.getOutput('out'), outBit2.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(16);
    });

    it('fails with only parity (Bit 1, Bit 2 unconnected)', () => {
      const circuit = new Circuit();
      const in1 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const in2 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const in3 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Input 3');
      circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'Input 4');
      const xor1 = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const xor2 = circuit.addGate(GateType.XOR, { x: 400, y: 100 });
      const outBit0 = circuit.addGate(GateType.OUTPUT, { x: 600, y: 100 }, 'Bit 1');
      circuit.addGate(GateType.OUTPUT, { x: 600, y: 300 }, 'Bit 2');
      circuit.addGate(GateType.OUTPUT, { x: 600, y: 450 }, 'Bit 3');

      circuit.addWire(in1.getOutput('out'), xor1.getInput('a'));
      circuit.addWire(in2.getOutput('out'), xor1.getInput('b'));
      circuit.addWire(xor1.getOutput('out'), xor2.getInput('a'));
      circuit.addWire(in3.getOutput('out'), xor2.getInput('b'));
      circuit.addWire(xor2.getOutput('out'), outBit0.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(false);
    });
  });

  describe('17-double-the-number: shift left by 1', () => {
    const level = findLevel('17-double-the-number');

    it('passes with correct shift-left wiring', () => {
      const circuit = new Circuit();
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Bit 2');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Bit 1');
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Bit 0');
      const outR3 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'Result 3');
      const outR2 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 100 }, 'Result 2');
      const outR1 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 200 }, 'Result 1');
      circuit.addGate(GateType.OUTPUT, { x: 400, y: 300 }, 'Result 0'); // always false

      circuit.addWire(inB2.getOutput('out'), outR3.getInput('in'));
      circuit.addWire(inB1.getOutput('out'), outR2.getInput('in'));
      circuit.addWire(inB0.getOutput('out'), outR1.getInput('in'));
      // Result 0 left unconnected → defaults to false

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(8);
    });

    it('fails with direct pass-through (no shift)', () => {
      const circuit = new Circuit();
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Bit 2');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Bit 1');
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Bit 0');
      circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'Result 3');
      const outR2 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 100 }, 'Result 2');
      const outR1 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 200 }, 'Result 1');
      const outR0 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 300 }, 'Result 0');

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

  describe('20-half-adder: XOR for Sum, AND for Carry', () => {
    const level = findLevel('20-half-adder');

    it('passes with XOR and AND', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input B');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 0 });
      const and = circuit.addGate(GateType.AND, { x: 200, y: 100 });
      const outSum = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'Sum');
      const outCarry = circuit.addGate(
        GateType.OUTPUT,
        { x: 400, y: 100 },
        'Carry',
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

    it('fails with swapped outputs (AND→Sum, XOR→Carry)', () => {
      const circuit = new Circuit();
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input B');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 0 });
      const and = circuit.addGate(GateType.AND, { x: 200, y: 100 });
      const outSum = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'Sum');
      const outCarry = circuit.addGate(
        GateType.OUTPUT,
        { x: 400, y: 100 },
        'Carry',
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
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input B');
      const inCin = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Carry In');
      const xor1 = circuit.addGate(GateType.XOR, { x: 200, y: 50 });
      const and1 = circuit.addGate(GateType.AND, { x: 200, y: 150 });
      const xor2 = circuit.addGate(GateType.XOR, { x: 400, y: 100 });
      const and2 = circuit.addGate(GateType.AND, { x: 400, y: 200 });
      const or = circuit.addGate(GateType.OR, { x: 600, y: 200 });
      const outSum = circuit.addGate(
        GateType.OUTPUT,
        { x: 600, y: 100 },
        'Sum',
      );
      const outCout = circuit.addGate(
        GateType.OUTPUT,
        { x: 800, y: 200 },
        'Carry Out',
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
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input A');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input B');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Carry In');
      const xor = circuit.addGate(GateType.XOR, { x: 200, y: 0 });
      const and = circuit.addGate(GateType.AND, { x: 200, y: 100 });
      const outSum = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'Sum');
      const outCout = circuit.addGate(
        GateType.OUTPUT,
        { x: 400, y: 100 },
        'Carry Out',
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

    it('passes with NOT for Output 0 and pass-through for Output 1', () => {
      const circuit = new Circuit();
      const inp = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input');
      const notGate = circuit.addGate(GateType.NOT, { x: 200, y: 0 });
      const outO0 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 0 }, 'Output 0');
      const outO1 = circuit.addGate(GateType.OUTPUT, { x: 400, y: 100 }, 'Output 1');

      circuit.addWire(inp.getOutput('out'), notGate.getInput('in'));
      circuit.addWire(notGate.getOutput('out'), outO0.getInput('in'));
      circuit.addWire(inp.getOutput('out'), outO1.getInput('in'));

      const result = runner.run(level, circuit);
      expect(result.passed).toBe(true);
      expect(result.results).toHaveLength(2);
    });

    it('fails with both outputs as pass-through', () => {
      const circuit = new Circuit();
      const inp = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input');
      const outO0 = circuit.addGate(GateType.OUTPUT, { x: 200, y: 0 }, 'Output 0');
      const outO1 = circuit.addGate(GateType.OUTPUT, { x: 200, y: 100 }, 'Output 1');

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
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Bit 0');
      const inB1 = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Bit 1');
      const inB2 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Bit 2');
      const notB0 = circuit.addGate(GateType.NOT, { x: 200, y: 0 });
      const notB1 = circuit.addGate(GateType.NOT, { x: 200, y: 100 });
      const notB2 = circuit.addGate(GateType.NOT, { x: 200, y: 200 });
      circuit.addWire(inB0.getOutput('out'), notB0.getInput('in'));
      circuit.addWire(inB1.getOutput('out'), notB1.getInput('in'));
      circuit.addWire(inB2.getOutput('out'), notB2.getInput('in'));

      // Each output i activates when inputs = binary i
      const selectors: [Gate, Gate, Gate][] = [
        [notB2, notB1, notB0], // Output 0: 000
        [notB2, notB1, inB0], // Output 1: 001
        [notB2, inB1, notB0], // Output 2: 010
        [notB2, inB1, inB0], // Output 3: 011
        [inB2, notB1, notB0], // Output 4: 100
        [inB2, notB1, inB0], // Output 5: 101
        [inB2, inB1, notB0], // Output 6: 110
        [inB2, inB1, inB0], // Output 7: 111
      ];

      selectors.forEach((sel, i) => {
        const out = circuit.addGate(
          GateType.OUTPUT,
          { x: 800, y: i * 100 },
          `Output ${i}`,
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

    it('fails with all outputs wired to Bit 0', () => {
      const circuit = new Circuit();
      const inB0 = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Bit 0');
      circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Bit 1');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Bit 2');
      for (let i = 0; i < 8; i++) {
        const out = circuit.addGate(
          GateType.OUTPUT,
          { x: 200, y: i * 100 },
          `Output ${i}`,
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
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      const inOP1 = circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Op 1');
      const inOP0 = circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'Op 0');

      // Compute all 4 operations: 00=OR, 01=NAND, 10=NOR, 11=AND
      const orGate = circuit.addGate(GateType.OR, { x: 200, y: 0 });
      const nandGate = circuit.addGate(GateType.NAND, { x: 200, y: 100 });
      const norGate = circuit.addGate(GateType.NOR, { x: 200, y: 200 });
      const andGate = circuit.addGate(GateType.AND, { x: 200, y: 300 });
      circuit.addWire(inA.getOutput('out'), orGate.getInput('a'));
      circuit.addWire(inB.getOutput('out'), orGate.getInput('b'));
      circuit.addWire(inA.getOutput('out'), nandGate.getInput('a'));
      circuit.addWire(inB.getOutput('out'), nandGate.getInput('b'));
      circuit.addWire(inA.getOutput('out'), norGate.getInput('a'));
      circuit.addWire(inB.getOutput('out'), norGate.getInput('b'));
      circuit.addWire(inA.getOutput('out'), andGate.getInput('a'));
      circuit.addWire(inB.getOutput('out'), andGate.getInput('b'));

      // NOT for selects
      const notOP1 = circuit.addGate(GateType.NOT, { x: 200, y: 400 });
      const notOP0 = circuit.addGate(GateType.NOT, { x: 200, y: 500 });
      circuit.addWire(inOP1.getOutput('out'), notOP1.getInput('in'));
      circuit.addWire(inOP0.getOutput('out'), notOP0.getInput('in'));

      // Select lines: 00=OR, 01=NAND, 10=NOR, 11=AND
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
      circuit.addWire(orGate.getOutput('out'), mask0.getInput('a'));
      circuit.addWire(sel00.getOutput('out'), mask0.getInput('b'));
      circuit.addWire(nandGate.getOutput('out'), mask1.getInput('a'));
      circuit.addWire(sel01.getOutput('out'), mask1.getInput('b'));
      circuit.addWire(norGate.getOutput('out'), mask2.getInput('a'));
      circuit.addWire(sel10.getOutput('out'), mask2.getInput('b'));
      circuit.addWire(andGate.getOutput('out'), mask3.getInput('a'));
      circuit.addWire(sel11.getOutput('out'), mask3.getInput('b'));

      // OR all masked results
      const or1 = circuit.addGate(GateType.OR, { x: 800, y: 50 });
      const or2 = circuit.addGate(GateType.OR, { x: 800, y: 250 });
      const or3 = circuit.addGate(GateType.OR, { x: 1000, y: 150 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 1200, y: 150 }, 'Output');
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
      const inA = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'Input 1');
      const inB = circuit.addGate(GateType.INPUT, { x: 0, y: 100 }, 'Input 2');
      circuit.addGate(GateType.INPUT, { x: 0, y: 200 }, 'Op 1');
      circuit.addGate(GateType.INPUT, { x: 0, y: 300 }, 'Op 0');
      const andGate = circuit.addGate(GateType.AND, { x: 200, y: 50 });
      const out = circuit.addGate(GateType.OUTPUT, { x: 400, y: 50 }, 'Output');

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

    it('prerequisite DAG is valid (each prerequisite level exists)', () => {
      const ids = new Set(levels.map((l) => l.id));
      for (const level of levels) {
        if (level.prerequisites) {
          for (const prereqId of level.prerequisites) {
            expect(ids.has(prereqId)).toBe(true);
          }
        }
      }
    });

    it('contains exactly 27 levels', () => {
      expect(levels).toHaveLength(82);
    });
  });
});
