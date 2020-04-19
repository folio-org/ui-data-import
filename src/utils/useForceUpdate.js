import {
  useState,
  useCallback,
} from 'react';

export const useForceUpdate = () => {
  const [, forceUpdate] = useState(0);

  return useCallback(() => {
    forceUpdate(n => n + 1);
  }, []);
};
