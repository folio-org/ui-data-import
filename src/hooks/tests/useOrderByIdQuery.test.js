import React from 'react';
import {
  waitFor,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useOrderByIdQuery } from '../useOrderByIdQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockOrderRecord = { id: 'orderId' };

describe('useOrderByIdQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve(mockOrderRecord)
        });
      },
    });
  });

  it('should fetch order', async () => {
    const id = 'orderId';

    const { result } = renderHook(() => useOrderByIdQuery(id), { wrapper: queryClientWrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockOrderRecord));
  });
});
