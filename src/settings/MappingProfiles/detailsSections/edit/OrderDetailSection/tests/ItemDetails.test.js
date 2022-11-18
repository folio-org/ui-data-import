import React from 'react';
import { within } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { ItemDetails } from '../ItemDetails';

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const contributors = [{
  order: 0,
  path: 'order.poLine.contributors[]',
  fields: [{
    name: 'contributor',
    enabled: true,
    path: 'order.poLine.contributors[].contributor',
    value: '',
  }, {
    name: 'contributorNameTypeId',
    enabled: true,
    path: 'order.poLine.contributors[].contributorNameTypeId',
    value: '',
  }],
}];
const productIdentifiers = [{
  order: 0,
  path: 'order.poLine.details.productIds[]',
  fields: [{
    name: 'productId',
    enabled: true,
    path: 'order.poLine.details.productIds[].productId',
    value: '',
  }, {
    name: 'qualifier',
    enabled: true,
    path: 'order.poLine.details.productIds[].qualifier',
    value: '',
  }, {
    name: 'productIdType',
    enabled: true,
    path: 'order.poLine.details.productIds[].productIdType',
    value: '',
  }],
}];

const renderItemDetails = () => {
  const component = () => (
    <ItemDetails
      contributors={contributors}
      productIdentifiers={productIdentifiers}
      initialFields={{}}
      setReferenceTables={() => {}}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('ItemDetails', () => {
  it('should render correct fields', async () => {
    const { getByText } = renderItemDetails();

    expect(getByText('Title')).toBeInTheDocument();
    expect(getByText('Receiving note')).toBeInTheDocument();
    expect(getByText('Must acknowledge receiving note')).toBeInTheDocument();
    expect(getByText('Subscription from')).toBeInTheDocument();
    expect(getByText('Subscription to')).toBeInTheDocument();
    expect(getByText('Subscription interval')).toBeInTheDocument();
    expect(getByText('Publication date')).toBeInTheDocument();
    expect(getByText('Publisher')).toBeInTheDocument();
    expect(getByText('Edition')).toBeInTheDocument();
    expect(getByText('Add contributor')).toBeInTheDocument();
    expect(getByText('Contributor')).toBeInTheDocument();
    expect(getByText('Contributor type')).toBeInTheDocument();
    expect(getByText('Add product ID and product ID type')).toBeInTheDocument();
    expect(getByText('Product ID')).toBeInTheDocument();
    expect(getByText('Qualifier')).toBeInTheDocument();
    expect(getByText('Product ID type')).toBeInTheDocument();
    expect(getByText('Internal note')).toBeInTheDocument();
  });

  it('should render required fields', () => {
    const { queryByText } = renderItemDetails();

    expect(within(queryByText('Title')).getByText(/\*/i)).toBeDefined();
  });
});
