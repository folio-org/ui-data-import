import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

export const useInvoiceLineByIdQuery = (invoiceLineId = null, { tenantId } = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'invoiceLineById' });

  return useQuery(
    {
      queryKey: [namespace, invoiceLineId, tenantId],
      queryFn: () => ky.get(`invoice-storage/invoice-lines/${invoiceLineId}`).json(),
      enabled: !!invoiceLineId,
    }
  );
};
