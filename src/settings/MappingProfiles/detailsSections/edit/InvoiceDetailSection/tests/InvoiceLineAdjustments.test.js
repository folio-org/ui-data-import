import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { get } from 'lodash';

import { runAxeTest } from '@folio/stripes-testing';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { getSubfieldName } from '../../../utils';
import INVOICE from '../../../../initialDetails/INVOICE';
import {
  INVOICE_LINE_ADJUSTMENTS_INDEX,
  InvoiceLineAdjustments,
} from '../InvoiceLineAdjustments';

const mockLineAdjustmentsFields = get(INVOICE.mappingFields, 'invoiceLines.[0].fields[15].subfields[0]');

jest.mock('../../../hooks', () => ({
  useFieldMappingFieldValue: () => ['USD'],
  useFieldMappingRefValues: () => [[mockLineAdjustmentsFields]],
}));

const setReferenceTablesMock = jest.fn();
const okapi = buildOkapi();

const INVOICE_LINES_FIELD_INDEX = 27;
const invoiceLineAdjustmentsPath = getSubfieldName(INVOICE_LINES_FIELD_INDEX, INVOICE_LINE_ADJUSTMENTS_INDEX, 0);

const renderInvoiceLineAdjustments = () => {
  const component = () => (
    <InvoiceLineAdjustments
      invoiceLinesFieldIndex={INVOICE_LINES_FIELD_INDEX}
      setReferenceTables={setReferenceTablesMock}
      mappingFields={INVOICE.mappingFields}
      initialFields={{}}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('InvoiceLineAdjustments edit component', () => {
  beforeEach(() => {
    setReferenceTablesMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderInvoiceLineAdjustments();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', () => {
    const { getByRole } = renderInvoiceLineAdjustments();

    expect(getByRole('button', { name: 'Add adjustment' })).toBeInTheDocument();
  });

  describe('when clicking "Add adjustment" button', () => {
    it('new Adjustment card should be rendered', () => {
      const {
        getByRole,
        getByText,
      } = renderInvoiceLineAdjustments();

      const addButton = getByRole('button', { name: 'Add adjustment' });
      fireEvent.click(addButton);

      expect(getByText('Adjustment 1')).toBeInTheDocument();
    });

    it('should be rendered with correct fields', () => {
      const { getByText } = renderInvoiceLineAdjustments();

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Amount')).toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Relation to total')).toBeInTheDocument();
      expect(getByText('Export to accounting')).toBeInTheDocument();
    });

    describe('when click on trash icon', () => {
      it('shold call the function to clean fields', () => {
        const { getByRole } = renderInvoiceLineAdjustments();

        const deleteButton = getByRole('button', { name: 'Delete this item' });
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalledWith(invoiceLineAdjustmentsPath, null);
      });
    });
  });
});
