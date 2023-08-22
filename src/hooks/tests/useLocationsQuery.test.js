import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useLocationsQuery } from '../useLocationsQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockLocationsRecord = [{ id: 'locationId1' }, { id: 'locationId2' }];

describe('useLocationsQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve({ locations: mockLocationsRecord })
        });
      },
    });
  });

  it('should fetch locations', async () => {
    const {
      result,
      waitFor,
    } = renderHook(() => useLocationsQuery(), { wrapper: queryClientWrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockLocationsRecord);
  });
});
