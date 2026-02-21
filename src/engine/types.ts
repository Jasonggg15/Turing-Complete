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
  from: string;
  to: string;
}

export interface SerializedCircuit {
  gates: SerializedGate[];
  wires: SerializedWire[];
}
