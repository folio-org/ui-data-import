import React from 'react';
import {
  waitFor,
  renderHook,
} from '@testing-library/react';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useSRSRecordQuery } from '../useSRSRecordQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockSRSMarcRecord = { id: 'srsMarcRecordId' };

describe('useSRSRecordQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve(mockSRSMarcRecord)
        });
      },
    });
  });

  it('should fetch SRS record', async () => {
    const id = 'recordId';

    const { result } = renderHook(() => useSRSRecordQuery(id), { wrapper: queryClientWrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockSRSMarcRecord));
  });
});
