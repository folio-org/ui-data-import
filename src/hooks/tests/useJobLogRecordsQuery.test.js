import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useJobLogRecordsQuery } from '../useJobLogRecordsQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockJobLogRecord = { id: 'jobLogId' };

describe('useJobLogRecordsQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve(mockJobLogRecord)
        });
      },
    });
  });

  it('should fetch job log', async () => {
    const logId = 'jobLogId';
    const recordId = 'recordId';

    const { result, waitFor } = renderHook(() => useJobLogRecordsQuery(logId, recordId), { wrapper: queryClientWrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockJobLogRecord);
  });
});