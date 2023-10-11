import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

export const useLocationsQuery = ({ tenantId } = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'locations' });

  const query = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: () => ky.get('locations').json(),
  });

  return ({
    ...query,
    data: query.data?.locations,
  });
};
