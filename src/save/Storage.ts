const PREFIX = 'turing-complete';

export function loadData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}:${key}`);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveData<T>(key: string, data: T): void {
  localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(data));
}
