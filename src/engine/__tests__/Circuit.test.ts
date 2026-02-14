import { describe, it, expect } from 'vitest';
import { Wire } from '../Wire';
import { Circuit } from '../Circuit';
import { NandGate, NotGate } from '../Gate';
import { GateType } from '../types';
import type { Pin } from '../types';

function makeOutputPin(overrides: Partial<Pin> = {}): Pin {
  return {
    id: 'g1:out',
    gateId: 'g1',
    name: 'out',
    direction: 'output',
    value: undefined,
    ...overrides,
  };
}

function makeInputPin(overrides: Partial<Pin> = {}): Pin {
  return {
    id: 'g2:a',
    gateId: 'g2',
    name: 'a',
    direction: 'input',
    value: undefined,
    ...overrides,
  };
}

describe('Wire', () => {
  it('creates a wire from output pin to input pin', () => {
    const from = makeOutputPin();
    const to = makeInputPin();
    const wire = new Wire(from, to);

    expect(wire.id).toBeTruthy();
    expect(wire.fromPinId).toBe('g1:out');
    expect(wire.toPinId).toBe('g2:a');
    expect(wire.fromGateId).toBe('g1');
    expect(wire.toGateId).toBe('g2');
  });

  it('accepts a custom id', () => {
    const wire = new Wire(makeOutputPin(), makeInputPin(), 'w1');
    expect(wire.id).toBe('w1');
  });

  it('throws when source is an input pin', () => {
    const from = makeInputPin({ id: 'g1:a', gateId: 'g1' });
    const to = makeInputPin();
    expect(() => new Wire(from, to)).toThrow(/source must be an output pin/);
  });

  it('throws when target is an output pin', () => {
    const from = makeOutputPin();
    const to = makeOutputPin({ id: 'g2:out', gateId: 'g2' });
    expect(() => new Wire(from, to)).toThrow(/target must be an input pin/);
  });

  it('throws for input-to-input connection', () => {
    const from = makeInputPin({ id: 'g1:a', gateId: 'g1' });
    const to = makeInputPin();
    expect(() => new Wire(from, to)).toThrow();
  });

  it('throws for output-to-output connection', () => {
    const from = makeOutputPin();
    const to = makeOutputPin({ id: 'g2:out', gateId: 'g2' });
    expect(() => new Wire(from, to)).toThrow();
  });
});

describe('Circuit — addGate / removeGate', () => {
  it('adds a gate and returns it', () => {
    const circuit = new Circuit();
    const gate = circuit.addGate(GateType.NAND, { x: 10, y: 20 });

    expect(gate.type).toBe(GateType.NAND);
    expect(circuit.getGates()).toHaveLength(1);
    expect(circuit.getGate(gate.id)).toBe(gate);
  });

  it('stores the gate position', () => {
    const circuit = new Circuit();
    const gate = circuit.addGate(GateType.AND, { x: 100, y: 200 });
    const pos = circuit.getGatePosition(gate.id);

    expect(pos).toEqual({ x: 100, y: 200 });
  });

  it('returns a copy of position (not a reference)', () => {
    const circuit = new Circuit();
    const gate = circuit.addGate(GateType.AND, { x: 1, y: 2 });
    const pos = circuit.getGatePosition(gate.id)!;
    pos.x = 999;

    expect(circuit.getGatePosition(gate.id)).toEqual({ x: 1, y: 2 });
  });

  it('removes a gate by id', () => {
    const circuit = new Circuit();
    const gate = circuit.addGate(GateType.NAND, { x: 0, y: 0 });
    circuit.removeGate(gate.id);

    expect(circuit.getGates()).toHaveLength(0);
    expect(circuit.getGate(gate.id)).toBeUndefined();
    expect(circuit.getGatePosition(gate.id)).toBeUndefined();
  });

  it('throws when removing a non-existent gate', () => {
    const circuit = new Circuit();
    expect(() => circuit.removeGate('no-such-id')).toThrow(
      /Gate "no-such-id" not found/,
    );
  });

  it('cascade-removes wires when a gate is removed', () => {
    const circuit = new Circuit();
    const g1 = circuit.addGate(GateType.NAND, { x: 0, y: 0 });
    const g2 = circuit.addGate(GateType.NOT, { x: 50, y: 0 });

    circuit.addWire(g1.getOutput('out'), g2.getInput('in'));
    expect(circuit.getWires()).toHaveLength(1);

    circuit.removeGate(g1.id);
    expect(circuit.getWires()).toHaveLength(0);
  });

  it('only removes wires connected to the deleted gate', () => {
    const circuit = new Circuit();
    const g1 = circuit.addGate(GateType.NAND, { x: 0, y: 0 });
    const g2 = circuit.addGate(GateType.NAND, { x: 50, y: 0 });
    const g3 = circuit.addGate(GateType.NOT, { x: 100, y: 0 });

    circuit.addWire(g1.getOutput('out'), g2.getInput('a'));
    const w2 = circuit.addWire(g2.getOutput('out'), g3.getInput('in'));

    circuit.removeGate(g1.id);

    expect(circuit.getWires()).toHaveLength(1);
    expect(circuit.getWires()[0]!.id).toBe(w2.id);
  });
});

