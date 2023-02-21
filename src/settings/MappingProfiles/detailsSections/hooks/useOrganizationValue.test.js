import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';
import faker from 'faker';

import '../../../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';
import { VENDORS_API } from '@folio/stripes-acq-components';


import { useOrganizationValue } from './useOrganizationValue';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const organization = {
  id: faker.random.uuid(),
  code: 'AMAZ',
  name: '"Amazon"',
};

describe('useOrganizationValue', () => {
  const mockGet = jest.fn(() => ({
    json: () => organization,
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('fetches organization when id is provided', async () => {
    const { result, waitFor } = renderHook(() => useOrganizationValue(`"${organization.id}"`), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.organization).toEqual(organization.name);
    expect(mockGet).toHaveBeenCalledWith(`${VENDORS_API}/${organization.id}`);
  });

  it('returns passed value when id is not provided', () => {
    const orgValue = '111';
    const { result } = renderHook(() => useOrganizationValue(orgValue), { wrapper });

    expect(result.current.organization).toEqual(orgValue);
  });
});
