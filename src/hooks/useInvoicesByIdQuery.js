import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

export const useInvoicesByIdQuery = (invoicesIds = [], { tenantId } = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'invoicesById' });

  const queryIds = invoicesIds.join(' or ');

  const query = useQuery(
    {
      queryKey: [namespace, queryIds, tenantId],
      queryFn: () => ky.get(`invoice-storage/invoices?query=id==(${queryIds})`).json(),
      enabled: !!queryIds,
    }
  );

  return {
    ...query,
    data: query.data?.invoices,
  };
};
