import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';
import { useTenantKy } from './useTenantKy';

export const useOrderByIdQuery = (orderId = null, { tenantId } = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'orderById' });

  return useQuery(
    {
      queryKey: [namespace, orderId, tenantId],
      queryFn: () => ky.get(`orders/composite-orders/${orderId}`).json(),
      enabled: !!orderId,
    }
  );
};
