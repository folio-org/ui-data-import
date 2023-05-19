import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

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

    const { result, waitFor } = renderHook(() => useOrderByIdQuery(id), { wrapper: queryClientWrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockOrderRecord);
  });
});
