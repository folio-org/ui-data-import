import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useIncomingRecordByIdQuery = incomingRecordId => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'incomingRecordById' });

  const query = useQuery(
    {
      queryKey: [namespace, incomingRecordId],
      queryFn: () => ky.get(`metadata-provider/incomingRecords/${incomingRecordId}`).json(),
      enabled: !!incomingRecordId,
    }
  );

  return {
    ...query,
    data: query.data?.parsedRecordContent,
  };
};
