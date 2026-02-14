import { Circuit } from './Circuit';
import type { Gate } from './Gate';
import type { Wire } from './Wire';
import type { Pin } from './types';

export class Simulator {
  /**
   * @param circuit - The circuit to simulate
   * @param inputs  - External input values keyed by pin id (e.g. "gateId:a")
   * @returns Map of every pin id to its resolved boolean value
   * @throws {Error} Combinational loop detected
   */
  simulate(
    circuit: Circuit,
    inputs: Map<string, boolean>,
  ): Map<string, boolean> {
    const gates = circuit.getGates();
    const wires = circuit.getWires();

    const sorted = this.topologicalSort(gates, wires);

    const wiresByTarget = new Map<string, Wire>();
    for (const wire of wires) {
      wiresByTarget.set(wire.toPinId, wire);
    }

    const pinMap = new Map<string, Pin>();
    for (const gate of gates) {
      for (const pin of [...gate.inputs, ...gate.outputs]) {
        pinMap.set(pin.id, pin);
      }
    }

    for (const pin of pinMap.values()) {
      pin.value = undefined;
    }

    for (const [pinId, value] of inputs) {
      const pin = pinMap.get(pinId);
      if (pin) {
        pin.value = value;
      }
    }

    for (const gate of sorted) {
      for (const inputPin of gate.inputs) {
        const wire = wiresByTarget.get(inputPin.id);
        if (wire) {
          const sourcePin = pinMap.get(wire.fromPinId);
          if (sourcePin) {
            inputPin.value = sourcePin.value;
          }
        }
      }
      gate.evaluate();
    }

    const result = new Map<string, boolean>();
    for (const pin of pinMap.values()) {
      result.set(pin.id, pin.value ?? false);
    }
    return result;
  }

  // Kahn's algorithm — returns gates in dependency order, throws on cycle
  private topologicalSort(gates: Gate[], wires: Wire[]): Gate[] {
    const gateMap = new Map<string, Gate>();
    const inDegree = new Map<string, number>();
    const dependents = new Map<string, Set<string>>();

    for (const gate of gates) {
      gateMap.set(gate.id, gate);
      inDegree.set(gate.id, 0);
      dependents.set(gate.id, new Set());
    }

    // Deduplicate: multiple wires between same gate pair = one edge
    for (const wire of wires) {
      const from = wire.fromGateId;
      const to = wire.toGateId;

      const deps = dependents.get(from);
      if (deps && !deps.has(to)) {
        deps.add(to);
        inDegree.set(to, inDegree.get(to)! + 1);
      }
    }

    const queue: string[] = [];
    for (const [gateId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(gateId);
      }
    }

    const sorted: Gate[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      sorted.push(gateMap.get(current)!);

      for (const dep of dependents.get(current)!) {
        const newDeg = inDegree.get(dep)! - 1;
        inDegree.set(dep, newDeg);
        if (newDeg === 0) {
          queue.push(dep);
        }
      }
    }

    if (sorted.length !== gates.length) {
      throw new Error('Combinational loop detected: circuit contains a cycle');
    }

    return sorted;
  }
}
