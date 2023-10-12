import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useTenantKy } from '../useTenantKy';
import { OKAPI_TENANT_HEADER } from '../../utils';

const reqMock = {
  headers: {
    set: jest.fn(),
  },
};
const kyMock = {
  extend: jest.fn(({ hooks: { beforeRequest } }) => {
    beforeRequest[0](reqMock);

    return kyMock;
  }),
};

describe('useTenantKy', () => {
  beforeEach(() => {
    reqMock.headers.set.mockClear();
    kyMock.extend.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should set provided okapi tenant header and return \'ky\' client', async () => {
    const tenant = 'college';
    const { result } = renderHook(() => useTenantKy({ tenant }));

    expect(result.current).toBe(kyMock);
    expect(reqMock.headers.set).toHaveBeenCalledWith(OKAPI_TENANT_HEADER, tenant);
  });

  it('should use current tenant in the headers if there is no provided tenant ID', async () => {
    const { result } = renderHook(() => useTenantKy());

    expect(result.current).toBe(kyMock);
    expect(reqMock.headers.set).not.toHaveBeenCalled();
  });
});
