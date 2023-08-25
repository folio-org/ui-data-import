import React from 'react';
import {
  waitFor,
  renderHook,
} from '@testing-library/react';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useInventoryHoldingsByIdQuery } from '../useInventoryHoldingsByIdQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockHoldingsRecords = [{ id: 'holdingsId1' }, { id: 'holdingsId2' }];

describe('useInventoryHoldingsByIdQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve({ holdingsRecords: mockHoldingsRecords })
        });
      },
    });
  });

  it('should fetch holdings', async () => {
    const ids = ['holdingsId1', 'holdingsId2'];

    const { result } = renderHook(() => useInventoryHoldingsByIdQuery(ids), { wrapper: queryClientWrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockHoldingsRecords));
  });
});
