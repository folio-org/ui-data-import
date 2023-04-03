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

import { InvoiceInformation } from '../InvoiceInformation';

const renderInvoiceInformation = () => {
  const component = () => (
    <InvoiceInformation
      setReferenceTables={noop}
      okapi={{}}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('InvoiceInformation', () => {
  it('should render correct fields', () => {
    const { getByText } = renderInvoiceInformation();

    expect(getByText('Invoice date')).toBeInTheDocument();
    expect(getByText('Status')).toBeInTheDocument();
    expect(getByText('Payment due')).toBeInTheDocument();
    expect(getByText('Terms')).toBeInTheDocument();
    expect(getByText('Approval date')).toBeInTheDocument();
    expect(getByText('Approved by')).toBeInTheDocument();
    expect(getByText('Acquisitions units')).toBeInTheDocument();
    expect(getByText('Bill to name')).toBeInTheDocument();
    expect(getByText('Bill to address')).toBeInTheDocument();
    expect(getByText('Batch group')).toBeInTheDocument();
    expect(getByText('Sub-total')).toBeInTheDocument();
    expect(getByText('Total adjustments')).toBeInTheDocument();
    expect(getByText('Calculated total amount')).toBeInTheDocument();
    expect(getByText('Lock total')).toBeInTheDocument();
    expect(getByText('Lock total amount')).toBeInTheDocument();
    expect(getByText('Note')).toBeInTheDocument();
  });

  it('should render required fields', () => {
    const { queryByText } = renderInvoiceInformation();

    expect(within(queryByText('Invoice date')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Status')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Batch group')).getByText(/\*/i)).toBeDefined();
  });

  it('some fields should be disabled by default', () => {
    const { getByLabelText } = renderInvoiceInformation();

    expect(getByLabelText(/status/i)).toBeDisabled();
    expect(getByLabelText(/approval date/i)).toBeDisabled();
    expect(getByLabelText(/approved by/i)).toBeDisabled();
    expect(getByLabelText(/bill to address/i)).toBeDisabled();
    expect(getByLabelText(/sub-total/i)).toBeDisabled();
    expect(getByLabelText(/total adjustments/i)).toBeDisabled();
    expect(getByLabelText(/calculated total amount/i)).toBeDisabled();
    expect(getByLabelText(/lock total amount/i)).toBeDisabled();
  });

  describe('when Lock total checkbox is checked', () => {
    it('"Lock total amount" field should be enabled', () => {
      const { getByLabelText } = renderInvoiceInformation();

      const lockTotalCheckbox = getByLabelText('Lock total');

      fireEvent.click(lockTotalCheckbox);

      expect(getByLabelText(/lock total amount/i)).not.toBeDisabled();
    });
  });
});
