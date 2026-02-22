import type {
  Pin,
  Position,
  SerializedCircuit,
} from './types';
import { GateType } from './types';
import { type Gate, createGate } from './Gate';
import { Wire } from './Wire';

export class Circuit {
  private gates = new Map<string, Gate>();
  private wires = new Map<string, Wire>();
  private positions = new Map<string, Position>();

  addGate(type: GateType, position: Position, label?: string): Gate {
    const gate = createGate({ type, label });
    this.gates.set(gate.id, gate);
    this.positions.set(gate.id, { ...position });
    return gate;
  }

  setGatePosition(id: string, position: Position): void {
    if (!this.gates.has(id)) {
      throw new Error(`Gate "${id}" not found in circuit`);
    }
    this.positions.set(id, { ...position });
  }

  clear(): void {
    this.gates.clear();
    this.wires.clear();
    this.positions.clear();
  }

  removeGate(id: string): void {
    if (!this.gates.has(id)) {
      throw new Error(`Gate "${id}" not found in circuit`);
    }

    for (const [wireId, wire] of this.wires) {
      if (wire.fromGateId === id || wire.toGateId === id) {
        this.wires.delete(wireId);
      }
    }

    this.gates.delete(id);
    this.positions.delete(id);
  }

  addWire(from: Pin, to: Pin, color?: string): Wire {
    if (!this.gates.has(from.gateId)) {
      throw new Error(
        `Source pin "${from.id}" belongs to gate "${from.gateId}" which is not in this circuit`,
      );
    }
    if (!this.gates.has(to.gateId)) {
      throw new Error(
        `Target pin "${to.id}" belongs to gate "${to.gateId}" which is not in this circuit`,
      );
    }

    for (const wire of this.wires.values()) {
      if (wire.toPinId === to.id) {
        throw new Error(
          `Input pin "${to.id}" already has an incoming wire`,
        );
      }
    }

    const wire = new Wire(from, to, undefined, color);
    this.wires.set(wire.id, wire);
    return wire;
  }

  removeWire(id: string): void {
    if (!this.wires.has(id)) {
      throw new Error(`Wire "${id}" not found in circuit`);
    }
    this.wires.delete(id);
  }

  getGate(id: string): Gate | undefined {
    return this.gates.get(id);
  }

  getGates(): Gate[] {
    return [...this.gates.values()];
  }

  getWires(): Wire[] {
    return [...this.wires.values()];
  }

  getGatePosition(id: string): Position | undefined {
    const pos = this.positions.get(id);
    return pos ? { ...pos } : undefined;
  }

  serialize(): SerializedCircuit {
    const gates = this.getGates().map((gate) => {
      const pos = this.positions.get(gate.id);
      return {
        type: gate.type,
        id: gate.id,
        position: pos ? { ...pos } : { x: 0, y: 0 },
        ...(gate.label ? { label: gate.label } : {}),
      };
    });

    const wires = this.getWires().map((wire) => ({
      id: wire.id,
      from: wire.fromPinId,
      to: wire.toPinId,
      ...(wire.color !== 'green' ? { color: wire.color } : {}),
    }));

    return { gates, wires };
  }

  loadFrom(data: SerializedCircuit): void {
    this.gates.clear();
    this.wires.clear();
    this.positions.clear();

    for (const sg of data.gates) {
      const gate = createGate({ type: sg.type, id: sg.id, label: sg.label });
      this.gates.set(gate.id, gate);
      this.positions.set(gate.id, { ...sg.position });
    }

    for (const sw of data.wires) {
      const fromPin = this.findPinById(sw.from);
      const toPin = this.findPinById(sw.to);
      if (fromPin && toPin) {
        const wire = new Wire(fromPin, toPin, sw.id, sw.color);
        this.wires.set(wire.id, wire);
      }
    }
  }

  static deserialize(data: SerializedCircuit): Circuit {
    const circuit = new Circuit();

    for (const sg of data.gates) {
      const gate = createGate({ type: sg.type, id: sg.id, label: sg.label });
      circuit.gates.set(gate.id, gate);
      circuit.positions.set(gate.id, { ...sg.position });
    }

    for (const sw of data.wires) {
      const fromPin = circuit.findPinById(sw.from);
      const toPin = circuit.findPinById(sw.to);

      if (!fromPin) {
        throw new Error(
          `Cannot deserialize: source pin "${sw.from}" not found`,
        );
      }
      if (!toPin) {
        throw new Error(
          `Cannot deserialize: target pin "${sw.to}" not found`,
        );
      }

      const wire = new Wire(fromPin, toPin, sw.id, sw.color);
      circuit.wires.set(wire.id, wire);
    }

    return circuit;
  }

  private findPinById(pinId: string): Pin | undefined {
    const colonIndex = pinId.indexOf(':');
    if (colonIndex === -1) return undefined;

    const gateId = pinId.substring(0, colonIndex);
    const pinName = pinId.substring(colonIndex + 1);
    const gate = this.gates.get(gateId);
    if (!gate) return undefined;

    return [...gate.inputs, ...gate.outputs].find(
      (p) => p.name === pinName,
    );
  }
}
