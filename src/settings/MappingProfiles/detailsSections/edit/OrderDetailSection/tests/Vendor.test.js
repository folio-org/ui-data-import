import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { Vendor } from '../Vendor';

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const vendorRefNumbers = [{
  order: 0,
  path: 'order.poLine.vendorDetail.referenceNumbers[]',
  fields: [{
    name: 'refNumber',
    enabled: true,
    path: 'order.poLine.vendorDetail.referenceNumbers[].refNumber',
    value: '',
  }, {
    name: 'refNumberType',
    enabled: true,
    path: 'order.poLine.vendorDetail.referenceNumbers[].refNumberType',
    value: '',
  }],
}];

const renderVendor = () => {
  const component = () => (
    <Vendor
      vendorRefNumbers={vendorRefNumbers}
      accountNumbers={[]}
      initialFields={{}}
      setReferenceTables={() => {}}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Vendor', () => {
  it('should render correct fields', async () => {
    const { getByText } = renderVendor();

    expect(getByText('Add vendor reference number')).toBeInTheDocument();
    expect(getByText('Vendor reference number')).toBeInTheDocument();
    expect(getByText('Vendor reference type')).toBeInTheDocument();
    expect(getByText('Account number')).toBeInTheDocument();
    expect(getByText('Instructions to vendor')).toBeInTheDocument();
  });
});
