import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

export const useLocationsQuery = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'locations' });

  const query = useQuery({
    queryKey: [namespace],
    queryFn: () => ky.get('locations').json(),
  });

  return ({
    ...query,
    data: query.data?.locations,
  });
};
