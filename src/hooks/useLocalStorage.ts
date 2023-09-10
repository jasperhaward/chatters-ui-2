import { useState } from "preact/hooks";

export type UseLocalStorage<T> = [
  value: T | null,
  setStoredValue: (value: T | null) => void
];

export function useLocalStorage<T>(key: string): UseLocalStorage<T> {
  const [value, setValue] = useState(initialiser);

  function initialiser() {
    const initialValue = localStorage.getItem(key);

    if (!initialValue) {
      return null;
    } else {
      return JSON.parse(initialValue) as T;
    }
  }

  function setStoredValue(value: T | null) {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }

    setValue(value);
  }

  return [value, setStoredValue];
}
