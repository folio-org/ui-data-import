import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useDonorsQuery } from '../useDonorsQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockDonorsRecord = [{ id: 'org1' }, { id: 'org2' }];

describe('useDonorsQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve({ organizations: mockDonorsRecord })
        });
      },
    });
  });

  it('should fetch organizations', async () => {
    const { result } = renderHook(() => useDonorsQuery(), { wrapper: queryClientWrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockDonorsRecord));
  });
});
