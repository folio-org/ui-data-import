import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useInvoicesByIdQuery = (invoicesIds = []) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'invoicesById' });

  const queryIds = invoicesIds.join(' or ');

  const query = useQuery(
    [namespace, queryIds],
    () => ky.get(`invoice-storage/invoices?query=id==(${queryIds})`).json(),
    { enabled: Boolean(queryIds) },
  );

  return {
    ...query,
    data: query.data?.invoices,
  };
};
