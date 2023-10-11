import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

export const useInventoryHoldingsByIdQuery = (holdingsIds = [], { tenantId } = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'holdingsById' });

  const queryIds = holdingsIds.join(' or ');

  const query = useQuery(
    {
      queryKey: [namespace, queryIds, tenantId],
      queryFn: () => ky.get(`holdings-storage/holdings?query=id==(${queryIds})`).json(),
      enabled: !!queryIds,
    }
  );

  return {
    ...query,
    data: query.data?.holdingsRecords,
  };
};
