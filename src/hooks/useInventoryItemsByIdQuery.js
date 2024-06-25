import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useInventoryItemsByIdQuery = (itemsIds = [], { tenant } = {}) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'itemsById' });

  const queryIds = itemsIds.join(' or ');

  const query = useQuery(
    {
      queryKey: [namespace, queryIds, tenant],
      queryFn: () => ky.get(`inventory/items?query=id==(${queryIds})`).json(),
      enabled: !!queryIds,
    }
  );

  return {
    ...query,
    data: query.data?.items,
  };
};
