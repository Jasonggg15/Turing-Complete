import type { SerializedCircuit } from '../engine/types';
import { loadData, saveData } from './Storage';

interface SaveData {
  completedLevels: string[];
  circuits: Record<string, SerializedCircuit>;
}

function getSaveData(): SaveData {
  return loadData<SaveData>('save') ?? { completedLevels: [], circuits: {} };
}

export function getCompletedLevels(): string[] {
  return getSaveData().completedLevels;
}

export function isLevelCompleted(levelId: string): boolean {
  return getSaveData().completedLevels.includes(levelId);
}

export function completeLevel(levelId: string): void {
  const data = getSaveData();
  if (!data.completedLevels.includes(levelId)) {
    data.completedLevels.push(levelId);
    saveData('save', data);
  }
}

export function saveCircuit(
  levelId: string,
  circuit: SerializedCircuit,
): void {
  const data = getSaveData();
  data.circuits[levelId] = circuit;
  saveData('save', data);
}

export function loadCircuit(
  levelId: string,
): SerializedCircuit | undefined {
  const data = getSaveData();
  return data.circuits[levelId];
}
