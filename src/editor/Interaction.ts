import { Circuit } from '../engine/Circuit';
import { GateType } from '../engine/types';
import type { Pin, Position } from '../engine/types';
import type { Gate } from '../engine/Gate';
import type { Wire } from '../engine/Wire';
import type { Camera } from './Grid';
import { snapToGrid } from './Grid';
import {
  getPinPosition,
  getGateBounds,
  PIN_RADIUS,
} from './GateRenderer';
import type { Level } from '../levels/Level';
import { soundManager } from './SoundManager';
import type { SerializedCircuit } from '../engine/types';

type InteractionState = 'idle' | 'placing' | 'dragging' | 'wiring';

interface Callbacks {
  onCircuitChange: () => void;
  onSelectGate: (id: string | null) => void;
  requestRender: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onShowColorPicker?: (wireId: string, screenX: number, screenY: number) => void;
}

export class Interaction {
  private state: InteractionState = 'idle';
  private selectedTool: GateType | null = null;
  private selectedGateId: string | null = null;
  private wiringFrom: { gate: Gate; pin: Pin; pos: Position } | null = null;
  private mouseWorld: Position = { x: 0, y: 0 };
  private isPanning = false;
  private panStart = { x: 0, y: 0 };
  private panCameraStart = { x: 0, y: 0 };
  private dragOffset = { x: 0, y: 0 };
  private placingGhost: Position | null = null;
  private spaceHeld = false;
  private wireColor: string = 'green';
  private undoStack: SerializedCircuit[] = [];
  private redoStack: SerializedCircuit[] = [];

  private readonly handleMouseDown: (e: MouseEvent) => void;
  private readonly handleMouseMove: (e: MouseEvent) => void;
  private readonly handleMouseUp: (e: MouseEvent) => void;
  private readonly handleContextMenu: (e: MouseEvent) => void;
  private readonly handleWheel: (e: WheelEvent) => void;
  private readonly handleKeyDown: (e: KeyboardEvent) => void;
  private readonly handleKeyUp: (e: KeyboardEvent) => void;

  constructor(
    private canvas: HTMLCanvasElement,
    private circuit: Circuit,
    private camera: Camera,
    private callbacks: Callbacks,
    private level?: Level,
    undoStack?: SerializedCircuit[],
    redoStack?: SerializedCircuit[],
  ) {
    if (undoStack) this.undoStack = undoStack;
    if (redoStack) this.redoStack = redoStack;
    this.handleMouseDown = this.onMouseDown.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleMouseUp = this.onMouseUp.bind(this);
    this.handleContextMenu = this.onContextMenu.bind(this);
    this.handleWheel = this.onWheel.bind(this);
    this.handleKeyDown = this.onKeyDown.bind(this);
    this.handleKeyUp = this.onKeyUp.bind(this);

    canvas.addEventListener('mousedown', this.handleMouseDown);
    canvas.addEventListener('mousemove', this.handleMouseMove);
    canvas.addEventListener('mouseup', this.handleMouseUp);
    canvas.addEventListener('contextmenu', this.handleContextMenu);
    canvas.addEventListener('wheel', this.handleWheel, { passive: false });
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  destroy(): void {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.removeEventListener('contextmenu', this.handleContextMenu);
    this.canvas.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  setSelectedTool(tool: GateType | null): void {
    this.selectedTool = tool;
    this.state = tool ? 'placing' : 'idle';
    this.placingGhost = tool ? this.mouseWorld : null;
  }

  setSelectedGateId(id: string | null): void {
    this.selectedGateId = id;
  }

  getState(): InteractionState {
    return this.state;
  }

  getWiringFrom(): { pos: Position } | null {
    return this.wiringFrom ? { pos: this.wiringFrom.pos } : null;
  }

  getMouseWorld(): Position {
    return this.mouseWorld;
  }

  getPlacingGhost(): Position | null {
    return this.placingGhost;
  }

  setWireColor(color: string): void {
    this.wireColor = color;
  }

  getWireColor(): string {
    return this.wireColor;
  }

  private pushUndo(): void {
    this.undoStack.push(this.circuit.serialize());
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack.length = 0;
  }

  undo(): void {
    const snapshot = this.undoStack.pop();
    if (!snapshot) return;
    this.redoStack.push(this.circuit.serialize());
    this.restoreCircuit(snapshot);
  }

  redo(): void {
    const snapshot = this.redoStack.pop();
    if (!snapshot) return;
    this.undoStack.push(this.circuit.serialize());
    this.restoreCircuit(snapshot);
  }

  private restoreCircuit(data: SerializedCircuit): void {
    this.circuit.loadFrom(data);
    this.selectedGateId = null;
    this.callbacks.onSelectGate(null);
    this.callbacks.onCircuitChange();
    this.callbacks.requestRender();
  }

  private screenToWorld(sx: number, sy: number): Position {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (sx - rect.left - this.camera.offsetX) / this.camera.zoom,
      y: (sy - rect.top - this.camera.offsetY) / this.camera.zoom,
    };
  }

  private findPinAt(world: Position): { gate: Gate; pin: Pin } | null {
    for (const gate of this.circuit.getGates()) {
      const gatePos = this.circuit.getGatePosition(gate.id);
      if (!gatePos) continue;
      const allPins = [...gate.outputs, ...gate.inputs];
      for (const pin of allPins) {
        const pinPos = getPinPosition(gate, pin, gatePos);
        const dx = world.x - pinPos.x;
        const dy = world.y - pinPos.y;
        if (dx * dx + dy * dy <= (PIN_RADIUS + 4) * (PIN_RADIUS + 4)) {
          return { gate, pin };
        }
      }
    }
    return null;
  }

  private findGateAt(world: Position): Gate | null {
    const gates = this.circuit.getGates();
    for (let i = gates.length - 1; i >= 0; i--) {
      const gate = gates[i]!;
      const pos = this.circuit.getGatePosition(gate.id);
      if (!pos) continue;
      const bounds = getGateBounds(gate, pos);
      if (
        world.x >= bounds.x &&
        world.x <= bounds.x + bounds.width &&
        world.y >= bounds.y &&
        world.y <= bounds.y + bounds.height
      ) {
        return gate;
      }
    }
    return null;
  }

  private findWireAt(world: Position): Wire | null {
    for (const wire of this.circuit.getWires()) {
      const fromGate = this.circuit.getGate(wire.fromGateId);
      const toGate = this.circuit.getGate(wire.toGateId);
      if (!fromGate || !toGate) continue;

      const fromPos = this.circuit.getGatePosition(wire.fromGateId);
      const toPos = this.circuit.getGatePosition(wire.toGateId);
      if (!fromPos || !toPos) continue;

      const fromPin = fromGate.outputs.find(
        (p) => p.id === wire.fromPinId,
      );
      const toPin = toGate.inputs.find((p) => p.id === wire.toPinId);
      if (!fromPin || !toPin) continue;

      const from = getPinPosition(fromGate, fromPin, fromPos);
      const to = getPinPosition(toGate, toPin, toPos);

      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const cp1x = from.x + 60;
        const cp2x = to.x - 60;
        const bx =
          (1 - t) ** 3 * from.x +
          3 * (1 - t) ** 2 * t * cp1x +
          3 * (1 - t) * t ** 2 * cp2x +
          t ** 3 * to.x;
        const by =
          (1 - t) ** 3 * from.y +
          3 * (1 - t) ** 2 * t * from.y +
          3 * (1 - t) * t ** 2 * to.y +
          t ** 3 * to.y;
        const dx = world.x - bx;
        const dy = world.y - by;
        if (dx * dx + dy * dy < 64) {
          return wire;
        }
      }
    }
    return null;
  }

