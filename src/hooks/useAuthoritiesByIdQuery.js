import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

export const useAuthoritiesByIdQuery = (authoritiesIds = [], { tenantId } = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'authoritiesById' });

  const queryIds = authoritiesIds.join(' or ');

  const query = useQuery(
    {
      queryKey: [namespace, queryIds, tenantId],
      queryFn: () => ky.get(`authority-storage/authorities?query=id==(${queryIds})`).json(),
      enabled: !!queryIds,
    }
  );

  return {
    ...query,
    data: query.data?.authorities,
  };
};
