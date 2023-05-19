import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useJobLogRecordsQuery = (logId, recordId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'jobLogRecords' });

  return useQuery(
    [namespace, logId, recordId],
    () => ky.get(`metadata-provider/jobLogEntries/${logId}/records/${recordId}`).json(),
    { enabled: Boolean(logId && recordId) },
  );
};
