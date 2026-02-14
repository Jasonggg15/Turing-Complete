import { GateType } from '../engine/types';

export interface PinDefinition {
  name: string;
}

export interface TruthTableEntry {
  inputs: Record<string, boolean>;
  outputs: Record<string, boolean>;
}

export interface LevelResult {
  passed: boolean;
  results: Array<{
    inputs: Record<string, boolean>;
    outputs: Record<string, boolean>;
    expected: Record<string, boolean>;
    pass: boolean;
  }>;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  availableGates: GateType[];
  inputs: PinDefinition[];
  outputs: PinDefinition[];
  truthTable: TruthTableEntry[];
  hints?: string[];
  unlocks?: string[];
}
