import React from 'react';
import {
  waitFor,
  renderHook,
} from '@testing-library/react';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useInventoryItemsByIdQuery } from '../useInventoryItemsByIdQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockItemsRecords = [{ id: 'itemId1' }, { id: 'itemId2' }];

describe('useInventoryItemsByIdQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve({ items: mockItemsRecords })
        });
      },
    });
  });

  it('should fetch items', async () => {
    const ids = ['itemId1', 'itemId2'];

    const { result } = renderHook(() => useInventoryItemsByIdQuery(ids), { wrapper: queryClientWrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockItemsRecords));
  });
});
