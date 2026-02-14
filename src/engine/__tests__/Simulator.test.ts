import { describe, it, expect } from 'vitest';
import { Circuit } from '../Circuit';
import { Simulator } from '../Simulator';
import { GateType } from '../types';

describe('Simulator', () => {
  const sim = new Simulator();

  it('should simulate a single NOT gate (NAND with tied inputs)', () => {
    const circuit = new Circuit();
    const nand = circuit.addGate(GateType.NAND, { x: 0, y: 0 });

    // NOT = NAND with both inputs tied together
    // We set input 'a' via external input and wire a->b won't work,
    // so we test NAND directly: a=true, b=true => out=false
    const inputs = new Map<string, boolean>();
    inputs.set(nand.inputs[0]!.id, true);
    inputs.set(nand.inputs[1]!.id, true);

    const result = sim.simulate(circuit, inputs);
    expect(result.get(nand.outputs[0]!.id)).toBe(false); // NAND(1,1) = 0
  });

  it('should simulate NAND gate with all input combos', () => {
    const circuit = new Circuit();
    const nand = circuit.addGate(GateType.NAND, { x: 0, y: 0 });

    const cases: [boolean, boolean, boolean][] = [
      [false, false, true],
      [false, true, true],
      [true, false, true],
      [true, true, false],
    ];

    for (const [a, b, expected] of cases) {
      const inputs = new Map<string, boolean>();
      inputs.set(nand.inputs[0]!.id, a);
      inputs.set(nand.inputs[1]!.id, b);
      const result = sim.simulate(circuit, inputs);
      expect(result.get(nand.outputs[0]!.id)).toBe(expected);
    }
  });

  it('should simulate AND gate', () => {
    const circuit = new Circuit();
    const and = circuit.addGate(GateType.AND, { x: 0, y: 0 });

    const inputs = new Map<string, boolean>();
    inputs.set(and.inputs[0]!.id, true);
    inputs.set(and.inputs[1]!.id, true);
    const result = sim.simulate(circuit, inputs);
    expect(result.get(and.outputs[0]!.id)).toBe(true);
  });

  it('should simulate chained gates (NOT → NOT = identity)', () => {
    const circuit = new Circuit();
    const not1 = circuit.addGate(GateType.NOT, { x: 0, y: 0 });
    const not2 = circuit.addGate(GateType.NOT, { x: 100, y: 0 });

    // Wire not1 output → not2 input
    circuit.addWire(not1.outputs[0]!, not2.inputs[0]!);

    const inputs = new Map<string, boolean>();
    inputs.set(not1.inputs[0]!.id, true);

    const result = sim.simulate(circuit, inputs);
    // NOT(true) = false, NOT(false) = true => back to true
    expect(result.get(not2.outputs[0]!.id)).toBe(true);
  });

  it('should simulate a half adder (XOR + AND)', () => {
    const circuit = new Circuit();
    const xor = circuit.addGate(GateType.XOR, { x: 0, y: 0 });
    const and = circuit.addGate(GateType.AND, { x: 0, y: 100 });

    // Half adder: Sum = A XOR B, Carry = A AND B
    // Both gates share the same inputs A and B
    // We just set them directly as external inputs

    // Test: A=1, B=1 → Sum=0, Carry=1
    const inputs = new Map<string, boolean>();
    inputs.set(xor.inputs[0]!.id, true);
    inputs.set(xor.inputs[1]!.id, true);
    inputs.set(and.inputs[0]!.id, true);
    inputs.set(and.inputs[1]!.id, true);

    const result = sim.simulate(circuit, inputs);
    expect(result.get(xor.outputs[0]!.id)).toBe(false); // Sum = 0
    expect(result.get(and.outputs[0]!.id)).toBe(true);   // Carry = 1
  });

  it('should simulate half adder: A=1, B=0', () => {
    const circuit = new Circuit();
    const xor = circuit.addGate(GateType.XOR, { x: 0, y: 0 });
    const and = circuit.addGate(GateType.AND, { x: 0, y: 100 });

    const inputs = new Map<string, boolean>();
    inputs.set(xor.inputs[0]!.id, true);
    inputs.set(xor.inputs[1]!.id, false);
    inputs.set(and.inputs[0]!.id, true);
    inputs.set(and.inputs[1]!.id, false);

    const result = sim.simulate(circuit, inputs);
    expect(result.get(xor.outputs[0]!.id)).toBe(true);  // Sum = 1
    expect(result.get(and.outputs[0]!.id)).toBe(false);  // Carry = 0
  });

  it('should propagate signals through wired chain', () => {
    const circuit = new Circuit();
    const and = circuit.addGate(GateType.AND, { x: 0, y: 0 });
    const not = circuit.addGate(GateType.NOT, { x: 100, y: 0 });

    // AND output → NOT input
    circuit.addWire(and.outputs[0]!, not.inputs[0]!);

    const inputs = new Map<string, boolean>();
    inputs.set(and.inputs[0]!.id, true);
    inputs.set(and.inputs[1]!.id, true);

    const result = sim.simulate(circuit, inputs);
    expect(result.get(and.outputs[0]!.id)).toBe(true);   // AND(1,1) = 1
    expect(result.get(not.outputs[0]!.id)).toBe(false);  // NOT(1) = 0
  });

  it('should detect combinational loops', () => {
    // Create a circuit where gate A feeds gate B and gate B feeds gate A
    const circuit = new Circuit();
    const not1 = circuit.addGate(GateType.NOT, { x: 0, y: 0 });
    const not2 = circuit.addGate(GateType.NOT, { x: 100, y: 0 });

    circuit.addWire(not1.outputs[0]!, not2.inputs[0]!);
    circuit.addWire(not2.outputs[0]!, not1.inputs[0]!);

    const inputs = new Map<string, boolean>();
    expect(() => sim.simulate(circuit, inputs)).toThrow('loop');
  });

  it('should handle unconnected inputs as false', () => {
    const circuit = new Circuit();
    const and = circuit.addGate(GateType.AND, { x: 0, y: 0 });

    // No external inputs set → should default to false
    const result = sim.simulate(circuit, new Map());
    expect(result.get(and.outputs[0]!.id)).toBe(false); // AND(false, false) = false
  });
});
