import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { Location } from '../Location';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
}));

jest.mock('../../../hooks', () => ({
  useFieldMappingFieldValue: () => ['Electronic resource'],
  useFieldMappingRefValues: () => [[{
    order: 0,
    path: 'order.poLine.locations[]',
    fields: [{
      name: 'locationId',
      enabled: true,
      path: 'order.poLine.locations[].locationId',
      value: '',
      acceptedValues: {},
    }, {
      name: 'quantityPhysical',
      enabled: true,
      path: 'order.poLine.locations[].quantityPhysical',
      value: '',
      acceptedValues: {},
    }, {
      name: 'quantityElectronic',
      enabled: true,
      path: 'order.poLine.locations[].quantityElectronic',
      value: '',
    }],
  }]],
  useDisabledOrderFields: () => ({
    dismissPhysicalDetails: false,
    dismissElectronicDetails: false,
  }),
}));

global.fetch = jest.fn();

const setReferenceTablesMock = jest.fn();

const okapi = buildOkapi();

const renderLocation = () => {
  const component = () => (
    <Location
      initialFields={{}}
      setReferenceTables={setReferenceTablesMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Location edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
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
    } = renderLocation();

    const locationTitle = await findByText('Location');

    expect(locationTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const {
      getByText,
      findByText,
    } = renderLocation();

    const locationTitle = await findByText('Location');

    expect(locationTitle).toBeInTheDocument();

    expect(getByText('Add location')).toBeInTheDocument();
    expect(getByText('Name (code)')).toBeInTheDocument();
    expect(getByText('Quantity physical')).toBeInTheDocument();
    expect(getByText('Quantity electronic')).toBeInTheDocument();
  });

  it('should render info icons for sometimes required fields', async () => {
    const { findByText } = renderLocation();

    const nameField = await findByText('Name (code)');
    const quantityPhysicalField = await findByText('Quantity physical');
    const quantityElectronicField = await findByText('Quantity electronic');

    expect(nameField.lastElementChild.innerHTML).toEqual('InfoPopover');
    expect(quantityPhysicalField.lastElementChild.innerHTML).toEqual('InfoPopover');
    expect(quantityElectronicField.lastElementChild.innerHTML).toEqual('InfoPopover');
  });

  describe('when click "Add location" button', () => {
    it('fields for new location should be rendered', async () => {
      const {
        findByRole,
        getByText,
      } = renderLocation();

      const addLocationButton = await findByRole('button', { name: /Add location/i });
      fireEvent.click(addLocationButton);

      expect(getByText('Name (code)')).toBeInTheDocument();
      expect(getByText('Quantity physical')).toBeInTheDocument();
      expect(getByText('Quantity electronic')).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', async () => {
        const {
          findByRole,
          getAllByRole,
        } = renderLocation();

        const addLocationButton = await findByRole('button', { name: /Add location/i });
        fireEvent.click(addLocationButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });
});
