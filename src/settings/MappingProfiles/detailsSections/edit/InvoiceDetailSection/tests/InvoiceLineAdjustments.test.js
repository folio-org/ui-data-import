import React from 'react';
import { fireEvent } from '@testing-library/react';
import {
  noop,
  get,
} from 'lodash';

import { runAxeTest } from '@folio/stripes-testing';

import {
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

const renderInvoiceLineAdjustments = () => {
  const component = () => (
    <InvoiceLineAdjustments
      invoiceLinesFieldIndex={26}
      setReferenceTables={noop}
      mappingFields={INVOICE.mappingFields}
      initialFields={{}}
      okapi={{}}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('InvoiceLineAdjustments', () => {
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

    it('with correct fields', () => {
      const { getByText } = renderInvoiceLineAdjustments();

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Amount')).toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Relation to total')).toBeInTheDocument();
      expect(getByText('Export to accounting')).toBeInTheDocument();
    });
  });
});
