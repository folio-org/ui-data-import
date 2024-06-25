import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useSRSRecordQuery = (recordId, { tenant } = {}) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'srsRecord' });

  return useQuery(
    {
      queryKey: [namespace, recordId, tenant],
      queryFn: () => ky.get(`source-storage/records/${recordId}`).json(),
      enabled: !!recordId,
    }
  );
};
