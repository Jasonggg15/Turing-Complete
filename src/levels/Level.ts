import { GateType } from '../engine/types';

export type LevelSection =
  | 'Basic Logic'
  | 'Arithmetic and Memory'
  | 'CPU Architecture'
  | 'Programming'
  | 'CPU Architecture 2'
  | 'Functions'
  | 'Assembly Challenges';

export type LevelType = 'circuit' | 'programming';

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

export interface ProgramTestCase {
  name: string;
  input: number[];
  expectedOutput: number[];
  initialMemory?: Record<number, number>;
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
  /** Level IDs that must ALL be completed before this level unlocks. */
  prerequisites?: string[];
  maxGates?: number;
  /** For programming levels: available assembly instructions. */
  availableInstructions?: string[];
  /** For programming levels: test cases with input/output values. */
  programTestCases?: ProgramTestCase[];
}
