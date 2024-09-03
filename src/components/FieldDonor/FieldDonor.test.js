import { act } from 'react';
import faker from 'faker';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
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
          onClick={() => onAddDonors(mockVendor)}
        >
          Add donor
        </button>
      </div>
    );
  }),
}));

const setReferenceTablesMock = jest.fn();
const onClearMock = jest.fn();
const onSelectMock = jest.fn();
const allDonorsMock = [{}];
const id = faker.random.uuid();

const renderFieldDonor = ({ inputValue }) => {
  const component = () => (
    <FieldDonor
      inputValue={inputValue}
      setReferenceTables={setReferenceTablesMock}
      allDonors={allDonorsMock}
      label="Donor"
      name="donorOrganizationIds"
      onClear={onClearMock}
      onSelect={onSelectMock}
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
    renderFieldDonor({ inputValue: `678$a; else "${id}"` });

    expect(screen.getByLabelText('Donor')).toBeInTheDocument();
  });

  it('should Add donor button', () => {
    renderFieldDonor({ inputValue: '897' });

    expect(screen.getByRole('button', { name: 'Add donor' })).toBeInTheDocument();
  });

  it('should call onClear prop when removing a field value', async () => {
    renderFieldDonor({ inputValue: '897' });

    await act(async () => userEvent.type(screen.getByLabelText('Donor'), '678'));
    const clearFieldButton = screen.getByRole('button', { name: 'Clear this field' });
    await act(async () => userEvent.click(clearFieldButton));

    expect(onClearMock).toHaveBeenCalled();
    expect(setReferenceTablesMock).toHaveBeenCalledWith('donorOrganizationIds', '');
  });

  it('should call osSelect prop when selecting a donor from lookup', async () => {
    renderFieldDonor({ inputValue: '789; else ' });

    const addDonorButton = screen.getByRole('button', { name: 'Add donor' });
    await act(async () => userEvent.click(addDonorButton));

    expect(onSelectMock).toHaveBeenCalled();
    expect(setReferenceTablesMock).toHaveBeenCalledWith('donorOrganizationIds', '789; else "1"');
  });
});
