export function loadStorageData<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(`siakad_guru_${key}`);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
}

export function saveStorageData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`siakad_guru_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function clearAllStorageData(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('siakad_guru_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
