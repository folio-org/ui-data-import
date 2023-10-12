import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

export const useSRSRecordQuery = (recordId, { tenant } = {}) => {
  const ky = useTenantKy({ tenant });
  const [namespace] = useNamespace({ key: 'srsRecord' });

  return useQuery(
    {
      queryKey: [namespace, recordId, tenant],
      queryFn: () => ky.get(`source-storage/records/${recordId}`).json(),
      enabled: !!recordId,
    }
  );
};
