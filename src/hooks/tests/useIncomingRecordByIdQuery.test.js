import React from 'react';

import {
  waitFor,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useIncomingRecordByIdQuery } from '../useIncomingRecordByIdQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockIncomingRecord = { id: 'incomingRecordId' };

describe('useIncomingRecordByIdQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve({ data: mockIncomingRecord }),
        });
      },
    });
  });

  it('should fetch incoming record', async () => {
    const { result } = renderHook(() => useIncomingRecordByIdQuery('incomingRecordId'), { wrapper: queryClientWrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockIncomingRecord);
    });
  });
});
