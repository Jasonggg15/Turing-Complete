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
import { hitTestOrthoWire } from './WireRenderer';
import type { Level } from '../levels/Level';
import { soundManager } from './SoundManager';
import type { SerializedCircuit } from '../engine/types';

type InteractionState =
  | 'idle'
  | 'placing'
  | 'dragging'
  | 'wiring'
  | 'box-selecting'
  | 'dragging-selection';

export interface RadialMenuItem {
  type: GateType;
  label: string;
  angle: number;
  x: number;
  y: number;
}

export interface RadialMenuState {
  screenX: number;
  screenY: number;
  items: RadialMenuItem[];
  hoveredIndex: number;
}

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Callbacks {
  onCircuitChange: () => void;
  onSelectGate: (id: string | null) => void;
  requestRender: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onShowColorPicker?: (wireId: string, screenX: number, screenY: number) => void;
  onToolChange?: (tool: GateType | null) => void;
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

  // Box selection
  private boxStart: Position | null = null;
  private selectionRect: SelectionRect | null = null;
  private selectedGateIds: Set<string> = new Set();
  private selectedWireIds: Set<string> = new Set();
  private dragSelectionStart: Map<string, Position> = new Map();

  // Radial menu
  private radialMenu: RadialMenuState | null = null;
  private radialMenuActive = false;

  // Clipboard
  private clipboard: SerializedCircuit | null = null;

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

  getSelectionRect(): SelectionRect | null {
    return this.selectionRect;
  }

  getSelectedGateIds(): Set<string> {
    return this.selectedGateIds;
  }

  getSelectedWireIds(): Set<string> {
    return this.selectedWireIds;
  }

  getRadialMenu(): RadialMenuState | null {
    return this.radialMenu;
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
    this.selectedGateIds.clear();
    this.selectedWireIds.clear();
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

      const fromPin = fromGate.outputs.find((p) => p.id === wire.fromPinId);
      const toPin = toGate.inputs.find((p) => p.id === wire.toPinId);
      if (!fromPin || !toPin) continue;

      const from = getPinPosition(fromGate, fromPin, fromPos);
      const to = getPinPosition(toGate, toPin, toPos);

      if (hitTestOrthoWire(from, to, world, 8)) {
        return wire;
      }
    }
    return null;
  }

  private clearSelection(): void {
    this.selectedGateIds.clear();
    this.selectedWireIds.clear();
    this.selectedGateId = null;
    this.callbacks.onSelectGate(null);
  }

  private isGateInRect(gate: Gate, rect: SelectionRect): boolean {
    const pos = this.circuit.getGatePosition(gate.id);
    if (!pos) return false;
    const bounds = getGateBounds(gate, pos);
    const rx = rect.width < 0 ? rect.x + rect.width : rect.x;
    const ry = rect.height < 0 ? rect.y + rect.height : rect.y;
    const rw = Math.abs(rect.width);
    const rh = Math.abs(rect.height);
    return (
      bounds.x < rx + rw &&
      bounds.x + bounds.width > rx &&
      bounds.y < ry + rh &&
      bounds.y + bounds.height > ry
    );
  }

  private buildRadialMenu(screenX: number, screenY: number): void {
    const gates = this.level ? this.level.availableGates : Object.values(GateType).filter(
      (t) => t !== GateType.INPUT && t !== GateType.OUTPUT,
    );
    if (gates.length === 0) return;

    const radius = 80;
    const items: RadialMenuItem[] = gates.map((type, i) => {
      const angle = (i / gates.length) * Math.PI * 2 - Math.PI / 2;
      return {
        type,
        label: type === GateType.HALF_ADDER ? 'HA' : type === GateType.FULL_ADDER ? 'FA' : type,
        angle,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });

    this.radialMenu = { screenX, screenY, items, hoveredIndex: -1 };
    this.radialMenuActive = true;
    this.callbacks.requestRender();
  }

  private updateRadialMenuHover(screenX: number, screenY: number): void {
    if (!this.radialMenu) return;
    const dx = screenX - this.radialMenu.screenX;
    const dy = screenY - this.radialMenu.screenY;
    const dist = Math.hypot(dx, dy);

    if (dist < 25) {
      this.radialMenu.hoveredIndex = -1;
    } else {
      const angle = Math.atan2(dy, dx);
      let bestIdx = -1;
      let bestDiff = Infinity;
      for (let i = 0; i < this.radialMenu.items.length; i++) {
        let diff = Math.abs(angle - this.radialMenu.items[i]!.angle);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = i;
        }
      }
      this.radialMenu.hoveredIndex = bestIdx;
    }
    this.callbacks.requestRender();
  }

  private closeRadialMenu(): GateType | null {
    if (!this.radialMenu) return null;
    const idx = this.radialMenu.hoveredIndex;
    const selected = idx >= 0 ? this.radialMenu.items[idx]?.type ?? null : null;
    this.radialMenu = null;
    this.radialMenuActive = false;
    this.callbacks.requestRender();
    return selected;
  }

  private deleteSelection(): void {
    if (this.selectedGateIds.size === 0 && this.selectedWireIds.size === 0) return;
    this.pushUndo();
    for (const wireId of this.selectedWireIds) {
      try { this.circuit.removeWire(wireId); } catch { /* already removed */ }
    }
    for (const gateId of this.selectedGateIds) {
      const gate = this.circuit.getGate(gateId);
      if (gate && gate.type !== GateType.INPUT && gate.type !== GateType.OUTPUT) {
        this.circuit.removeGate(gateId);
      }
    }
    this.clearSelection();
    this.callbacks.onCircuitChange();
    this.callbacks.requestRender();
  }

  private copySelection(): void {
    if (this.selectedGateIds.size === 0) return;
    const fullData = this.circuit.serialize();
    const gateIds = this.selectedGateIds;
    const gates = fullData.gates.filter(
      (g) => gateIds.has(g.id) && g.type !== GateType.INPUT && g.type !== GateType.OUTPUT,
    );
    const gateIdSet = new Set(gates.map((g) => g.id));
    const wires = fullData.wires.filter((w) => {
      const fromGateId = w.from.substring(0, w.from.indexOf(':'));
      const toGateId = w.to.substring(0, w.to.indexOf(':'));
      return gateIdSet.has(fromGateId) && gateIdSet.has(toGateId);
    });
    if (gates.length === 0) return;
    this.clipboard = { gates, wires };
  }

  private pasteClipboard(): void {
    if (!this.clipboard || this.clipboard.gates.length === 0) return;
    this.pushUndo();

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const g of this.clipboard.gates) {
      minX = Math.min(minX, g.position.x);
      minY = Math.min(minY, g.position.y);
      maxX = Math.max(maxX, g.position.x);
      maxY = Math.max(maxY, g.position.y);
    }
    const offsetX = snapToGrid(this.mouseWorld.x) - (minX + maxX) / 2;
    const offsetY = snapToGrid(this.mouseWorld.y) - (minY + maxY) / 2;

    const idMap = new Map<string, string>();
    const newGateIds: string[] = [];

    for (const sg of this.clipboard.gates) {
      const newGate = this.circuit.addGate(sg.type, {
        x: sg.position.x + offsetX,
        y: sg.position.y + offsetY,
      }, sg.label);
      idMap.set(sg.id, newGate.id);
      newGateIds.push(newGate.id);
    }

    for (const sw of this.clipboard.wires) {
      const fromGateId = sw.from.substring(0, sw.from.indexOf(':'));
      const fromPinName = sw.from.substring(sw.from.indexOf(':') + 1);
      const toGateId = sw.to.substring(0, sw.to.indexOf(':'));
      const toPinName = sw.to.substring(sw.to.indexOf(':') + 1);
      const newFromId = idMap.get(fromGateId);
      const newToId = idMap.get(toGateId);
      if (!newFromId || !newToId) continue;
      const newFromGate = this.circuit.getGate(newFromId);
      const newToGate = this.circuit.getGate(newToId);
      if (!newFromGate || !newToGate) continue;
      const fromPin = newFromGate.outputs.find((p) => p.name === fromPinName);
      const toPin = newToGate.inputs.find((p) => p.name === toPinName);
      if (!fromPin || !toPin) continue;
      try { this.circuit.addWire(fromPin, toPin, sw.color); } catch { /* skip */ }
    }

    this.clearSelection();
    for (const id of newGateIds) this.selectedGateIds.add(id);
    this.callbacks.onCircuitChange();
    this.callbacks.requestRender();
  }

  private onMouseDown(e: MouseEvent): void {
    const world = this.screenToWorld(e.clientX, e.clientY);
    this.mouseWorld = world;

    if (e.button === 1 || (e.button === 0 && this.spaceHeld)) {
      this.isPanning = true;
      this.panStart = { x: e.clientX, y: e.clientY };
      this.panCameraStart = { x: this.camera.offsetX, y: this.camera.offsetY };
      e.preventDefault();
      return;
    }

    if (e.button === 2) return; // handled in contextmenu

    if (e.button !== 0) return;

    // Close radial menu on left click
    if (this.radialMenu) {
      const selected = this.closeRadialMenu();
      if (selected) {
        this.setSelectedTool(selected);
        this.callbacks.onToolChange?.(selected);
      }
      return;
    }

    // #6: Placing mode — place one gate then return to pointer
    if (this.state === 'placing' && this.selectedTool) {
      if (this.level && !this.level.availableGates.includes(this.selectedTool)) return;
      const snapped = { x: snapToGrid(world.x), y: snapToGrid(world.y) };
      this.pushUndo();
      this.circuit.addGate(this.selectedTool, snapped);
      soundManager.gatePlace();
      this.callbacks.onCircuitChange();
      this.selectedTool = null;
      this.state = 'idle';
      this.placingGhost = null;
      this.callbacks.onToolChange?.(null);
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
      const hasWire = this.circuit.getWires().some((w) => w.toPinId === pinHit.pin.id);
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

      // Multi-selection drag
      if (this.selectedGateIds.has(gateHit.id) && this.selectedGateIds.size > 1) {
        this.pushUndo(); // #7
        this.state = 'dragging-selection';
        this.dragOffset = { x: world.x, y: world.y };
        this.dragSelectionStart.clear();
        for (const id of this.selectedGateIds) {
          const pos = this.circuit.getGatePosition(id);
          if (pos) this.dragSelectionStart.set(id, { ...pos });
        }
        this.callbacks.requestRender();
        return;
      }

      // Single gate select + drag
      this.clearSelection();
      this.selectedGateId = gateHit.id;
      this.selectedGateIds.add(gateHit.id);
      this.callbacks.onSelectGate(gateHit.id);
      this.pushUndo(); // #7
      this.state = 'dragging';
      const gatePos = this.circuit.getGatePosition(gateHit.id);
      if (gatePos) {
        this.dragOffset = { x: world.x - gatePos.x, y: world.y - gatePos.y };
      }
      this.callbacks.requestRender();
      return;
    }

    // Click wire to select it
    const wireHit = this.findWireAt(world);
    if (wireHit) {
      this.clearSelection();
      this.selectedWireIds.add(wireHit.id);
      this.callbacks.requestRender();
      return;
    }

    // Empty space — start box selection (#2)
    this.clearSelection();
    this.state = 'box-selecting';
    this.boxStart = { ...world };
    this.selectionRect = { x: world.x, y: world.y, width: 0, height: 0 };
    this.callbacks.requestRender();
  }

  private onMouseMove(e: MouseEvent): void {
    const world = this.screenToWorld(e.clientX, e.clientY);
    this.mouseWorld = world;

    if (this.radialMenuActive && this.radialMenu) {
      this.updateRadialMenuHover(e.clientX, e.clientY);
      return;
    }

    if (this.isPanning) {
      this.camera.offsetX = this.panCameraStart.x + (e.clientX - this.panStart.x);
      this.camera.offsetY = this.panCameraStart.y + (e.clientY - this.panStart.y);
      this.callbacks.requestRender();
      return;
    }

    if (this.state === 'placing') {
      this.placingGhost = { x: snapToGrid(world.x), y: snapToGrid(world.y) };
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

    if (this.state === 'dragging-selection') {
      const dx = world.x - this.dragOffset.x;
      const dy = world.y - this.dragOffset.y;
      for (const id of this.selectedGateIds) {
        const startPos = this.dragSelectionStart.get(id);
        if (startPos) {
          this.circuit.setGatePosition(id, {
            x: snapToGrid(startPos.x + dx),
            y: snapToGrid(startPos.y + dy),
          });
        }
      }
      this.callbacks.onCircuitChange();
      this.callbacks.requestRender();
      return;
    }

    if (this.state === 'box-selecting' && this.boxStart) {
      this.selectionRect = {
        x: this.boxStart.x,
        y: this.boxStart.y,
        width: world.x - this.boxStart.x,
        height: world.y - this.boxStart.y,
      };
      this.selectedGateIds.clear();
      this.selectedWireIds.clear();
      for (const gate of this.circuit.getGates()) {
        if (this.isGateInRect(gate, this.selectionRect)) {
          this.selectedGateIds.add(gate.id);
        }
      }
      // Select wires where both endpoints are selected
      for (const wire of this.circuit.getWires()) {
        if (this.selectedGateIds.has(wire.fromGateId) && this.selectedGateIds.has(wire.toGateId)) {
          this.selectedWireIds.add(wire.id);
        }
      }
      this.callbacks.requestRender();
      return;
    }

    if (this.state === 'wiring') {
      this.callbacks.requestRender();
    }
  }

  private onMouseUp(e: MouseEvent): void {
    if (e.button === 2) {
      if (this.radialMenuActive && this.radialMenu) {
        const selected = this.closeRadialMenu();
        if (selected) {
          this.setSelectedTool(selected);
          this.callbacks.onToolChange?.(selected);
        }
      }
      return;
    }

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
          this.undoStack.pop();
        }
      }
      this.wiringFrom = null;
      this.state = this.selectedTool ? 'placing' : 'idle';
      this.callbacks.requestRender();
      return;
    }

    if (this.state === 'box-selecting') {
      this.state = 'idle';
      this.selectionRect = null;
      this.boxStart = null;
      if (this.selectedGateIds.size === 1) {
        const id = [...this.selectedGateIds][0]!;
        this.selectedGateId = id;
        this.callbacks.onSelectGate(id);
      }
      this.callbacks.requestRender();
      return;
    }

    if (this.state === 'dragging') {
      this.state = this.selectedTool ? 'placing' : 'idle';
    }

    if (this.state === 'dragging-selection') {
      this.state = 'idle';
      this.dragSelectionStart.clear();
    }
  }

  // #3 + #4: Right-click shows radial menu or wire color picker (no more right-click delete)
  private onContextMenu(e: MouseEvent): void {
    e.preventDefault();
    const world = this.screenToWorld(e.clientX, e.clientY);

    // Right-click on wire → color picker
    const wireHit = this.findWireAt(world);
    if (wireHit) {
      if (this.callbacks.onShowColorPicker) {
        this.callbacks.onShowColorPicker(wireHit.id, e.clientX, e.clientY);
      }
      return;
    }

    // Right-click on empty space or gate → radial menu (#3)
    this.buildRadialMenu(e.clientX, e.clientY);
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
    this.camera.zoom = Math.max(0.25, Math.min(3.0, this.camera.zoom * factor));

    this.camera.offsetX = mouseX - worldBefore.x * this.camera.zoom;
    this.camera.offsetY = mouseY - worldBefore.y * this.camera.zoom;

    this.callbacks.requestRender();
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.code === 'Space') {
      this.spaceHeld = true;
      e.preventDefault();
    }

    // #4: Delete/Backspace deletes selection
    if (e.code === 'Delete' || e.code === 'Backspace') {
      if (this.selectedGateIds.size > 0 || this.selectedWireIds.size > 0) {
        this.deleteSelection();
        return;
      }
      if (this.selectedGateId) {
        const gate = this.circuit.getGate(this.selectedGateId);
        if (gate && gate.type !== GateType.INPUT && gate.type !== GateType.OUTPUT) {
          this.pushUndo();
          this.circuit.removeGate(this.selectedGateId);
          this.selectedGateId = null;
          this.callbacks.onSelectGate(null);
          this.callbacks.onCircuitChange();
          this.callbacks.requestRender();
        }
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
      e.preventDefault();
      if (e.shiftKey) { this.redo(); } else { this.undo(); }
      return;
    }

    // #5: Copy/Paste
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyC') {
      e.preventDefault();
      this.copySelection();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyV') {
      e.preventDefault();
      this.pasteClipboard();
      return;
    }

    if (e.code === 'Escape') {
      if (this.radialMenu) { this.closeRadialMenu(); return; }
      this.selectedTool = null;
      this.state = 'idle';
      this.placingGhost = null;
      this.wiringFrom = null;
      this.clearSelection();
      this.callbacks.onToolChange?.(null);
      this.callbacks.requestRender();
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    if (e.code === 'Space') {
      this.spaceHeld = false;
    }
  }
}
