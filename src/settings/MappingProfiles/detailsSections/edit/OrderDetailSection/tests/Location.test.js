import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { Location } from '../Location';

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
});
