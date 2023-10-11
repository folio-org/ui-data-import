import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from './useTenantKy';

export const useInvoiceLineByIdQuery = (invoiceLineId = null, { tenant } = {}) => {
  const ky = useTenantKy({ tenant });
  const [namespace] = useNamespace({ key: 'invoiceLineById' });

  return useQuery(
    {
      queryKey: [namespace, invoiceLineId, tenant],
      queryFn: () => ky.get(`invoice-storage/invoice-lines/${invoiceLineId}`).json(),
      enabled: !!invoiceLineId,
    }
  );
};
