import { describe, it, expect } from 'vitest';
import { Circuit } from '../Circuit';
import { Simulator } from '../Simulator';
import { DFlipFlopGate, isStateful, createGate } from '../Gate';
import { GateType } from '../types';

describe('DFlipFlopGate', () => {
  it('starts with state false', () => {
    const ff = new DFlipFlopGate('ff1');
    ff.evaluate();
    expect(ff.getOutput('q').value).toBe(false);
    expect(ff.getOutput('qn').value).toBe(true);
  });

  it('latches D input on tick', () => {
    const ff = new DFlipFlopGate('ff1');
    ff.getInput('d').value = true;
    ff.tick();
    ff.evaluate();
    expect(ff.getOutput('q').value).toBe(true);
    expect(ff.getOutput('qn').value).toBe(false);
  });

  it('holds state when D changes between ticks', () => {
    const ff = new DFlipFlopGate('ff1');
    ff.getInput('d').value = true;
    ff.tick();
    ff.evaluate();
    expect(ff.getOutput('q').value).toBe(true);

    ff.getInput('d').value = false;
    // No tick — state should not change
    ff.evaluate();
    expect(ff.getOutput('q').value).toBe(true);

    // Now tick
    ff.tick();
    ff.evaluate();
    expect(ff.getOutput('q').value).toBe(false);
  });

  it('resets state', () => {
    const ff = new DFlipFlopGate('ff1');
    ff.getInput('d').value = true;
    ff.tick();
    ff.evaluate();
    expect(ff.getOutput('q').value).toBe(true);

    ff.resetState();
    ff.evaluate();
    expect(ff.getOutput('q').value).toBe(false);
  });

  it('is identified as stateful', () => {
    const ff = new DFlipFlopGate();
    expect(isStateful(ff)).toBe(true);
  });

  it('is created by createGate factory', () => {
    const gate = createGate({ type: GateType.D_FLIPFLOP });
    expect(gate).toBeInstanceOf(DFlipFlopGate);
    expect(gate.type).toBe(GateType.D_FLIPFLOP);
  });

  it('has correct pin names', () => {
    const ff = new DFlipFlopGate('ff1');
    expect(ff.inputs).toHaveLength(1);
    expect(ff.inputs[0]!.name).toBe('d');
    expect(ff.outputs).toHaveLength(2);
    expect(ff.outputs[0]!.name).toBe('q');
    expect(ff.outputs[1]!.name).toBe('qn');
  });
});

describe('Simulator sequential', () => {
  const sim = new Simulator();

  it('simulateStep propagates signals like simulate', () => {
    const circuit = new Circuit();
    const not = circuit.addGate(GateType.NOT, { x: 0, y: 0 });

    const inputs = new Map<string, boolean>();
    inputs.set(not.inputs[0]!.id, true);

    const result = sim.simulateStep(circuit, inputs);
    expect(result.get(not.outputs[0]!.id)).toBe(false);
  });

  it('delay line: D flip-flop delays signal by one tick', () => {
    const circuit = new Circuit();
    const inp = circuit.addGate(GateType.INPUT, { x: 0, y: 0 }, 'IN');
    const ff = circuit.addGate(GateType.D_FLIPFLOP, { x: 100, y: 0 });
    const out = circuit.addGate(GateType.OUTPUT, { x: 200, y: 0 }, 'OUT');

    circuit.addWire(inp.getOutput('out'), ff.getInput('d'));
    circuit.addWire(ff.getOutput('q'), out.getInput('in'));

    sim.resetState(circuit);

    // Tick 0: IN=1, OUT should be 0 (initial state)
    const r0 = sim.simulateStep(circuit, new Map([[inp.outputs[0]!.id, true]]));
    expect(r0.get(out.inputs[0]!.id)).toBe(false);
    sim.tick(circuit);

    // Tick 1: IN=0, OUT should be 1 (delayed from tick 0)
    const r1 = sim.simulateStep(circuit, new Map([[inp.outputs[0]!.id, false]]));
    expect(r1.get(out.inputs[0]!.id)).toBe(true);
    sim.tick(circuit);

    // Tick 2: IN=1, OUT should be 0 (delayed from tick 1)
    const r2 = sim.simulateStep(circuit, new Map([[inp.outputs[0]!.id, true]]));
    expect(r2.get(out.inputs[0]!.id)).toBe(false);
  });

  it('toggle: QN fed back to D alternates each tick', () => {
    const circuit = new Circuit();
    const ff = circuit.addGate(GateType.D_FLIPFLOP, { x: 0, y: 0 });
    const out = circuit.addGate(GateType.OUTPUT, { x: 100, y: 0 }, 'OUT');

    // Wire QN → D (toggle)
    circuit.addWire(ff.getOutput('qn'), ff.getInput('d'));
    circuit.addWire(ff.getOutput('q'), out.getInput('in'));

    sim.resetState(circuit);

    const expected = [false, true, false, true, false, true];
    for (const exp of expected) {
      const r = sim.simulateStep(circuit, new Map());
      expect(r.get(out.inputs[0]!.id)).toBe(exp);
      sim.tick(circuit);
    }
  });

  it('resetState resets all flip-flops', () => {
    const circuit = new Circuit();
    const ff = circuit.addGate(GateType.D_FLIPFLOP, { x: 0, y: 0 });

    // Set state to true
    const inputs = new Map<string, boolean>();
    inputs.set(ff.inputs[0]!.id, true);
    sim.simulateStep(circuit, inputs);
    sim.tick(circuit);

    const r1 = sim.simulateStep(circuit, new Map());
    expect(r1.get(ff.outputs[0]!.id)).toBe(true);

    // Reset
    sim.resetState(circuit);
    const r2 = sim.simulateStep(circuit, new Map());
    expect(r2.get(ff.outputs[0]!.id)).toBe(false);
  });

  it('sequential sort allows feedback through flip-flops', () => {
    const circuit = new Circuit();
    const ff = circuit.addGate(GateType.D_FLIPFLOP, { x: 0, y: 0 });
    const not = circuit.addGate(GateType.NOT, { x: 100, y: 0 });

    // QN → NOT → D (should not throw)
    circuit.addWire(ff.getOutput('qn'), not.getInput('in'));
    circuit.addWire(not.getOutput('out'), ff.getInput('d'));

    sim.resetState(circuit);
    // Should not throw
    expect(() => sim.simulateStep(circuit, new Map())).not.toThrow();
  });
});
