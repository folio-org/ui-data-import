import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useInvoiceLineByIdQuery = (invoiceLineId = null, { tenant } = {}) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'invoiceLineById' });

  return useQuery(
    {
      queryKey: [namespace, invoiceLineId, tenant],
      queryFn: () => ky.get(`invoice-storage/invoice-lines/${invoiceLineId}`).json(),
      enabled: !!invoiceLineId,
    }
  );
};
