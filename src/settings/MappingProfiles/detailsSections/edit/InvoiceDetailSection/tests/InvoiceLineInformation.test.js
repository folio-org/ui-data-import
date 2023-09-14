import React from 'react';
import {
  fireEvent,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import { get } from 'lodash';

import { runAxeTest } from '@folio/stripes-testing';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { InvoiceLineInformation } from '../InvoiceLineInformation';
import INVOICE from '../../../../initialDetails/INVOICE';

const mockVendorRefNumberFields = get(INVOICE.mappingFields, 'invoiceLines.[0].fields[4].subfields[0]');

jest.mock('../../../hooks', () => ({
  useFieldMappingRefValues: () => [[mockVendorRefNumberFields]],
}));

const okapi = buildOkapi();

const setReferenceTablesMock = jest.fn();

const renderInvoiceLineInformation = () => {
  const component = () => (
    <InvoiceLineInformation
      setReferenceTables={setReferenceTablesMock}
      initialFields={{}}
      mappingFields={INVOICE.mappingFields}
      invoiceLinesFieldIndex={26}
      accountingNumberOptions={[]}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('InvoiceLineInformation edit component', () => {
  afterAll(() => {
    setReferenceTablesMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderInvoiceLineInformation();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', () => {
    const {
      getByText,
      getByRole,
    } = renderInvoiceLineInformation();

    expect(getByText('Description')).toBeInTheDocument();
    expect(getByText('PO line number')).toBeInTheDocument();
    expect(getByText('Invoice line number')).toBeInTheDocument();
    expect(getByText('Invoice line status')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Add vendor reference number' })).toBeInTheDocument();
    expect(getByText('Subscription info')).toBeInTheDocument();
    expect(getByText('Subscription start date')).toBeInTheDocument();
    expect(getByText('Subscription end date')).toBeInTheDocument();
    expect(getByText('Comment')).toBeInTheDocument();
    expect(getByText('Accounting code')).toBeInTheDocument();
    expect(getByText('Account number')).toBeInTheDocument();
    expect(getByText('Quantity')).toBeInTheDocument();
    expect(getByText('Sub-total')).toBeInTheDocument();
    expect(getByText('Release encumbrance')).toBeInTheDocument();
  });

  it('should render required fields', () => {
    const { queryByText } = renderInvoiceLineInformation();

    expect(within(queryByText('Description')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Quantity')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Sub-total')).getByText(/\*/i)).toBeDefined();
  });

  it('some fields should be disabled by default', () => {
    const { getByLabelText } = renderInvoiceLineInformation();

    expect(getByLabelText('Invoice line number')).toBeDisabled();
    expect(getByLabelText('Invoice line status')).toBeDisabled();
    expect(getByLabelText('Accounting code')).toBeDisabled();
  });

  describe('when clicking "Add vendor reference number" button', () => {
    it('correct fields should be rendered', () => {
      const {
        getByRole,
        getByText,
      } = renderInvoiceLineInformation();

      const addButton = getByRole('button', { name: 'Add vendor reference number' });
      fireEvent.click(addButton);

      expect(getByText('Vendor reference number')).toBeInTheDocument();
      expect(getByText('Vendor reference type')).toBeInTheDocument();
    });
  });

  describe('when clicking on trash icon button for a vendor reference number', () => {
    it('function for changing form should be called', () => {
      const {
        getByRole,
        getAllByRole,
      } = renderInvoiceLineInformation();

      const addButton = getByRole('button', { name: 'Add vendor reference number' });
      fireEvent.click(addButton);

      const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
      fireEvent.click(deleteButton);

      expect(setReferenceTablesMock).toHaveBeenCalled();
    });
  });
});
