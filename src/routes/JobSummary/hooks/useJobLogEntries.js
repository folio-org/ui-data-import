import { useOkapiKy } from '@folio/stripes/core';
import { useEffect, useState } from 'react';
import { noop } from 'lodash';

export function useJobLogEntries({ jobExecutionsId, limit, offset }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const ky = useOkapiKy();

  useEffect(() => {
    if (!jobExecutionsId) return;
    async function fetchJobLogEntries() {
      setIsLoading(true);

      try {
        const response = await ky.get(`metadata-provider/jobLogEntries/${jobExecutionsId}`, { searchParams: { limit, offset } }).json();
        setData(response);
        setIsLoading(false);
      } catch (e) {
        console.warn({ e });
        setIsLoading(false);
      }
    }

    fetchJobLogEntries().then(noop);
  }, [jobExecutionsId, limit, offset]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading };
}
