import { GateType } from '../engine/types';

export type LevelSection =
  | 'Basic Logic'
  | 'Arithmetic'
  | 'Memory'
  | 'CPU Architecture'
  | 'Programming'
  | 'CPU Architecture 2'
  | 'Functions'
  | 'Assembly Challenges';

export type LevelType = 'circuit' | 'minigame';

export interface PinDefinition {
  name: string;
}

export interface TruthTableEntry {
  inputs: Record<string, boolean>;
  outputs: Record<string, boolean>;
}

export interface TestSequenceStep {
  inputs: Record<string, boolean>;
  outputs: Record<string, boolean>;
}

export interface LevelResult {
  passed: boolean;
  results: Array<{
    tick?: number;
    inputs: Record<string, boolean>;
    outputs: Record<string, boolean>;
    expected: Record<string, boolean>;
    pass: boolean;
  }>;
}

export interface Level {
  id: string;
  name: string;
  section: LevelSection;
  description: string;
  type?: LevelType;
  availableGates: GateType[];
  inputs: PinDefinition[];
  outputs: PinDefinition[];
  truthTable: TruthTableEntry[];
  /** Sequential test: array of steps evaluated tick-by-tick. */
  testSequence?: TestSequenceStep[];
  hints?: string[];
  unlocks?: string[];
  maxGates?: number;
}
