import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { STATUS_CODES } from '../../../../../../utils';
import { PhysicalResourceDetails } from '../PhysicalResourceDetails';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
}));

jest.mock('../../../hooks', () => ({
  useFieldMappingFieldValue: () => ['Open', 'Electronic resource'],
  useFieldMappingValueFromLookup: () => ['', ''],
  useFieldMappingRefValues: () => [[{
    order: 0,
    path: 'order.poLine.physical.volumes[]',
    fields: [{
      name: 'volumes',
      enabled: true,
      path: 'order.poLine.physical.volumes[]',
      value: '',
    }],
  }]],
  useDisabledOrderFields: () => ({
    dismissCreateInventory: false,
    dismissPhysicalDetails: false,
  }),
}));

global.fetch = jest.fn();

const setReferenceTablesMock = jest.fn();

const okapi = buildOkapi();

const renderPhysicalResourceDetails = () => {
  const component = () => (
    <PhysicalResourceDetails
      initialFields={{}}
      setReferenceTables={setReferenceTablesMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('PhysicalResourceDetails edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: STATUS_CODES.OK,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const {
      container,
      findByText,
    } = renderPhysicalResourceDetails();

    const physicalResourceTitle = await findByText('Physical resource details');

    expect(physicalResourceTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const {
      getByText,
      findByText,
    } = renderPhysicalResourceDetails();

    const physicalResourceTitle = await findByText('Physical resource details');

    expect(physicalResourceTitle).toBeInTheDocument();

    expect(getByText('Material supplier')).toBeInTheDocument();
    expect(getByText('Receipt due')).toBeInTheDocument();
    expect(getByText('Expected receipt date')).toBeInTheDocument();
    expect(getByText('Create inventory')).toBeInTheDocument();
    expect(getByText('Material type')).toBeInTheDocument();
    expect(getByText('Add volume')).toBeInTheDocument();
    expect(getByText('Volume')).toBeInTheDocument();
  });

  it('should render info icons for sometimes required fields', async () => {
    const { findByText } = renderPhysicalResourceDetails();

    const createInventoryField = await findByText('Create inventory');
    const materialTypeField = await findByText('Material type');

    expect(createInventoryField.lastElementChild.innerHTML).toEqual('InfoPopover');
    expect(materialTypeField.lastElementChild.innerHTML).toEqual('InfoPopover');
  });

  describe('when click "Add volume" button', () => {
    it('fields for new volume should be rendered', async () => {
      const {
        findByRole,
        getByText,
      } = renderPhysicalResourceDetails();

      const addVolumeButton = await findByRole('button', { name: /Add volume/i });
      fireEvent.click(addVolumeButton);

      const volumeField = getByText('Volume');

      expect(volumeField).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', async () => {
        const {
          findByRole,
          getAllByRole,
        } = renderPhysicalResourceDetails();

        const addVolumeButton = await findByRole('button', { name: /Add volume/i });
        fireEvent.click(addVolumeButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });
});
