import React from 'react';
import { within } from '@testing-library/react';

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

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const locations = [{
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
}];

const renderLocation = () => {
  const component = () => (
    <Location
      locations={locations}
      initialFields={{}}
      setReferenceTables={() => {}}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Location', () => {
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
});
