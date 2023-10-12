import { useOkapiKy } from '@folio/stripes/core';

import { OKAPI_TENANT_HEADER } from '../utils';

export const useTenantKy = ({ tenant } = {}) => {
  const ky = useOkapiKy();

  return tenant
    ? ky.extend({
      hooks: {
        beforeRequest: [
          request => {
            request.headers.set(OKAPI_TENANT_HEADER, tenant);
          },
        ],
      },
    })
    : ky;
};
