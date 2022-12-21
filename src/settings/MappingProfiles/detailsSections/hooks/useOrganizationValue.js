import React from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { VENDORS_API } from '@folio/stripes-acq-components/lib/constants';

import { QUOTED_ID_PATTERN } from '../constants';

export const useOrganizationValue = orgId => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'organization' });

  const orgIdMatch = orgId?.match(QUOTED_ID_PATTERN);
  const id = orgIdMatch ? orgIdMatch[1].replace(/['"]+/g, '') : null;

  const { isLoading, data } = useQuery(
    [namespace, id],
    () => ky.get(`${VENDORS_API}/${id}`).json(),
    { enabled: Boolean(id) },
  );

  return ({
    organization: (orgId && !orgIdMatch) ? orgId : data?.name,
    isLoading,
  });
};
