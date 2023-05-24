import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useJobLogRecordsQuery = (logId, recordId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'jobLogRecords' });

  return useQuery(
    {
      queryKey: [namespace, logId, recordId],
      queryFn: () => ky.get(`metadata-provider/jobLogEntries/${logId}/records/${recordId}`).json(),
      enabled: !!(logId && recordId),
    }
  );
};
