import type { SerializedCircuit } from '../engine/types';
import { loadData, saveData } from './Storage';

interface LevelNode {
  id: string;
  unlocks?: string[];
}

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

export function saveCircuit(levelId: string, circuit: SerializedCircuit): void {
  const data = getSaveData();
  data.circuits[levelId] = circuit;
  saveData('save', data);
}

export function loadCircuit(levelId: string): SerializedCircuit | undefined {
  const data = getSaveData();
  return data.circuits[levelId];
}

export function isLevelUnlocked(
  levelId: string,
  allLevels: LevelNode[],
): boolean {
  if (levelId === '01-crude-awakening') return true;
  const completed = getCompletedLevels();
  return allLevels.some(
    (l) =>
      completed.includes(l.id) &&
      l.unlocks !== undefined &&
      l.unlocks.includes(levelId),
  );
}

export function uncompleteLevel(levelId: string): void {
  const data = getSaveData();
  data.completedLevels = data.completedLevels.filter((id) => id !== levelId);
  delete data.circuits[levelId];
  saveData('save', data);
}

export function clearOutOfOrderProgress(allLevels: LevelNode[]): string[] {
  const data = getSaveData();
  if (data.completedLevels.length === 0) return [];

  const validCompleted = new Set<string>();
  const queue: string[] = [];

  if (data.completedLevels.includes('01-crude-awakening')) {
    validCompleted.add('01-crude-awakening');
    queue.push('01-crude-awakening');
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const level = allLevels.find((l) => l.id === current);
    if (!level?.unlocks) continue;

    for (const unlockedId of level.unlocks) {
      if (
        data.completedLevels.includes(unlockedId) &&
        !validCompleted.has(unlockedId)
      ) {
        validCompleted.add(unlockedId);
        queue.push(unlockedId);
      }
    }
  }

  const outOfOrder = data.completedLevels.filter(
    (id) => !validCompleted.has(id),
  );

  if (outOfOrder.length > 0) {
    data.completedLevels = data.completedLevels.filter((id) =>
      validCompleted.has(id),
    );
    for (const id of outOfOrder) {
      delete data.circuits[id];
    }
    saveData('save', data);
  }

  return outOfOrder;
}
