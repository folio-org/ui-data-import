import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useAuthoritiesByIdQuery } from '../useAuthoritiesByIdQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockAuthoritiesRecords = [{ id: 'authorityId1' }, { id: 'authorityId2' }];

describe('useAuthoritiesByIdQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve({ authorities: mockAuthoritiesRecords })
        });
      },
    });
  });

  it('should fetch authorities', async () => {
    const ids = ['authorityId1', 'authorityId2'];

    const { result, waitFor } = renderHook(() => useAuthoritiesByIdQuery(ids), { wrapper: queryClientWrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockAuthoritiesRecords);
  });
});
