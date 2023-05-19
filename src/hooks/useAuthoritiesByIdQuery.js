import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useAuthoritiesByIdQuery = (authoritiesIds = []) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'authoritiesById' });

  const queryIds = authoritiesIds.join(' or ');

  const query = useQuery(
    [namespace, queryIds],
    () => ky.get(`authority-storage/authorities?query=id==(${queryIds})`).json(),
    { enabled: Boolean(queryIds) },
  );

  return {
    ...query,
    data: query.data?.authorities,
  };
};
