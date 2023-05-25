import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useInventoryInstancesByIdQuery = (instancesIds = []) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'instancesById' });

  const queryIds = instancesIds.join(' or ');

  const query = useQuery(
    [namespace, queryIds],
    () => ky.get(`inventory/instances?query=id==(${queryIds})`).json(),
    { enabled: Boolean(queryIds) },
  );

  return {
    ...query,
    data: query.data?.instances,
  };
};