import type {
  Pin,
  Position,
  SerializedCircuit,
} from './types';
import { GateType, parsePinId } from './types';
import { type Gate, createGate } from './Gate';
import { Wire } from './Wire';

export class Circuit {
  private gates = new Map<string, Gate>();
  private wires = new Map<string, Wire>();
  private positions = new Map<string, Position>();
  private gatesCache: Gate[] | null = null;
  private wiresCache: Wire[] | null = null;

  addGate(type: GateType, position: Position, label?: string): Gate {
    const gate = createGate({ type, label });
    this.gates.set(gate.id, gate);
    this.positions.set(gate.id, { ...position });
    this.gatesCache = null;
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
    this.gatesCache = null;
    this.wiresCache = null;
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
    this.gatesCache = null;
    this.wiresCache = null;
  }

  addWire(from: Pin, to: Pin, color?: string, waypoints?: Position[]): Wire {
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

    const wire = new Wire(from, to, undefined, color, waypoints);
    this.wires.set(wire.id, wire);
    this.wiresCache = null;
    return wire;
  }

  removeWire(id: string): void {
    if (!this.wires.has(id)) {
      throw new Error(`Wire "${id}" not found in circuit`);
    }
    this.wires.delete(id);
    this.wiresCache = null;
  }

  getGate(id: string): Gate | undefined {
    return this.gates.get(id);
  }

  getGates(): Gate[] {
    if (!this.gatesCache) this.gatesCache = [...this.gates.values()];
    return this.gatesCache;
  }

  getWires(): Wire[] {
    if (!this.wiresCache) this.wiresCache = [...this.wires.values()];
    return this.wiresCache;
  }

  setWireColor(wireId: string, color: string): void {
    const wire = this.wires.get(wireId);
    if (!wire) throw new Error(`Wire "${wireId}" not found in circuit`);
    wire.color = color;
  }

  setWireWaypoint(wireId: string, index: number, pos: Position): void {
    const wire = this.wires.get(wireId);
    if (!wire) throw new Error(`Wire "${wireId}" not found in circuit`);
    if (index < 0 || index >= wire.waypoints.length) throw new Error(`Waypoint index ${index} out of range`);
    wire.waypoints[index] = { ...pos };
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
      fromPinId: wire.fromPinId,
      toPinId: wire.toPinId,
      ...(wire.color !== 'green' ? { color: wire.color } : {}),
      ...(wire.waypoints.length > 0 ? { waypoints: wire.waypoints.map(p => ({ ...p })) } : {}),
    }));

    return { gates, wires };
  }

  loadFrom(data: SerializedCircuit): void {
    this.gates.clear();
    this.wires.clear();
    this.positions.clear();
    this.gatesCache = null;
    this.wiresCache = null;

    for (const sg of data.gates) {
      const gate = createGate({ type: sg.type, id: sg.id, label: sg.label });
      this.gates.set(gate.id, gate);
      this.positions.set(gate.id, { ...sg.position });
    }

    for (const sw of data.wires) {
      const fromPin = this.findPinById(sw.fromPinId ?? sw.from ?? '');
      const toPin = this.findPinById(sw.toPinId ?? sw.to ?? '');
      if (fromPin && toPin) {
        const wire = new Wire(fromPin, toPin, sw.id, sw.color, sw.waypoints);
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
      const fromId = sw.fromPinId ?? sw.from ?? '';
      const toId = sw.toPinId ?? sw.to ?? '';
      const fromPin = circuit.findPinById(fromId);
      const toPin = circuit.findPinById(toId);

      if (!fromPin) {
        throw new Error(
          `Cannot deserialize: source pin "${fromId}" not found`,
        );
      }
      if (!toPin) {
        throw new Error(
          `Cannot deserialize: target pin "${toId}" not found`,
        );
      }

      const wire = new Wire(fromPin, toPin, sw.id, sw.color, sw.waypoints);
      circuit.wires.set(wire.id, wire);
    }

    return circuit;
  }

  private findPinById(pinId: string): Pin | undefined {
    const parsed = parsePinId(pinId);
    if (!parsed) return undefined;

    const gate = this.gates.get(parsed.gateId);
    if (!gate) return undefined;

    return [...gate.inputs, ...gate.outputs].find(
      (p) => p.name === parsed.pinName,
    );
  }
}