  private onMouseDown(e: MouseEvent): void {
    const world = this.screenToWorld(e.clientX, e.clientY);
    this.mouseWorld = world;

    if (e.button === 1 || (e.button === 0 && this.spaceHeld)) {
      this.isPanning = true;
      this.panStart = { x: e.clientX, y: e.clientY };
      this.panCameraStart = {
        x: this.camera.offsetX,
        y: this.camera.offsetY,
      };
      e.preventDefault();
      return;
    }

    if (e.button !== 0) return;

    if (this.state === 'placing' && this.selectedTool) {
      if (
        this.level &&
        !this.level.availableGates.includes(this.selectedTool)
      ) {
        return;
      }
      const snapped = {
        x: snapToGrid(world.x),
        y: snapToGrid(world.y),
      };
      this.pushUndo();
      this.circuit.addGate(this.selectedTool, snapped);
      soundManager.gatePlace();
      this.callbacks.onCircuitChange();
      this.callbacks.requestRender();
      return;
    }

    const pinHit = this.findPinAt(world);
    if (pinHit && pinHit.pin.direction === 'output') {
      const gatePos = this.circuit.getGatePosition(pinHit.gate.id);
      if (gatePos) {
        this.state = 'wiring';
        this.wiringFrom = {
          gate: pinHit.gate,
          pin: pinHit.pin,
          pos: getPinPosition(pinHit.gate, pinHit.pin, gatePos),
        };
        this.callbacks.requestRender();
        return;
      }
    }

    if (pinHit && pinHit.pin.direction === 'input') {
      const hasWire = this.circuit
        .getWires()
        .some((w) => w.toPinId === pinHit.pin.id);
      if (!hasWire) {
        pinHit.pin.value = !pinHit.pin.value;
        this.callbacks.onCircuitChange();
        this.callbacks.requestRender();
        return;
      }
    }

    const gateHit = this.findGateAt(world);
    if (gateHit) {
      if (gateHit.type === GateType.INPUT) {
        const outPin = gateHit.outputs[0];
        if (outPin) {
          outPin.value = !outPin.value;
          this.callbacks.onCircuitChange();
          this.callbacks.requestRender();
        }
      }

      this.selectedGateId = gateHit.id;
      this.callbacks.onSelectGate(gateHit.id);
      this.state = 'dragging';
      const gatePos = this.circuit.getGatePosition(gateHit.id);
      if (gatePos) {
        this.dragOffset = {
          x: world.x - gatePos.x,
          y: world.y - gatePos.y,
        };
      }
      this.callbacks.requestRender();
      return;
    }

    this.selectedGateId = null;
    this.callbacks.onSelectGate(null);
    this.callbacks.requestRender();
  }

