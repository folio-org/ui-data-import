import { runAxeTest } from '@folio/stripes-testing';
import {
  fireEvent,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { DonorInformation } from '../DonorInformation';
import { useFieldMappingRefValues } from '../../../hooks';

import * as utils from '../../../utils';

const onAdd = jest.spyOn(utils, 'onAdd');
const onRemove = jest.spyOn(utils, 'onRemove');

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useFieldMappingRefValues: jest.fn(() => ([[]])),
}));
jest.mock('../../../../../../hooks', () => ({
  ...jest.requireActual('../../../../../../hooks'),
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
    renderDonorInformation();

    expect(screen.getByText('Donor information')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add donor' })).toBeInTheDocument();
  });

  it('should call onAdd func when adding a new donor', () => {
    renderDonorInformation();
    const addDonorButton = screen.getByRole('button', { name: 'Add donor' });

    fireEvent.click(addDonorButton);

    expect(onAdd).toHaveBeenCalled();
  });

  it('should call onRemove func when removing a donor', () => {
    useFieldMappingRefValues.mockReturnValue([[{ fields: [{ value: '"Amazon"' }] }]]);
    renderDonorInformation();

    const removeDonorButton = screen.getByRole('button', { name: 'Delete this item' });

    fireEvent.click(removeDonorButton);

    expect(onRemove).toHaveBeenCalled();
  });
});
