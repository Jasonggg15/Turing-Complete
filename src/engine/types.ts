export type Signal = boolean;

export enum GateType {
  NAND = 'NAND',
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  XOR = 'XOR',
  NOR = 'NOR',
  XNOR = 'XNOR',
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  D_FLIPFLOP = 'D_FLIPFLOP',
  HALF_ADDER = 'HALF_ADDER',
  FULL_ADDER = 'FULL_ADDER',
}

export interface Pin {
  readonly id: string;
  readonly gateId: string;
  readonly name: string;
  readonly direction: 'input' | 'output';
  value: Signal | undefined;
}

export interface GateConfig {
  type: GateType;
  id?: string;
  label?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface SerializedGate {
  type: GateType;
  id: string;
  position: Position;
  label?: string;
}

export interface SerializedWire {
  id: string;
  fromPinId: string;
  toPinId: string;
  color?: string;
  waypoints?: Position[];
  /** @deprecated Use fromPinId. Kept for backward-compatible deserialization. */
  from?: string;
  /** @deprecated Use toPinId. Kept for backward-compatible deserialization. */
  to?: string;
}

export interface SerializedCircuit {
  gates: SerializedGate[];
  wires: SerializedWire[];
}

/** Parse a pin ID ("gateId:pinName") into its components. Uses lastIndexOf to handle gate IDs containing colons. */
export function parsePinId(pinId: string): { gateId: string; pinName: string } | null {
  const i = pinId.lastIndexOf(':');
  if (i === -1) return null;
  return { gateId: pinId.substring(0, i), pinName: pinId.substring(i + 1) };
}
