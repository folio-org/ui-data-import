import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LIMIT_5000 } from '../utils';

export const useDonorsQuery = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'donors' });

  const query = useQuery({
    queryKey: [namespace],
    queryFn: () => ky.get(
      'organizations/organizations',
      {
        searchParams: {
          query: '(isDonor=="true" and status=="Active") sortby name/sort.ascending',
          limit: LIMIT_5000,
        },
      },
    ).json(),
  });

  return ({
    ...query,
    data: query.data?.organizations,
  });
};
