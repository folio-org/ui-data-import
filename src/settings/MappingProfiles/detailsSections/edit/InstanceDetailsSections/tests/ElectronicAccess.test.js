import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

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

const okapi = buildOkapi();

const renderElectronicAccess = () => {
  const component = () => (
    <ElectronicAccess
      electronicAccess={electronicAccessProp}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('ElectronicAccess edit component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderElectronicAccess();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const { getByText } = renderElectronicAccess();

    expect(getByText('Add electronic access')).toBeInTheDocument();
    expect(getByText(/uri/i)).toBeInTheDocument();
    expect(getByText(/link text/i)).toBeInTheDocument();
    expect(getByText(/materials specified/i)).toBeInTheDocument();
    expect(getByText(/url public note/i)).toBeInTheDocument();
  });
});
