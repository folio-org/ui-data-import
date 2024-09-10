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

import { InvoiceLineAdjustments } from '../InvoiceLineAdjustments';
import INVOICE from '../../../../initialDetails/INVOICE';

const mockLineAdjustmentsFields = get(INVOICE.mappingFields, 'invoiceLines.[0].fields[15].subfields[0]');

jest.mock('../../../hooks', () => ({
  useFieldMappingFieldValue: () => ['USD'],
  useFieldMappingRefValues: () => [[mockLineAdjustmentsFields]],
}));

const setReferenceTablesMock = jest.fn();
const okapi = buildOkapi();

const invoiceLineAdjustmentsPath = 'profile.mappingDetails.mappingFields[27].subfields.0.fields.15.value';
const invoiceLineAdjustmentsTypePath = 'profile.mappingDetails.mappingFields[27].subfields.0.fields.15.subfields.0.fields.2.value';

const renderInvoiceLineAdjustments = () => {
  const component = () => (
    <InvoiceLineAdjustments
      invoiceLinesFieldIndex={27}
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
        const { container } = renderInvoiceLineAdjustments();

        const deleteButton = container.querySelector('[data-test-repeatable-field-remove-item-button="true"]');
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalledWith(invoiceLineAdjustmentsPath, null);
      });
    });

    describe('when choose percentage invoice adjustment type', () => {
      it('shold call the function to set the value', () => {
        const { getByText } = renderInvoiceLineAdjustments();

        const percentButton = getByText('%');
        fireEvent.click(percentButton);

        expect(setReferenceTablesMock).toHaveBeenCalledWith(invoiceLineAdjustmentsTypePath, '"Percentage"');
      });
    });

    describe('when choose currency invoice adjustment type', () => {
      it('shold call the function to set the value', () => {
        const { getByText } = renderInvoiceLineAdjustments();

        const currencyButton = getByText('$');
        fireEvent.click(currencyButton);

        expect(setReferenceTablesMock).toHaveBeenCalledWith(invoiceLineAdjustmentsTypePath, '"Amount"');
      });
    });
  });
});
