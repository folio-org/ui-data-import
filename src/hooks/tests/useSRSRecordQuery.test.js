import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

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

    const { result, waitFor } = renderHook(() => useSRSRecordQuery(id), { wrapper: queryClientWrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockSRSMarcRecord);
  });
});
