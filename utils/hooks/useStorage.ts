import { useCallback, useEffect, useState } from "react";
import localforage from "localforage";

const useStorage = <T>(
  key: string
  // eslint-disable-next-line no-unused-vars
): [T | undefined, (value: T) => void, boolean] => {
  const [isLoading, setIsLoading] = useState(true);
  const [storedValue, setStoredValue] = useState<T>();

  const getFromStorage = useCallback(async () => {
    const item: any = await localforage.getItem(key);
    if (item) {
      setStoredValue(JSON.parse(item));
    }
  }, [key]);

  const setValue = useCallback(
    (value: T) => {
      // Save state
      setStoredValue(value);
      // Save to localStorage
      localforage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  useEffect(() => {
    getFromStorage().then(() => setIsLoading(false));
  }, [getFromStorage]);

  return [storedValue, setValue, isLoading];
};

export default useStorage;
