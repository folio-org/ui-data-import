import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

export const useInventoryInstancesByIdQuery = (instancesIds = [], { tenantId } = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'instancesById' });

  const queryIds = instancesIds.join(' or ');

  const query = useQuery(
    {
      queryKey: [namespace, queryIds, tenantId],
      queryFn: () => ky.get(`inventory/instances?query=id==(${queryIds})`).json(),
      enabled: !!queryIds,
    }
  );

  return {
    ...query,
    data: query.data?.instances,
  };
};
