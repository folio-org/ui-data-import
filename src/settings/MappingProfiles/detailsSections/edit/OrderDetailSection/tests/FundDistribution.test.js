import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { STATUS_CODES } from '../../../../../../utils';
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

global.fetch = jest.fn();

const setReferenceTablesMock = jest.fn();

const okapi = buildOkapi();

const renderFundDistribution = () => {
  const component = () => (
    <FundDistribution
      initialFields={{}}
      setReferenceTables={setReferenceTablesMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('FundDistribution edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: STATUS_CODES.OK,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const {
      container,
      findByText,
    } = renderFundDistribution();

    const fundDistributionTitle = await findByText('Fund distribution');

    expect(fundDistributionTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const {
      getByText,
      findByText,
    } = renderFundDistribution();

    const fundDistributionTitle = await findByText('Fund distribution');

    expect(fundDistributionTitle).toBeInTheDocument();

    expect(getByText('Add fund distribution')).toBeInTheDocument();
    expect(getByText('Fund ID')).toBeInTheDocument();
    expect(getByText('Expense class')).toBeInTheDocument();
    expect(getByText('Value')).toBeInTheDocument();
    expect(getByText('Type')).toBeInTheDocument();
  });

  it('should render info icons for sometimes required fields', async () => {
    const { findByText } = renderFundDistribution();

    const fundIDField = await findByText('Fund ID');
    const expenseClassField = await findByText('Expense class');
    const valueField = await findByText('Value');

    expect(fundIDField.lastElementChild.innerHTML).toEqual('InfoPopover');
    expect(expenseClassField.lastElementChild.innerHTML).toEqual('InfoPopover');
    expect(valueField.lastElementChild.innerHTML).toEqual('InfoPopover');
  });

  describe('when click "Add fund distribution" button', () => {
    it('fields for new fund distribution should be rendered', async () => {
      const {
        findByRole,
        getByText,
      } = renderFundDistribution();

      const addFundDistributionButton = await findByRole('button', { name: /Add fund distribution/i });
      fireEvent.click(addFundDistributionButton);

      expect(getByText('Fund ID')).toBeInTheDocument();
      expect(getByText('Expense class')).toBeInTheDocument();
      expect(getByText('Value')).toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', async () => {
        const {
          findByRole,
          getAllByRole,
        } = renderFundDistribution();

        const addFundDistributionButton = await findByRole('button', { name: /Add fund distribution/i });
        fireEvent.click(addFundDistributionButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });

  describe('validation error', () => {
    const validationErrorMessage = 'Non-MARC value must use quotation marks';

    it('should appear when fund distribution value is not wrapped into quotes', async () => {
      const {
        findByRole,
        getByText,
        getByLabelText,
      } = renderFundDistribution();

      const addFundDistributionButton = await findByRole('button', { name: /Add fund distribution/ });
      fireEvent.click(addFundDistributionButton);

      const valueField = getByLabelText(/Value/);
      fireEvent.change(valueField, { target : { value: '100' } });
      fireEvent.blur(valueField);

      const errorMessage = getByText(validationErrorMessage);

      expect(errorMessage).toBeInTheDocument();
    });

    it('should not be shown when fund distribution value is marc field with subfield', async () => {
      const {
        findByRole,
        queryByText,
        getByLabelText,
      } = renderFundDistribution();

      const addFundDistributionButton = await findByRole('button', { name: /Add fund distribution/ });
      fireEvent.click(addFundDistributionButton);

      const valueField = getByLabelText(/Value/);
      fireEvent.change(valueField, { target : { value: '100$a' } });
      fireEvent.blur(valueField);

      expect(queryByText(validationErrorMessage)).not.toBeInTheDocument();
    });

    it('should not be shown when fund distribution value is wrapped into quotes', async () => {
      const {
        findByRole,
        queryByText,
        getByLabelText,
      } = renderFundDistribution();

      const addFundDistributionButton = await findByRole('button', { name: /Add fund distribution/ });
      fireEvent.click(addFundDistributionButton);

      const valueField = getByLabelText(/Value/);
      fireEvent.change(valueField, { target : { value: '"100"' } });
      fireEvent.blur(valueField);

      expect(queryByText(validationErrorMessage)).not.toBeInTheDocument();
    });
  });
});
