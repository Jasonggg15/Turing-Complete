import type { Pin, Position } from './types';

export class Wire {
  readonly id: string;
  readonly fromPinId: string;
  readonly toPinId: string;
  readonly fromGateId: string;
  readonly toGateId: string;
  color: string;
  waypoints: Position[];

  constructor(from: Pin, to: Pin, id?: string, color?: string, waypoints?: Position[]) {
    if (from.direction !== 'output') {
      throw new Error(
        `Wire source must be an output pin, got ${from.direction} pin "${from.id}"`,
      );
    }
    if (to.direction !== 'input') {
      throw new Error(
        `Wire target must be an input pin, got ${to.direction} pin "${to.id}"`,
      );
    }

    this.id = id ?? crypto.randomUUID();
    this.fromPinId = from.id;
    this.toPinId = to.id;
    this.fromGateId = from.gateId;
    this.toGateId = to.gateId;
    this.color = color ?? 'green';
    this.waypoints = waypoints ? waypoints.map(p => ({ ...p })) : [];
  }
}
