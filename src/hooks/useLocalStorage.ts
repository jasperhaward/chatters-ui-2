import { useState } from "preact/hooks";

export type UseLocalStorage<T> = [value: T, setValue: (value: T) => void];

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): UseLocalStorage<T> {
  const [value, setValue] = useState(initialiser);

  function initialiser() {
    const initialValue = localStorage.getItem(key);

    if (!initialValue) {
      return defaultValue;
    } else {
      try {
        return JSON.parse(initialValue) as T;
      } catch {
        return defaultValue;
      }
    }
  }

  function setStoredValue(value: T) {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }

    setValue(value);
  }

  return [value, setStoredValue];
}
