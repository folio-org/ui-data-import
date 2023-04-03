import React from 'react';
import {
  fireEvent,
  within,
} from '@testing-library/react';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { FundDistribution } from '../FundDistribution';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
}));

jest.mock('../../../hooks', () => ({
  useFieldMappingFieldValue: () => ['USD'],
  useFieldMappingRefValues: () => [[{
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
  }]],
}));

const setReferenceTablesMock = jest.fn();

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderFundDistribution = () => {
  const component = () => (
    <FundDistribution
      initialFields={{}}
      setReferenceTables={setReferenceTablesMock}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('FundDistribution', () => {
  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

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

  describe('when click "Add fund distribution" button', () => {
    it('fields for new fund distribution should be rendered', () => {
      const {
        getByRole,
        getByText,
      } = renderFundDistribution();

      const addFundDistributionButton = getByRole('button', { name: /Add fund distribution/i });
      fireEvent.click(addFundDistributionButton);

      expect(getByText('Fund ID')).toBeInTheDocument();
      expect(getByText('Expense class')).toBeInTheDocument();
      expect(getByText('Value')).toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', () => {
        const {
          getByRole,
          getAllByRole,
        } = renderFundDistribution();

        const addFundDistributionButton = getByRole('button', { name: /Add fund distribution/i });
        fireEvent.click(addFundDistributionButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });

  describe('validation error', () => {
    const validationErrorMessage = 'Non-MARC value must use quotation marks';

    it('should appear when fund distribution value is not wrapped into quotes', () => {
      const {
        getByRole,
        getByText,
        getByLabelText,
      } = renderFundDistribution();

      const addFundDistributionButton = getByRole('button', { name: /Add fund distribution/ });
      fireEvent.click(addFundDistributionButton);

      const valueField = getByLabelText(/Value/);
      fireEvent.change(valueField, { target : { value: '100' } });
      fireEvent.blur(valueField);

      expect(getByText(validationErrorMessage)).toBeInTheDocument();
    });

    it('should not be shown when fund distribution value is marc field with subfield', () => {
      const {
        getByRole,
        queryByText,
        getByLabelText,
      } = renderFundDistribution();

      const addFundDistributionButton = getByRole('button', { name: /Add fund distribution/ });
      fireEvent.click(addFundDistributionButton);

      const valueField = getByLabelText(/Value/);
      fireEvent.change(valueField, { target : { value: '100$a' } });
      fireEvent.blur(valueField);

      expect(queryByText(validationErrorMessage)).not.toBeInTheDocument();
    });

    it('should not be shown when fund distribution value is wrapped into quotes', () => {
      const {
        getByRole,
        queryByText,
        getByLabelText,
      } = renderFundDistribution();

      const addFundDistributionButton = getByRole('button', { name: /Add fund distribution/ });
      fireEvent.click(addFundDistributionButton);

      const valueField = getByLabelText(/Value/);
      fireEvent.change(valueField, { target : { value: '"100"' } });
      fireEvent.blur(valueField);

      expect(queryByText(validationErrorMessage)).not.toBeInTheDocument();
    });
  });
});
