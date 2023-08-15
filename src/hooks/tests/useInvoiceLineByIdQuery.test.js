import React from 'react';
import {
  waitFor,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useInvoiceLineByIdQuery } from '../useInvoiceLineByIdQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockInvoiceLineRecord = { id: 'invoiceLineId1' };

describe('useInvoiceLineByIdQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve(mockInvoiceLineRecord)
        });
      },
    });
  });

  it('should fetch invoice line', async () => {
    const id = 'invoiceLineId1';

    const { result } = renderHook(() => useInvoiceLineByIdQuery(id), { wrapper: queryClientWrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockInvoiceLineRecord));
  });
});
