import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useInvoicesByIdQuery } from '../useInvoicesByIdQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockInvoicesRecords = [{ id: 'invoiceId1' }, { id: 'invoiceId2' }];

describe('useInvoicesByIdQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve({ invoices: mockInvoicesRecords })
        });
      },
    });
  });

  it('should fetch invoices', async () => {
    const ids = ['invoiceId1', 'invoiceId1'];

    const { result, waitFor } = renderHook(() => useInvoicesByIdQuery(ids), { wrapper: queryClientWrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockInvoicesRecords);
  });
});
