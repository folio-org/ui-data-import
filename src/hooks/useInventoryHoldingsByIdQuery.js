import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useInventoryHoldingsByIdQuery = (holdingsIds = []) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'holdingsById' });

  const queryIds = holdingsIds.join(' or ');

  const query = useQuery(
    {
      queryKey: [namespace, queryIds],
      queryFn: () => ky.get(`holdings-storage/holdings?query=id==(${queryIds})`).json(),
      enabled: !!queryIds,
    }
  );

  return {
    ...query,
    data: query.data?.holdingsRecords,
  };
};
