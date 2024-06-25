import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useOrderByIdQuery = (orderId = null, { tenant } = {}) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'orderById' });

  return useQuery(
    {
      queryKey: [namespace, orderId, tenant],
      queryFn: () => ky.get(`orders/composite-orders/${orderId}`).json(),
      enabled: !!orderId,
    }
  );
};
