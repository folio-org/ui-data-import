import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useInvoiceLineByIdQuery = (invoiceLineId = null) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoiceLineById' });

  return useQuery(
    [namespace, invoiceLineId],
    () => ky.get(`invoice-storage/invoice-lines/${invoiceLineId}`).json(),
    { enabled: Boolean(invoiceLineId) },
  );
};
