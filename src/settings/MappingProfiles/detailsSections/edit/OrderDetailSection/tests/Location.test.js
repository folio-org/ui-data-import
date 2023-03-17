import React from 'react';
import {
  fireEvent,
  within,
} from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { Location } from '../Location';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
}));

jest.mock('../../../hooks', () => ({
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
}));

const setReferenceTablesMock = jest.fn();

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderLocation = () => {
  const component = () => (
    <Location
      initialFields={{}}
      setReferenceTables={setReferenceTablesMock}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Location', () => {
  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

  it('should render correct fields', async () => {
    const { getByText } = renderLocation();

    expect(getByText('Add location')).toBeInTheDocument();
    expect(getByText('Name (code)')).toBeInTheDocument();
    expect(getByText('Quantity physical')).toBeInTheDocument();
    expect(getByText('Quantity electronic')).toBeInTheDocument();
  });

  it('should render info icons for sometimes required fields', () => {
    const { queryByText } = renderLocation();

    expect(within(queryByText('Name (code)')).getByText(/InfoPopover/i)).toBeDefined();
    expect(within(queryByText('Quantity physical')).getByText(/InfoPopover/i)).toBeDefined();
    expect(within(queryByText('Quantity electronic')).getByText(/InfoPopover/i)).toBeDefined();
  });

  describe('when click "Add location" button', () => {
    it('fields for new location should be rendered', () => {
      const {
        getByRole,
        getByText,
      } = renderLocation();

      const addLocationButton = getByRole('button', { name: /Add location/i });
      fireEvent.click(addLocationButton);

      expect(getByText('Name (code)')).toBeInTheDocument();
      expect(getByText('Quantity physical')).toBeInTheDocument();
      expect(getByText('Quantity electronic')).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', () => {
        const {
          getByRole,
          getAllByRole,
        } = renderLocation();

        const addLocationButton = getByRole('button', { name: /Add location/i });
        fireEvent.click(addLocationButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });
});
