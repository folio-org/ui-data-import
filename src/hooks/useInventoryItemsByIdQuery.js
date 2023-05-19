import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useInventoryItemsByIdQuery = (itemsIds = []) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'itemsById' });

  const queryIds = itemsIds.join(' or ');

  const query = useQuery(
    [namespace, queryIds],
    () => ky.get(`inventory/items?query=id==(${queryIds})`).json(),
    { enabled: Boolean(queryIds) },
  );

  return {
    ...query,
    data: query.data?.items,
  };
};
