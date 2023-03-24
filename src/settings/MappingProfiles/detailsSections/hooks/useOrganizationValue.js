import React from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { VENDORS_API } from '@folio/stripes-acq-components/lib/constants';

import { UUID_IN_QUOTES_PATTERN } from '../constants';

export const useOrganizationValue = orgId => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'organization' });

  const mapping = orgId?.substring(0, orgId.indexOf('"'));
  const orgIdMatch = orgId?.match(UUID_IN_QUOTES_PATTERN);
  const id = orgIdMatch ? orgIdMatch[1].replace(/['"]+/g, '') : null;

  const { isLoading, data } = useQuery(
    [namespace, id],
    () => ky.get(`${VENDORS_API}/${id}`).json(),
    { enabled: Boolean(id) },
  );

  const organizationNameFromResponse = data?.name ? `"${data?.name}"` : '';
  const organizationName = mapping ? `${mapping}${organizationNameFromResponse}` : organizationNameFromResponse;

  return ({
    organizationName: (orgId && !orgIdMatch) ? orgId : organizationName,
    organization: data,
    isLoading,
  });
};
