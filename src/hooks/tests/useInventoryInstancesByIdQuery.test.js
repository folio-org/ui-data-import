import React from 'react';
import {
  waitFor,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useInventoryInstancesByIdQuery } from '../useInventoryInstancesByIdQuery';
import { queryClientWrapper } from '../../../test/jest/helpers';

const mockInstancesRecords = [{ id: 'instanceId1' }, { id: 'instanceId1' }];

describe('useInventoryInstancesByIdQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve({ instances: mockInstancesRecords })
        });
      },
    });
  });

  it('should fetch instances', async () => {
    const ids = ['instanceId1', 'instanceId2'];

    const { result } = renderHook(() => useInventoryInstancesByIdQuery(ids), { wrapper: queryClientWrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockInstancesRecords));
  });
});
