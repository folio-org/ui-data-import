import React from 'react';
import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

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
    const { result } = renderHook(() => useLocationsQuery(), { wrapper: queryClientWrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockLocationsRecord));
  });
});
