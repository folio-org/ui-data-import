import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { noop } from 'lodash';

import { runAxeTest } from '@folio/stripes-testing';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { STATUS_CODES } from '../../../../../../utils';
import { InvoiceInformation } from '../InvoiceInformation';

global.fetch = jest.fn();

const okapi = buildOkapi();

const renderInvoiceInformation = () => {
  const component = () => (
    <InvoiceInformation
      setReferenceTables={noop}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('InvoiceInformation edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: STATUS_CODES.OK,
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
    } = renderInvoiceInformation();

    const inVoiceInformationTitle = await findByText('Invoice information');

    expect(inVoiceInformationTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const {
      getByText,
      findByText,
    } = renderInvoiceInformation();

    const inVoiceInformationTitle = await findByText('Invoice information');

    expect(inVoiceInformationTitle).toBeInTheDocument();

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

  it('should render required fields', async () => {
    const { findByText } = renderInvoiceInformation();

    const poStatusField = await findByText('Invoice date');
    const vendorField = await findByText('Status');
    const orderTypeField = await findByText('Batch group');

    expect(poStatusField.lastElementChild.innerHTML).toEqual('*');
    expect(vendorField.lastElementChild.innerHTML).toEqual('*');
    expect(orderTypeField.lastElementChild.innerHTML).toEqual('*');
  });

  it('some fields should be disabled by default', async () => {
    const { findByLabelText } = renderInvoiceInformation();

    const statusField = await findByLabelText(/status/i);
    const approvalDateField = await findByLabelText(/approval date/i);
    const approvedByField = await findByLabelText(/approved by/i);
    const billToAddress = await findByLabelText(/bill to address/i);
    const subTotalField = await findByLabelText(/sub-total/i);
    const totalAdjustmentsField = await findByLabelText(/total adjustments/i);
    const calculatedTotalAmountField = await findByLabelText(/calculated total amount/i);
    const lockTotalAmount = await findByLabelText(/lock total amount/i);

    expect(statusField).toBeDisabled();
    expect(approvalDateField).toBeDisabled();
    expect(approvedByField).toBeDisabled();
    expect(billToAddress).toBeDisabled();
    expect(subTotalField).toBeDisabled();
    expect(totalAdjustmentsField).toBeDisabled();
    expect(calculatedTotalAmountField).toBeDisabled();
    expect(lockTotalAmount).toBeDisabled();
  });

  describe('when Lock total checkbox is checked', () => {
    it('"Lock total amount" field should be enabled', async () => {
      const { findByLabelText } = renderInvoiceInformation();

      const lockTotalCheckbox = await findByLabelText('Lock total');

      fireEvent.click(lockTotalCheckbox);

      const lockTotalAmountField = await findByLabelText(/lock total amount/i);

      expect(lockTotalAmountField).not.toBeDisabled();
    });
  });
});
