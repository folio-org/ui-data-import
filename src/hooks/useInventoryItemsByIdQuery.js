import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

export const useInventoryItemsByIdQuery = (itemsIds = [], { tenantId } = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'itemsById' });

  const queryIds = itemsIds.join(' or ');

  const query = useQuery(
    {
      queryKey: [namespace, queryIds, tenantId],
      queryFn: () => ky.get(`inventory/items?query=id==(${queryIds})`).json(),
      enabled: !!queryIds,
    }
  );

  return {
    ...query,
    data: query.data?.items,
  };
};