  private onMouseMove(e: MouseEvent): void {
    const world = this.screenToWorld(e.clientX, e.clientY);
    this.mouseWorld = world;

    if (this.isPanning) {
      this.camera.offsetX =
        this.panCameraStart.x + (e.clientX - this.panStart.x);
      this.camera.offsetY =
        this.panCameraStart.y + (e.clientY - this.panStart.y);
      this.callbacks.requestRender();
      return;
    }

    if (this.state === 'placing') {
      this.placingGhost = {
        x: snapToGrid(world.x),
        y: snapToGrid(world.y),
      };
      this.callbacks.requestRender();
      return;
    }

    if (this.state === 'dragging' && this.selectedGateId) {
      const snapped = {
        x: snapToGrid(world.x - this.dragOffset.x),
        y: snapToGrid(world.y - this.dragOffset.y),
      };
      this.circuit.setGatePosition(this.selectedGateId, snapped);
      this.callbacks.onCircuitChange();
      this.callbacks.requestRender();
      return;
    }

    if (this.state === 'wiring') {
      this.callbacks.requestRender();
    }
  }

  private onMouseUp(e: MouseEvent): void {
    if (this.isPanning) {
      this.isPanning = false;
      return;
    }

    if (this.state === 'wiring' && this.wiringFrom) {
      const world = this.screenToWorld(e.clientX, e.clientY);
      const pinHit = this.findPinAt(world);
      if (
        pinHit &&
        pinHit.pin.direction === 'input' &&
        pinHit.gate.id !== this.wiringFrom.gate.id
      ) {
        try {
          this.pushUndo();
          this.circuit.addWire(this.wiringFrom.pin, pinHit.pin, this.wireColor);
          soundManager.wireConnect();
          this.callbacks.onCircuitChange();
        } catch {
          // already connected or invalid – revert the undo snapshot
          this.undoStack.pop();
        }
      }
      this.wiringFrom = null;
      this.state = this.selectedTool ? 'placing' : 'idle';
      this.callbacks.requestRender();
      return;
    }

    if (this.state === 'dragging') {
      this.state = this.selectedTool ? 'placing' : 'idle';
    }
  }

  private onContextMenu(e: MouseEvent): void {
    e.preventDefault();
    const world = this.screenToWorld(e.clientX, e.clientY);

    const wireHit = this.findWireAt(world);
    if (wireHit) {
      if (this.callbacks.onShowColorPicker) {
        this.callbacks.onShowColorPicker(wireHit.id, e.clientX, e.clientY);
      }
      return;
    }

    const gateHit = this.findGateAt(world);
    if (
      gateHit &&
      gateHit.type !== GateType.INPUT &&
      gateHit.type !== GateType.OUTPUT
    ) {
      this.pushUndo();
      if (this.selectedGateId === gateHit.id) {
        this.selectedGateId = null;
        this.callbacks.onSelectGate(null);
      }
      this.circuit.removeGate(gateHit.id);
      this.callbacks.onCircuitChange();
      this.callbacks.requestRender();
    }
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldBefore = {
      x: (mouseX - this.camera.offsetX) / this.camera.zoom,
      y: (mouseY - this.camera.offsetY) / this.camera.zoom,
    };

    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    this.camera.zoom = Math.max(
      0.25,
      Math.min(3.0, this.camera.zoom * factor),
    );

    this.camera.offsetX = mouseX - worldBefore.x * this.camera.zoom;
    this.camera.offsetY = mouseY - worldBefore.y * this.camera.zoom;

    this.callbacks.requestRender();
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.code === 'Space') {
      this.spaceHeld = true;
      e.preventDefault();
    }

    if (
      (e.code === 'Delete' || e.code === 'Backspace') &&
      this.selectedGateId
    ) {
      const gate = this.circuit.getGate(this.selectedGateId);
      if (
        gate &&
        gate.type !== GateType.INPUT &&
        gate.type !== GateType.OUTPUT
      ) {
        this.pushUndo();
        this.circuit.removeGate(this.selectedGateId);
        this.selectedGateId = null;
        this.callbacks.onSelectGate(null);
        this.callbacks.onCircuitChange();
        this.callbacks.requestRender();
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
      e.preventDefault();
      if (e.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
      return;
    }

    if (e.code === 'Escape') {
      this.selectedTool = null;
      this.state = 'idle';
      this.placingGhost = null;
      this.wiringFrom = null;
      this.selectedGateId = null;
      this.callbacks.onSelectGate(null);
      this.callbacks.requestRender();
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    if (e.code === 'Space') {
      this.spaceHeld = false;
    }
  }
}
