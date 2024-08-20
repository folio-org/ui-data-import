import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { DonorInformation } from '../DonorInformation';

jest.mock('../../../../../../hooks', () => ({
  useDonorsQuery: () => ({ data: [{ id: 'orgId', name: 'orgName' }] }),
}));

const setReferenceTablesMock = jest.fn();

const renderDonorInformation = () => {
  const component = () => (
    <DonorInformation
      initialFields={{}}
      setReferenceTables={setReferenceTablesMock}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('DonorInformation edit component', () => {
  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderDonorInformation();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const { getByText } = renderDonorInformation();

    expect(getByText('Donor information')).toBeInTheDocument();
    expect(getByText('Add donor')).toBeInTheDocument();
  });
});
