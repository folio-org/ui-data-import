import React from 'react';
import { within } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { FundDistribution } from '../FundDistribution';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
}));

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const fundDistributions = [{
  order: 0,
  path: 'order.poLine.fundDistribution[]',
  fields: [{
    name: 'fundId',
    enabled: true,
    path: 'order.poLine.fundDistribution[].fundId',
    value: '',
    acceptedValues: {},
  }, {
    name: 'expenseClassId',
    enabled: true,
    path: 'order.poLine.fundDistribution[].expenseClassId',
    value: '',
    acceptedValues: {},
  }, {
    name: 'value',
    enabled: true,
    path: 'order.poLine.fundDistribution[].value',
    value: '',
  }, {
    name: 'distributionType',
    enabled: true,
    path: 'order.poLine.fundDistribution[].distributionType',
    value: 'percentage',
  }],
}];

const renderFundDistribution = () => {
  const component = () => (
    <FundDistribution
      fundDistributions={fundDistributions}
      currency="USD"
      initialFields={{}}
      setReferenceTables={() => {}}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('FundDistribution', () => {
  it('should render correct fields', async () => {
    const { getByText } = renderFundDistribution();

    expect(getByText('Add fund distribution')).toBeInTheDocument();
    expect(getByText('Fund ID')).toBeInTheDocument();
    expect(getByText('Expense class')).toBeInTheDocument();
    expect(getByText('Value')).toBeInTheDocument();
    expect(getByText('Type')).toBeInTheDocument();
  });

  it('should render info icons for sometimes required fields', () => {
    const { queryByText } = renderFundDistribution();

    expect(within(queryByText('Fund ID')).getByText(/InfoPopover/i)).toBeDefined();
    expect(within(queryByText('Expense class')).getByText(/InfoPopover/i)).toBeDefined();
    expect(within(queryByText('Value')).getByText(/InfoPopover/i)).toBeDefined();
  });
});
