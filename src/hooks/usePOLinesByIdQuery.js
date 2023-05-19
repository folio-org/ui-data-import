import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const usePOLinesByIdQuery = (poLineIds = []) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'poLinesByIds' });

  const queryIds = poLineIds.join(' or ');

  const query = useQuery(
    [namespace, queryIds],
    () => ky.get(`orders/order-lines?query=id==(${queryIds})`).json(),
    { enabled: Boolean(queryIds) },
  );

  return {
    ...query,
    data: query.data?.poLines,
  };
};
