import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import { getFieldValue } from '../../utils';
import { mappingProfileFieldShape } from '../../../../../utils';

export const InvoiceInformation = ({ mappingDetails }) => {
  const prohibitionIconElement = fieldName => <ProhibitionIcon fieldName={fieldName} />;

  const invoiceDateValue = getFieldValue(mappingDetails, 'invoiceDate', 'value');
  const statusValue = getFieldValue(mappingDetails, 'status', 'value');
  const paymentDueValue = getFieldValue(mappingDetails, 'paymentDue', 'value');
  const paymentTermsValue = getFieldValue(mappingDetails, 'paymentTerms', 'value');
  const approvalDateValue = getFieldValue(mappingDetails, 'approvalDate', 'value');
  const approvedByValue = getFieldValue(mappingDetails, 'approvedBy', 'value');
  const acqUnitIdsValue = mappingDetails.find(item => item.name === 'acqUnitIds')?.subfields[0]?.fields[0]?.value;
  const billToNameValue = getFieldValue(mappingDetails, 'billTo', 'value');
  const billToAddressValue = getFieldValue(mappingDetails, 'billToAddress', 'value');
  const batchGroupIdValue = getFieldValue(mappingDetails, 'batchGroupId', 'value');
  const subTotalValue = getFieldValue(mappingDetails, 'subTotal', 'value');
  const adjustmentsTotalValue = getFieldValue(mappingDetails, 'adjustmentsTotal', 'value');
  const totalAmountValue = getFieldValue(mappingDetails, 'total', 'value');
  const lockTotalAmountValue = getFieldValue(mappingDetails, 'lockTotal', 'value');
  const noteValue = getFieldValue(mappingDetails, 'note', 'value');

  return (
    <Accordion
      id="view-invoice-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-invoice-date
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.invoiceDate`} />}
            value={invoiceDateValue}
          />
        </Col>
        <Col
          data-test-status
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.status`} />}
            value={statusValue}
          />
        </Col>
        <Col
          data-test-payment-due
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.paymentDue`} />}
            value={paymentDueValue}
          />
        </Col>
        <Col
          data-test-payment-terms
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.paymentTerms`} />}
            value={paymentTermsValue}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-approval-date
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.approvalDate`} />}
            value={approvalDateValue || prohibitionIconElement('approval-date')}
          />
        </Col>
        <Col
          data-test-approved-by
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.approvedBy`} />}
            value={approvedByValue || prohibitionIconElement('approved-by')}
          />
        </Col>
        <Col
          data-test-acq-acquisitions-units
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.acqUnitIds`} />}
            value={acqUnitIdsValue}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-bill-to-name
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.billToName`} />}
            value={billToNameValue}
          />
        </Col>
        <Col
          data-test-bill-to-address
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.billToAddress`} />}
            value={billToAddressValue || prohibitionIconElement('bill-to-address')}
          />
        </Col>
        <Col
          data-test-bill-to-name
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.batchGroupId`} />}
            value={batchGroupIdValue}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-sub-total
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.subTotal`} />}
            value={subTotalValue || prohibitionIconElement('sub-total')}
          />
        </Col>
        <Col
          data-test-adjustments-total
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.adjustmentsTotal`} />}
            value={adjustmentsTotalValue || prohibitionIconElement('adjustments-total')}
          />
        </Col>
        <Col
          data-test-total-amount
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.total`} />}
            value={totalAmountValue || prohibitionIconElement('total-amount')}
          />
        </Col>
        <Col
          data-test-lock-total-amount
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.lockTotal`} />}
            value={lockTotalAmountValue}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-note
          xs={12}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.note`} />}
            value={noteValue}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceInformation.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
