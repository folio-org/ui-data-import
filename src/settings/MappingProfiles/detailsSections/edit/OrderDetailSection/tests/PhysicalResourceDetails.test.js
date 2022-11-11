import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { PhysicalResourceDetails } from '../PhysicalResourceDetails';

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const volumes = [{
  order: 0,
  path: 'order.poLine.physical.volumes[]',
  fields: [{
    name: 'volumes',
    enabled: true,
    path: 'order.poLine.physical.volumes[]',
    value: '',
  }],
}];

const renderPhysicalResourceDetails = () => {
  const component = () => (
    <PhysicalResourceDetails
      volumes={volumes}
      materialSupplierId={null}
      initialFields={{}}
      setReferenceTables={() => {}}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('PhysicalResourceDetails', () => {
  it('should render correct fields', async () => {
    const { getByText } = renderPhysicalResourceDetails();

    expect(getByText('Material supplier')).toBeInTheDocument();
    expect(getByText('Receipt due')).toBeInTheDocument();
    expect(getByText('Expected receipt date')).toBeInTheDocument();
    expect(getByText('Create inventory')).toBeInTheDocument();
    expect(getByText('Material type')).toBeInTheDocument();
    expect(getByText('Add volume')).toBeInTheDocument();
    expect(getByText('Volume')).toBeInTheDocument();
  });
});
