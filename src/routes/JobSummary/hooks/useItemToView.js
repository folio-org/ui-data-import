import { useCallback, useState } from 'react';

export function useItemToView(key) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(error.message);
      return null;
    }
  });

  const setItemToView = useCallback((value) => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      }
      setStoredValue(value);
    } catch (error) {
      console.warn(error.message);
    }
  }, [key, setStoredValue]);

  const deleteItemToView = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
      setStoredValue(null);
    } catch (error) {
      console.warn(error.message);
    }
  }, [key, setStoredValue]);

  return { itemToView: storedValue, setItemToView, deleteItemToView };
}
