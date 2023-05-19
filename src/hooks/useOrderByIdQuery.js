import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useOrderByIdQuery = (orderId = null) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'orderById' });

  return useQuery(
    [namespace, orderId],
    () => ky.get(`orders/composite-orders/${orderId}`).json(),
    { enabled: Boolean(orderId) },
  );
};
