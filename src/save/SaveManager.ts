import type { SerializedCircuit } from '../engine/types';
import { loadData, saveData } from './Storage';

interface LevelNode {
  id: string;
  prerequisites?: string[];
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

/**
 * A level is unlocked when ALL its prerequisites are completed.
 * Levels with no prerequisites (roots) are always unlocked.
 */
export function isLevelUnlocked(
  levelId: string,
  allLevels: LevelNode[],
): boolean {
  const level = allLevels.find((l) => l.id === levelId);
  if (!level) return false;

  // Levels with no prerequisites are always unlocked
  if (!level.prerequisites || level.prerequisites.length === 0) return true;

  const completed = getCompletedLevels();
  return level.prerequisites.every((prereqId) => completed.includes(prereqId));
}

export function uncompleteLevel(levelId: string): void {
  const data = getSaveData();
  data.completedLevels = data.completedLevels.filter((id) => id !== levelId);
  delete data.circuits[levelId];
  saveData('save', data);
}

/**
 * Validate completed levels follow the prerequisite DAG.
 * A level is valid if all its prerequisites are also in the completed set.
 */
export function clearOutOfOrderProgress(allLevels: LevelNode[]): string[] {
  const data = getSaveData();
  if (data.completedLevels.length === 0) return [];

  const levelMap = new Map<string, LevelNode>();
  allLevels.forEach((l) => levelMap.set(l.id, l));

  const validCompleted = new Set<string>();

  // Iteratively validate: a level is valid if all prerequisites are valid
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of data.completedLevels) {
      if (validCompleted.has(id)) continue;
      const level = levelMap.get(id);
      if (!level) continue;

      const prereqs = level.prerequisites ?? [];
      if (prereqs.length === 0 || prereqs.every((p) => validCompleted.has(p))) {
        validCompleted.add(id);
        changed = true;
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
