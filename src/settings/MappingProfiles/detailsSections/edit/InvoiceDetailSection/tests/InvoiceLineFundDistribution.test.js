import React from 'react';
import { fireEvent } from '@testing-library/react';
import {
  noop,
  get,
} from 'lodash';

import { runAxeTest } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { InvoiceLineFundDistribution } from '../InvoiceLineFundDistribution';
import INVOICE from '../../../../initialDetails/INVOICE';

const mockFundDistributionsFields = get(INVOICE.mappingFields, 'invoiceLines.[0].fields[14].subfields[0]');

jest.mock('../../../hooks', () => ({
  useFieldMappingFieldValue: () => ['USD'],
  useFieldMappingRefValues: () => [[mockFundDistributionsFields]],
}));

const renderInvoiceLineFundDistribution = () => {
  const component = () => (
    <InvoiceLineFundDistribution
      invoiceLinesFieldIndex={26}
      setReferenceTables={noop}
      initialFields={{}}
      getMappingSubfieldsFieldValue={noop}
      okapi={{}}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('InvoiceLineFundDistribution edit component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderInvoiceLineFundDistribution();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', () => {
    const { getByRole } = renderInvoiceLineFundDistribution();

    expect(getByRole('button', { name: 'Add fund distribution' })).toBeInTheDocument();
  });

  describe('when clicking "Add fund distribution" button', () => {
    it('correct fields should be rendered', () => {
      const {
        getByRole,
        getByText,
      } = renderInvoiceLineFundDistribution();

      const addButton = getByRole('button', { name: 'Add fund distribution' });
      fireEvent.click(addButton);

      expect(getByText('Fund ID')).toBeInTheDocument();
      expect(getByText('Expense Class')).toBeInTheDocument();
      expect(getByText('Value')).toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Amount')).toBeInTheDocument();
    });

    it('some fields should be disabled by default', () => {
      const { getByLabelText } = renderInvoiceLineFundDistribution();

      expect(getByLabelText('Amount')).toBeDisabled();
    });
  });
});
