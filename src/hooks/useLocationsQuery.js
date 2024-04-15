import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

import { LIMIT_5000 } from '../utils';

export const useLocationsQuery = ({ tenant } = {}) => {
  const ky = useTenantKy({ tenant });
  const [namespace] = useNamespace({ key: 'locations' });

  const query = useQuery({
    queryKey: [namespace, tenant],
    queryFn: () => ky.get('locations', { searchParams: { limit: LIMIT_5000 } }).json(),
  });

  return ({
    ...query,
    data: query.data?.locations,
  });
};
