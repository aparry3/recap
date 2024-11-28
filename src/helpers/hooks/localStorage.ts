import { useState, useEffect, useMemo } from "react";

export function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Strict`;
}

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const isBrowser = useMemo(() => !!window && typeof window !== "undefined", [window]);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser) return initialValue; // Return initial value on server
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isBrowser) return;

    // Sync state with localStorage when the key or initial value changes
    try {
      setLoading(false);
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? (JSON.parse(item) as T) : initialValue);
    } catch (error) {
      console.warn(`Error syncing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, isBrowser]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (isBrowser) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, loading] as const;
}

export default useLocalStorage;
