import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { ElectronicAccess } from '../ElectronicAccess';

jest.mock('../../../../../../components/AcceptedValuesField/AcceptedValuesField', () => ({
  ...jest.requireActual('../../../../../../components/AcceptedValuesField/AcceptedValuesField'),
  AcceptedValuesField: () => <span>AcceptedValuesField</span>,
}));

const electronicAccessProp = [{
  fields: [{
    acceptedValues: {},
    enabled: true,
    name: 'relationshipId',
    path: 'instance.electronicAccess[].relationshipId',
    value: '',
  }, {
    enabled: true,
    name: 'uri',
    path: 'instance.electronicAccess[].uri',
    value: '',
  }, {
    enabled: true,
    name: 'linkText',
    path: 'instance.electronicAccess[].linkText',
    value: '',
  }, {
    enabled: true,
    name: 'materialsSpecification',
    path: 'instance.electronicAccess[].materialsSpecification',
    value: '',
  }, {
    enabled: true,
    name: 'publicNote',
    path: 'instance.electronicAccess[].publicNote',
    value: '',
  }],
  order: 0,
  path: 'instance.electronicAccess[]',
}];
const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderElectronicAccess = () => {
  const component = () => (
    <ElectronicAccess
      electronicAccess={electronicAccessProp}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('<ElectronicAccess>', () => {
  it('should render correct fields', async () => {
    const { getByText } = renderElectronicAccess();

    expect(getByText('Add electronic access')).toBeInTheDocument();
    expect(getByText(/uri/i)).toBeInTheDocument();
    expect(getByText(/link text/i)).toBeInTheDocument();
    expect(getByText(/materials specified/i)).toBeInTheDocument();
    expect(getByText(/url public note/i)).toBeInTheDocument();
  });
});
