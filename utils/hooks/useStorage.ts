import { useCallback, useEffect, useState } from "react";
import localforage from "localforage";

const useStorage = <T>(
  key: string
  // eslint-disable-next-line no-unused-vars
): {
  storedValue: T | undefined;
  setValue: (value: T) => void;
  isLoading: boolean;
  rawGet: () => Promise<T | null>;
} => {
  const [isLoading, setIsLoading] = useState(true);
  const [storedValue, setStoredValue] = useState<T>();

  const rawGet = useCallback(async () => {
    return await localforage.getItem<T>(key);
  }, [key]);

  const getFromStorage = useCallback(async () => {
    const item = await localforage.getItem<T>(key);
    if (item) {
      setStoredValue(item);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T) => {
      // Save state
      setStoredValue(value);
      // Save to localStorage
      localforage.setItem(key, value);
    },
    [key]
  );

  useEffect(() => {
    getFromStorage().then(() => setIsLoading(false));
  }, [getFromStorage]);

  return {
    storedValue,
    setValue,
    isLoading,
    rawGet,
  };
};

export default useStorage;
