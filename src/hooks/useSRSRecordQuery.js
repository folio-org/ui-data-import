import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from '../hooks';

export const useSRSRecordQuery = (recordId, { tenantId } = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'srsRecord' });

  return useQuery(
    {
      queryKey: [namespace, recordId, tenantId],
      queryFn: () => ky.get(`source-storage/records/${recordId}`).json(),
      enabled: !!recordId,
    }
  );
};
