import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { usePOLinesByIdQuery } from '../usePOLinesByIdQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockPoLinesRecords = [{ id: 'poLineId1' }, { id: 'poLineId2' }];

describe('usePOLinesByIdQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve({ poLines: mockPoLinesRecords })
        });
      },
    });
  });

  it('should fetch PO lines', async () => {
    const ids = ['poLineId1', 'poLineId2'];

    const { result, waitFor } = renderHook(() => usePOLinesByIdQuery(ids), { wrapper: queryClientWrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockPoLinesRecords);
  });
});
