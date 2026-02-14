import { describe, it, expect } from 'vitest';
import {
  Gate,
  NandGate,
  AndGate,
  OrGate,
  NotGate,
  XorGate,
  createGate,
} from '../Gate';
import { GateType } from '../types';

function evalTwoInput(
  gate: Gate,
  a: boolean,
  b: boolean,
): boolean {
  gate.getInput('a').value = a;
  gate.getInput('b').value = b;
  gate.evaluate();
  return gate.getOutput('out').value!;
}

function evalOneInput(gate: Gate, input: boolean): boolean {
  gate.getInput('in').value = input;
  gate.evaluate();
  return gate.getOutput('out').value!;
}

describe('NandGate', () => {
  it.each([
    [false, false, true],
    [false, true, true],
    [true, false, true],
    [true, true, false],
  ])('NAND(%s, %s) = %s', (a, b, expected) => {
    const gate = new NandGate();
    expect(evalTwoInput(gate, a, b)).toBe(expected);
  });
});

describe('AndGate', () => {
  it.each([
    [false, false, false],
    [false, true, false],
    [true, false, false],
    [true, true, true],
  ])('AND(%s, %s) = %s', (a, b, expected) => {
    const gate = new AndGate();
    expect(evalTwoInput(gate, a, b)).toBe(expected);
  });
});

describe('OrGate', () => {
  it.each([
    [false, false, false],
    [false, true, true],
    [true, false, true],
    [true, true, true],
  ])('OR(%s, %s) = %s', (a, b, expected) => {
    const gate = new OrGate();
    expect(evalTwoInput(gate, a, b)).toBe(expected);
  });
});

describe('NotGate', () => {
  it.each([
    [false, true],
    [true, false],
  ])('NOT(%s) = %s', (input, expected) => {
    const gate = new NotGate();
    expect(evalOneInput(gate, input)).toBe(expected);
  });
});

describe('XorGate', () => {
  it.each([
    [false, false, false],
    [false, true, true],
    [true, false, true],
    [true, true, false],
  ])('XOR(%s, %s) = %s', (a, b, expected) => {
    const gate = new XorGate();
    expect(evalTwoInput(gate, a, b)).toBe(expected);
  });
});

describe('Gate base class', () => {
  it('generates a unique id when none is provided', () => {
    const g1 = new NandGate();
    const g2 = new NandGate();
    expect(g1.id).toBeTruthy();
    expect(g2.id).toBeTruthy();
    expect(g1.id).not.toBe(g2.id);
  });

  it('uses a provided id', () => {
    const gate = new NandGate('custom-id');
    expect(gate.id).toBe('custom-id');
  });

  it('exposes correct type', () => {
    expect(new NandGate().type).toBe(GateType.NAND);
    expect(new AndGate().type).toBe(GateType.AND);
    expect(new OrGate().type).toBe(GateType.OR);
    expect(new NotGate().type).toBe(GateType.NOT);
    expect(new XorGate().type).toBe(GateType.XOR);
  });

  it('creates pins with correct ids derived from gate id', () => {
    const gate = new NandGate('g1');
    expect(gate.inputs[0]!.id).toBe('g1:a');
    expect(gate.inputs[1]!.id).toBe('g1:b');
    expect(gate.outputs[0]!.id).toBe('g1:out');
  });

  it('creates pins with correct direction', () => {
    const gate = new NandGate();
    for (const pin of gate.inputs) {
      expect(pin.direction).toBe('input');
    }
    for (const pin of gate.outputs) {
      expect(pin.direction).toBe('output');
    }
  });

  it('initializes pin values as undefined', () => {
    const gate = new NandGate();
    for (const pin of [...gate.inputs, ...gate.outputs]) {
      expect(pin.value).toBeUndefined();
    }
  });

  it('treats floating (undefined) inputs as false', () => {
    const gate = new NandGate();
    gate.evaluate();
    expect(gate.getOutput('out').value).toBe(true);
  });

  it('getInput throws for unknown pin name', () => {
    const gate = new NandGate();
    expect(() => gate.getInput('nonexistent')).toThrow(
      /Input pin "nonexistent" not found/,
    );
  });

  it('getOutput throws for unknown pin name', () => {
    const gate = new NandGate();
    expect(() => gate.getOutput('nonexistent')).toThrow(
      /Output pin "nonexistent" not found/,
    );
  });
});

describe('NotGate pin naming', () => {
  it('has input named "in" and output named "out"', () => {
    const gate = new NotGate();
    expect(gate.inputs).toHaveLength(1);
    expect(gate.inputs[0]!.name).toBe('in');
    expect(gate.outputs).toHaveLength(1);
    expect(gate.outputs[0]!.name).toBe('out');
  });
});

describe('Two-input gates pin naming', () => {
  it.each([
    ['NAND', () => new NandGate()],
    ['AND', () => new AndGate()],
    ['OR', () => new OrGate()],
    ['XOR', () => new XorGate()],
  ] as const)('%s has inputs "a","b" and output "out"', (_name, factory) => {
    const gate = factory();
    expect(gate.inputs).toHaveLength(2);
    expect(gate.inputs[0]!.name).toBe('a');
    expect(gate.inputs[1]!.name).toBe('b');
    expect(gate.outputs).toHaveLength(1);
    expect(gate.outputs[0]!.name).toBe('out');
  });
});

describe('createGate factory', () => {
  it.each([
    [GateType.NAND, NandGate],
    [GateType.AND, AndGate],
    [GateType.OR, OrGate],
    [GateType.NOT, NotGate],
    [GateType.XOR, XorGate],
  ] as const)('creates %s gate', (type, expectedClass) => {
    const gate = createGate({ type });
    expect(gate).toBeInstanceOf(expectedClass);
    expect(gate.type).toBe(type);
  });

  it('passes id through to the gate', () => {
    const gate = createGate({ type: GateType.AND, id: 'my-id' });
    expect(gate.id).toBe('my-id');
  });
});
