import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../test/jest/__mock__';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { FieldDonor } from './FieldDonor';

const mockVendor = { id: '1', name: 'Amazon' };
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  DonorsLookup: jest.fn(({ onAddDonors }) => {
    return (
      <div>
        <button
          type="button"
          onClick={() => onAddDonors([mockVendor])}
        >
          Add donor
        </button>
      </div>
    );
  }),
}));

const setReferenceTablesMock = jest.fn();
const allDonorsMock = [{}];

const renderFieldDonor = ({ inputValue }) => {
  const component = () => (
    <FieldDonor
      inputValue={inputValue}
      setReferenceTables={setReferenceTablesMock}
      allDonors={allDonorsMock}
      label="Donor"
      name="donorOrganizationIds"
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('FieldDonor components', () => {
  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderFieldDonor({ inputValue: '897' });

    await runAxeTest({ rootNode: container });
  });

  it('should render Donor field', () => {
    renderFieldDonor({ inputValue: '897' });

    expect(screen.getByLabelText('Donor')).toBeInTheDocument();
  });

  it('should Add donor button', () => {
    renderFieldDonor({ inputValue: '897' });

    expect(screen.getByRole('button', { name: 'Add donor' })).toBeInTheDocument();
  });
});
