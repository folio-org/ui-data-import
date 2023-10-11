import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';
import { useTenantKy } from './useTenantKy';

export const useOrderByIdQuery = (orderId = null, { tenant } = {}) => {
  const ky = useTenantKy({ tenant });
  const [namespace] = useNamespace({ key: 'orderById' });

  return useQuery(
    {
      queryKey: [namespace, orderId, tenant],
      queryFn: () => ky.get(`orders/composite-orders/${orderId}`).json(),
      enabled: !!orderId,
    }
  );
};
