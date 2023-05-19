import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy
} from '@folio/stripes/core';

export const useSRSRecordQuery = recordId => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'srsRecord' });

  return useQuery(
    [namespace, recordId],
    () => ky.get(`source-storage/records/${recordId}`).json(),
    { enabled: Boolean(recordId) },
  );
};
