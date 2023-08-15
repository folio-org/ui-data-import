import React from 'react';
import {
  waitFor,
  renderHook,
} from '@testing-library/react';

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

    const { result } = renderHook(() => useJobLogRecordsQuery(logId, recordId), { wrapper: queryClientWrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockJobLogRecord));
  });
});
