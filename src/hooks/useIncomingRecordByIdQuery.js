import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

export const useIncomingRecordByIdQuery = (incomingRecordId, { tenant } = {}) => {
  const ky = useTenantKy({ tenant });
  const [namespace] = useNamespace({ key: 'incomingRecordById' });

  const query = useQuery(
    {
      queryKey: [namespace, incomingRecordId, tenant],
      queryFn: () => ky.get(`metadata-provider/incomingRecords/${incomingRecordId}`).json(),
      enabled: !!incomingRecordId,
    }
  );

  return {
    ...query,
    data: query.data?.parsedRecordContent,
  };
};
