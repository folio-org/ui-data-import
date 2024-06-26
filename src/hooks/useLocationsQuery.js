import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LIMIT_5000 } from '../utils';

export const useLocationsQuery = ({ tenant } = {}) => {
  const ky = useOkapiKy({ tenant });
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
