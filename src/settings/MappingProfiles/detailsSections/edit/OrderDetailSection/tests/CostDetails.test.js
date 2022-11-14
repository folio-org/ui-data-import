import React from 'react';
import { within } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { CostDetails } from '../CostDetails';

import { BOOLEAN_ACTIONS } from '../../../../../../utils';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
}));

const renderCostDetails = () => {
  const component = () => (
    <CostDetails
      currency="USD"
      useSetExchange={BOOLEAN_ACTIONS.ALL_FALSE}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('CostDetails', () => {
  it('should render correct fields', async () => {
    const { getByText } = renderCostDetails();

    expect(getByText('Physical unit price')).toBeInTheDocument();
    expect(getByText('Quantity physical')).toBeInTheDocument();
    expect(getByText('Additional coast')).toBeInTheDocument();
    expect(getByText('Currency')).toBeInTheDocument();
    expect(getByText('Use set exchange rate')).toBeInTheDocument();
    expect(getByText('Set exchange rate')).toBeInTheDocument();
    expect(getByText('Electronic unit price')).toBeInTheDocument();
    expect(getByText('Quantity electronic')).toBeInTheDocument();
    expect(getByText('Discount')).toBeInTheDocument();
    expect(getByText('Type')).toBeInTheDocument();
  });

  it('should render required fields', () => {
    const { queryByText } = renderCostDetails();

    expect(within(queryByText('Currency')).getByText(/\*/i)).toBeDefined();
  });

  it('should render info icons for sometimes required fields', () => {
    const { queryByText } = renderCostDetails();

    expect(within(queryByText('Physical unit price')).getByText(/InfoPopover/i)).toBeDefined();
    expect(within(queryByText('Quantity physical')).getByText(/InfoPopover/i)).toBeDefined();
    expect(within(queryByText('Electronic unit price')).getByText(/InfoPopover/i)).toBeDefined();
    expect(within(queryByText('Quantity electronic')).getByText(/InfoPopover/i)).toBeDefined();
  });
});
