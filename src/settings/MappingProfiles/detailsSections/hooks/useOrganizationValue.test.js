import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  waitFor,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
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
  name: 'Amazon',
};

describe('useOrganizationValue hook', () => {
  const mockGet = jest.fn(() => ({
    json: () => organization,
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('fetches organization when id is provided', async () => {
    const { result } = renderHook(() => useOrganizationValue(`"${organization.id}"`), { wrapper });

    await waitFor(() => expect(result.current.organizationName).toEqual('"Amazon"'));
    expect(mockGet).toHaveBeenCalledWith(`${VENDORS_API}/${organization.id}`);
  });

  it('returns passed value when id is not provided', () => {
    const orgValue = '111';
    const { result } = renderHook(() => useOrganizationValue(orgValue), { wrapper });

    expect(result.current.organizationName).toEqual(orgValue);
  });
});
