import React from 'react';
import {
  fireEvent,
  within,
} from '@testing-library/react';
import { noop } from 'lodash';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { CostDetails } from '../CostDetails';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
}));

jest.mock('../../../hooks', () => ({
  useFieldMappingFieldValue: () => ['', 'USD', 'Electronic resource'],
  useDisabledOrderFields: () => ({
    dismissPhysicalDetails: false,
    dismissElectronicDetails: false,
  }),
}));

const renderCostDetails = () => {
  const component = () => (
    <CostDetails setReferenceTables={noop} />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('CostDetails', () => {
  it('should render correct fields', async () => {
    const { getByText } = renderCostDetails();

    expect(getByText('Physical unit price')).toBeInTheDocument();
    expect(getByText('Quantity physical')).toBeInTheDocument();
    expect(getByText('Additional cost')).toBeInTheDocument();
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

  describe('when click on "Use set exchange rate" checkbox', () => {
    it('checkbox should be checked', () => {
      const { getByLabelText } = renderCostDetails();

      const useSetExchangeCheckbox = getByLabelText('Use set exchange rate');
      fireEvent.click(useSetExchangeCheckbox);

      expect(useSetExchangeCheckbox).toBeChecked();
    });
  });

  describe('when click on "Use set exchange rate" checkbox twice', () => {
    it('checkbox should be unchecked', () => {
      const { getByLabelText } = renderCostDetails();

      const useSetExchangeCheckbox = getByLabelText('Use set exchange rate');
      fireEvent.click(useSetExchangeCheckbox);
      fireEvent.click(useSetExchangeCheckbox);

      expect(useSetExchangeCheckbox).not.toBeChecked();
    });
  });
});