describe('Circuit — addWire / removeWire', () => {
  it('adds a wire between gates in the circuit', () => {
    const circuit = new Circuit();
    const g1 = circuit.addGate(GateType.NAND, { x: 0, y: 0 });
    const g2 = circuit.addGate(GateType.NOT, { x: 50, y: 0 });

    const wire = circuit.addWire(g1.getOutput('out'), g2.getInput('in'));

    expect(wire.fromPinId).toBe(`${g1.id}:out`);
    expect(wire.toPinId).toBe(`${g2.id}:in`);
    expect(circuit.getWires()).toHaveLength(1);
  });

  it('allows fan-out: one output to multiple inputs', () => {
    const circuit = new Circuit();
    const g1 = circuit.addGate(GateType.NAND, { x: 0, y: 0 });
    const g2 = circuit.addGate(GateType.NAND, { x: 50, y: 0 });
    const g3 = circuit.addGate(GateType.NAND, { x: 50, y: 50 });

    circuit.addWire(g1.getOutput('out'), g2.getInput('a'));
    circuit.addWire(g1.getOutput('out'), g3.getInput('a'));

    expect(circuit.getWires()).toHaveLength(2);
  });

  it('rejects a second wire to the same input pin', () => {
    const circuit = new Circuit();
    const g1 = circuit.addGate(GateType.NAND, { x: 0, y: 0 });
    const g2 = circuit.addGate(GateType.NAND, { x: 50, y: 0 });
    const g3 = circuit.addGate(GateType.NOT, { x: 100, y: 0 });

    circuit.addWire(g1.getOutput('out'), g3.getInput('in'));

    expect(() =>
      circuit.addWire(g2.getOutput('out'), g3.getInput('in')),
    ).toThrow(/already has an incoming wire/);
  });

  it('throws when source pin belongs to a gate not in circuit', () => {
    const circuit = new Circuit();
    const g2 = circuit.addGate(GateType.NOT, { x: 0, y: 0 });
    const external = new NandGate('external');

    expect(() =>
      circuit.addWire(external.getOutput('out'), g2.getInput('in')),
    ).toThrow(/not in this circuit/);
  });

  it('throws when target pin belongs to a gate not in circuit', () => {
    const circuit = new Circuit();
    const g1 = circuit.addGate(GateType.NAND, { x: 0, y: 0 });
    const external = new NotGate('external');

    expect(() =>
      circuit.addWire(g1.getOutput('out'), external.getInput('in')),
    ).toThrow(/not in this circuit/);
  });

  it('removes a wire by id', () => {
    const circuit = new Circuit();
    const g1 = circuit.addGate(GateType.NAND, { x: 0, y: 0 });
    const g2 = circuit.addGate(GateType.NOT, { x: 50, y: 0 });
    const wire = circuit.addWire(g1.getOutput('out'), g2.getInput('in'));

    circuit.removeWire(wire.id);
    expect(circuit.getWires()).toHaveLength(0);
  });

  it('throws when removing a non-existent wire', () => {
    const circuit = new Circuit();
    expect(() => circuit.removeWire('no-such-id')).toThrow(
      /Wire "no-such-id" not found/,
    );
  });

  it('allows re-wiring an input after removing the old wire', () => {
    const circuit = new Circuit();
    const g1 = circuit.addGate(GateType.NAND, { x: 0, y: 0 });
    const g2 = circuit.addGate(GateType.NAND, { x: 50, y: 0 });
    const g3 = circuit.addGate(GateType.NOT, { x: 100, y: 0 });

    const w1 = circuit.addWire(g1.getOutput('out'), g3.getInput('in'));
    circuit.removeWire(w1.id);

    const w2 = circuit.addWire(g2.getOutput('out'), g3.getInput('in'));
    expect(circuit.getWires()).toHaveLength(1);
    expect(circuit.getWires()[0]!.id).toBe(w2.id);
  });
});

