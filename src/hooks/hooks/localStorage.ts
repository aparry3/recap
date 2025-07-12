import { AppPage } from "@/app/[path]/App";
import { Tab } from "@/app/[path]/components/Pages/Gallery";
import { useState, useEffect, useMemo } from "react";

export function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Strict`;
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
}

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const isBrowser = typeof window !== "undefined"

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

export const useNavigationState = (): {page: AppPage, tab: Tab, setPage: (page: AppPage) => void, setTab: (tab: Tab) => void, reset: () => void} => {
  const [page, setPage] = useLocalStorage<AppPage>('page', AppPage.HOME)
  const [tab, setTab] = useLocalStorage<Tab>('tab', Tab.PHOTOS)

  const reset = () => {
    setPage(AppPage.HOME)
    setTab(Tab.PHOTOS)
  }

  const setPageAndTab = (page: AppPage) => {
    setPage(page)
    setTab(Tab.PHOTOS)
  }
  return {page, tab, setTab, setPage: setPageAndTab, reset}
}




export default useLocalStorage;
