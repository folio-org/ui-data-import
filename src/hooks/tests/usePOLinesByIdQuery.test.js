import React from 'react';
import {
  waitFor,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';

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

    const { result } = renderHook(() => usePOLinesByIdQuery(ids), { wrapper: queryClientWrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockPoLinesRecords));
  });
});
