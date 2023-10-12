import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

export const useInventoryInstancesByIdQuery = (instancesIds = [], { tenant } = {}) => {
  const ky = useTenantKy({ tenant });
  const [namespace] = useNamespace({ key: 'instancesById' });

  const queryIds = instancesIds.join(' or ');

  const query = useQuery(
    {
      queryKey: [namespace, queryIds, tenant],
      queryFn: () => ky.get(`inventory/instances?query=id==(${queryIds})`).json(),
      enabled: !!queryIds,
    }
  );

  return {
    ...query,
    data: query.data?.instances,
  };
};