describe('Circuit — serialize / deserialize', () => {
  function buildTestCircuit(): Circuit {
    const circuit = new Circuit();
    const g1 = circuit.addGate(GateType.NAND, { x: 10, y: 20 });
    const g2 = circuit.addGate(GateType.NOT, { x: 100, y: 200 });
    circuit.addWire(g1.getOutput('out'), g2.getInput('in'));
    return circuit;
  }

  it('serializes gates with type, id, and position', () => {
    const circuit = buildTestCircuit();
    const data = circuit.serialize();

    expect(data.gates).toHaveLength(2);
    expect(data.gates[0]).toEqual(
      expect.objectContaining({
        type: GateType.NAND,
        position: { x: 10, y: 20 },
      }),
    );
    expect(data.gates[1]).toEqual(
      expect.objectContaining({
        type: GateType.NOT,
        position: { x: 100, y: 200 },
      }),
    );
  });

  it('serializes wires with from/to pin ids', () => {
    const circuit = buildTestCircuit();
    const data = circuit.serialize();

    expect(data.wires).toHaveLength(1);
    const wire = data.wires[0]!;
    expect(wire.from).toContain(':out');
    expect(wire.to).toContain(':in');
  });

  it('deserializes back into a working circuit', () => {
    const original = buildTestCircuit();
    const data = original.serialize();
    const restored = Circuit.deserialize(data);

    expect(restored.getGates()).toHaveLength(2);
    expect(restored.getWires()).toHaveLength(1);
  });

  it('preserves gate types and positions through round-trip', () => {
    const original = buildTestCircuit();
    const data = original.serialize();
    const restored = Circuit.deserialize(data);

    const origGates = original.getGates();
    const restoredGates = restored.getGates();

    for (let i = 0; i < origGates.length; i++) {
      const og = origGates[i]!;
      const rg = restoredGates[i]!;
      expect(rg.id).toBe(og.id);
      expect(rg.type).toBe(og.type);
      expect(restored.getGatePosition(rg.id)).toEqual(
        original.getGatePosition(og.id),
      );
    }
  });

  it('preserves wire connections through round-trip', () => {
    const original = buildTestCircuit();
    const data = original.serialize();
    const restored = Circuit.deserialize(data);

    const origWires = original.getWires();
    const restoredWires = restored.getWires();

    expect(restoredWires).toHaveLength(origWires.length);
    for (let i = 0; i < origWires.length; i++) {
      const ow = origWires[i]!;
      const rw = restoredWires[i]!;
      expect(rw.id).toBe(ow.id);
      expect(rw.fromPinId).toBe(ow.fromPinId);
      expect(rw.toPinId).toBe(ow.toPinId);
    }
  });

  it('produces identical JSON on double round-trip', () => {
    const circuit = buildTestCircuit();
    const first = circuit.serialize();
    const second = Circuit.deserialize(first).serialize();

    expect(second).toEqual(first);
  });

  it('throws on deserialize with invalid pin reference', () => {
    const bad = {
      gates: [
        { type: GateType.NAND, id: 'g1', position: { x: 0, y: 0 } },
      ],
      wires: [{ id: 'w1', from: 'g1:out', to: 'nonexistent:in' }],
    };

    expect(() => Circuit.deserialize(bad)).toThrow(
      /target pin "nonexistent:in" not found/,
    );
  });
});

describe('Circuit — accessors', () => {
  it('getGates returns all gates', () => {
    const circuit = new Circuit();
    circuit.addGate(GateType.NAND, { x: 0, y: 0 });
    circuit.addGate(GateType.OR, { x: 50, y: 0 });
    circuit.addGate(GateType.NOT, { x: 100, y: 0 });

    expect(circuit.getGates()).toHaveLength(3);
  });

  it('getGate returns undefined for unknown id', () => {
    const circuit = new Circuit();
    expect(circuit.getGate('nope')).toBeUndefined();
  });

  it('getGatePosition returns undefined for unknown id', () => {
    const circuit = new Circuit();
    expect(circuit.getGatePosition('nope')).toBeUndefined();
  });

  it('getWires returns empty array for fresh circuit', () => {
    const circuit = new Circuit();
    expect(circuit.getWires()).toEqual([]);
  });
});
