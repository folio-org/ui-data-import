import React from 'react';
import { fireEvent } from '@testing-library/react';
import {
  noop,
  get,
} from 'lodash';

import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../../test/jest/__mock__';
import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { InvoiceLineFundDistribution } from '../InvoiceLineFundDistribution';
import INVOICE from '../../../../initialDetails/INVOICE';

global.fetch = jest.fn();

const okapi = buildOkapi();
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
      getMappingSubfieldsFieldValue={jest.fn().mockReturnValue('26')}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('InvoiceLineFundDistribution edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const {
      container,
      findByText,
    } = renderInvoiceLineFundDistribution();

    const addFundDistributionButton = await findByText('Invoice line fund distribution');

    expect(addFundDistributionButton).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const { findByRole } = renderInvoiceLineFundDistribution();

    const addFundDistributionButton = await findByRole('button', { name: 'Add fund distribution' });

    expect(addFundDistributionButton).toBeInTheDocument();
  });

  describe('when clicking "Add fund distribution" button', () => {
    it('correct fields should be rendered', async () => {
      const {
        findByRole,
        getByText,
      } = renderInvoiceLineFundDistribution();

      const addButton = await findByRole('button', { name: 'Add fund distribution' });
      fireEvent.click(addButton);

      expect(getByText('Fund ID')).toBeInTheDocument();
      expect(getByText('Expense Class')).toBeInTheDocument();
      expect(getByText('Value')).toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Amount')).toBeInTheDocument();
    });

    it('some fields should be disabled by default', async () => {
      const { findByLabelText } = renderInvoiceLineFundDistribution();

      const amountField = await findByLabelText('Amount');

      expect(amountField).toBeDisabled();
    });
  });
});
