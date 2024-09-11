import React, { act } from 'react';
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
import INVOICE from '../../../../initialDetails/INVOICE';
import { InvoiceAdjustments } from '../InvoiceAdjustments';
import { getFieldValue } from '../../../utils';

const mockAdjustmentsFields = getFieldValue(INVOICE.mappingFields, 'adjustments', 'subfields')[0];

jest.mock('../../../hooks', () => ({
  useFieldMappingFieldValue: () => ['USD'],
  useFieldMappingRefValues: () => [[mockAdjustmentsFields]],
}));

global.fetch = jest.fn();

const invoiceAdjustmentsTypePath = 'profile.mappingDetails.mappingFields[15].subfields.0.fields.2.value';
const initialFieldsMock = { adjustments: mockAdjustmentsFields };
const setReferenceTablesMock = jest.fn();
const okapi = buildOkapi();

const renderInvoiceAdjustments = () => {
  const component = () => (
    <InvoiceAdjustments
      setReferenceTables={setReferenceTablesMock}
      initialFields={initialFieldsMock}
      mappingFields={INVOICE.mappingFields}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('InvoiceAdjustments edit component', () => {
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
    setReferenceTablesMock.mockClear();
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const {
      container,
      findByText,
    } = renderInvoiceAdjustments();

    const invoiceAdjustmentsTitle = await findByText('Invoice adjustments');

    expect(invoiceAdjustmentsTitle).toBeInTheDocument();

    await act(async () => {
      await runAxeTest({ rootNode: container });
    });
  });

  it('should render correct fields', async () => {
    const {
      getByText,
      findByText,
    } = renderInvoiceAdjustments();

    const invoiceAdjustmentsTitle = await findByText('Invoice adjustments');

    expect(invoiceAdjustmentsTitle).toBeInTheDocument();
    expect(getByText('Add adjustment')).toBeInTheDocument();
  });

  describe('when clicking "Add adjustment" button', () => {
    it('new Adjustment card should be rendered', async () => {
      const {
        findByRole,
        getByText,
      } = renderInvoiceAdjustments();

      const addButton = await findByRole('button', { name: 'Add adjustment' });
      fireEvent.click(addButton);

      expect(getByText('Adjustment 1')).toBeInTheDocument();
    });

    it('with correct fields', async () => {
      const {
        findByRole,
        getByRole,
        getByText,
        getAllByText,
      } = renderInvoiceAdjustments();

      const addButton = await findByRole('button', { name: 'Add adjustment' });
      fireEvent.click(addButton);

      expect(getByText('Description')).toBeInTheDocument();
      expect(getAllByText('Amount')[0]).toBeInTheDocument();
      expect(getAllByText('Type')[0]).toBeInTheDocument();
      expect(getByText('Pro rate')).toBeInTheDocument();
      expect(getByText('Relation to total')).toBeInTheDocument();
      expect(getByText('Export to accounting')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Add fund distribution' })).toBeInTheDocument();
    });
  });

  describe('when clicking on trash icon button for an adjustment', () => {
    it('function for changing form should be called', async () => {
      const {
        findByRole,
        getAllByRole,
      } = renderInvoiceAdjustments();

      const addButton = await findByRole('button', { name: 'Add adjustment' });
      fireEvent.click(addButton);

      const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
      fireEvent.click(deleteButton);

      expect(setReferenceTablesMock).toHaveBeenCalled();
    });
  });

  describe('when choose percentage invoice adjustment type', () => {
    it('shold call the function to set the value', () => {
      const { getAllByText } = renderInvoiceAdjustments();

      const percentButton = getAllByText('%')[0];
      fireEvent.click(percentButton);

      expect(setReferenceTablesMock).toHaveBeenCalledWith(invoiceAdjustmentsTypePath, '"Percentage"');
    });
  });

  describe('when choose currency invoice adjustment type', () => {
    it('shold call the function to set the value', () => {
      const { getAllByText } = renderInvoiceAdjustments();

      const currencyButton = getAllByText('$')[0];
      fireEvent.click(currencyButton);

      expect(setReferenceTablesMock).toHaveBeenCalledWith(invoiceAdjustmentsTypePath, '"Amount"');
    });
  });

  describe('when clicking on "Add fund distribution" button', () => {
    it('should render fund distribution fields', async () => {
      const {
        findByRole,
        getByText,
      } = renderInvoiceAdjustments();

      const addFundDistributionBtn = await findByRole('button', { name: 'Add fund distribution' });
      fireEvent.click(addFundDistributionBtn);

      expect(getByText('Fund ID')).toBeInTheDocument();
      expect(getByText('Expense Class')).toBeInTheDocument();
    });
  });

  describe('when clicking on trash icon button for fund distributions', () => {
    it('should call the function to clean the fields', async () => {
      const {
        findByRole,
        getAllByRole,
      } = renderInvoiceAdjustments();

      const addFundDistributionBtn = await findByRole('button', { name: 'Add fund distribution' });
      fireEvent.click(addFundDistributionBtn);

      const deleteButton = getAllByRole('button', { name: /delete this item/i })[1];
      fireEvent.click(deleteButton);

      expect(setReferenceTablesMock).toHaveBeenCalled();
    });
  });
});
