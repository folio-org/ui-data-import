import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';
import { ViewRepeatableField } from '../ViewRepeatableField';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getFieldValue,
  transformSubfieldsData,
  renderCheckbox,
} from '../../utils';
import { mappingProfileFieldShape } from '../../../../../utils';

export const InvoiceLineInformation = ({ invoiceLineMappingDetails }) => {
  const noValueElement = <NoValue />;
  const prohibitionIconElement = fieldName => <ProhibitionIcon fieldName={fieldName} />;

  const descriptionValue = getFieldValue(invoiceLineMappingDetails, 'description', 'value');
  const poLineNumberValue = getFieldValue(invoiceLineMappingDetails, 'poLineId', 'value');
  const invoiceLineNumberValue = getFieldValue(invoiceLineMappingDetails, 'invoiceLineNumber', 'value');
  const invoiceLineStatusValue = getFieldValue(invoiceLineMappingDetails, 'invoiceLineStatus', 'value');
  const referenceNumbers = getFieldValue(invoiceLineMappingDetails, 'referenceNumbers', 'subfields');
  const subscriptionInfoValue = getFieldValue(invoiceLineMappingDetails, 'subscriptionInfo', 'value');
  const subscriptionStartDateValue = getFieldValue(invoiceLineMappingDetails, 'subscriptionStart', 'value');
  const subscriptionEndDateValue = getFieldValue(invoiceLineMappingDetails, 'subscriptionEnd', 'value');
  const commentValue = getFieldValue(invoiceLineMappingDetails, 'comment', 'value');
  const accountingCodeValue = getFieldValue(invoiceLineMappingDetails, 'lineAccountingCode', 'value');
  const accountNumberValue = getFieldValue(invoiceLineMappingDetails, 'accountNumber', 'value');
  const quantityValue = getFieldValue(invoiceLineMappingDetails, 'quantity', 'value');
  const subTotalValue = getFieldValue(invoiceLineMappingDetails, 'lineSubTotal', 'value');
  const releaseEncumbranceValue = getFieldValue(invoiceLineMappingDetails, 'releaseEncumbrance', 'booleanFieldAction');

  const referenceNumbersVisibleColumns = ['refNumber', 'refNumberType'];
  const referenceNumbersMapping = {
    refNumber: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.vendorRefNo`} />
    ),
    refNumberType: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.vendorRefType`} />
    ),
  };
  const referenceNumbersFormatter = {
    refNumber: x => x?.refNumber || noValueElement,
    refNumberType: x => x?.refNumberType || noValueElement,
  };
  const referenceNumbersFieldsMap = [
    {
      field: 'refNumber',
      key: 'value',
    }, {
      field: 'refNumberType',
      key: 'value',
    },
  ];
  const referenceNumbersData = transformSubfieldsData(referenceNumbers, referenceNumbersFieldsMap);

  return (
    <Accordion
      id="invoice-line-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-invoice-line-description
          xs={12}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.description`} />}
            value={descriptionValue}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-invoice-line-po-line-number
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.POLineNumber`} />}
            value={poLineNumberValue}
          />
        </Col>
        <Col
          data-test-invoice-line-number
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.invoiceLineNumber`} />}
            value={invoiceLineNumberValue || prohibitionIconElement('invoice-line-number')}
          />
        </Col>
        <Col
          data-test-invoice-line-status
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.invoiceLineStatus`} />}
            value={invoiceLineStatusValue || prohibitionIconElement('invoice-line-status')}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-invoice-line-vendor-reference-numbers
          xs={12}
        >
          <ViewRepeatableField
            fieldData={referenceNumbersData}
            visibleColumns={referenceNumbersVisibleColumns}
            columnMapping={referenceNumbersMapping}
            formatter={referenceNumbersFormatter}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-invoice-line-subscription-info
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subscriptionInfo`} />}
            value={subscriptionInfoValue}
          />
        </Col>
        <Col
          data-test-invoice-line-subscription-start-date
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subscriptionStartDate`} />}
            value={subscriptionStartDateValue}
          />
        </Col>
        <Col
          data-test-invoice-line-subscription-end-date
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subscriptionEndDate`} />}
            value={subscriptionEndDateValue}
          />
        </Col>
        <Col
          data-test-invoice-line-comment
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.comment`} />}
            value={commentValue}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-invoice-line-accounting-code
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.accountingCode`} />}
            value={accountingCodeValue || prohibitionIconElement('invoice-line-accounting-code')}
          />
        </Col>
        <Col
          data-test-invoice-line-account-number
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.accountNumber`} />}
            value={accountNumberValue}
          />
        </Col>
        <Col
          data-test-invoice-line-quantity
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.quantity`} />}
            value={quantityValue}
          />
        </Col>
        <Col
          data-test-invoice-line-sub-total
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subTotal`} />}
            value={subTotalValue}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-invoice-line-release-encumbrance
          xs={12}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.releaseEncumbrance`} />}
            value={renderCheckbox('invoice.invoiceLineInformation.field.releaseEncumbrance', releaseEncumbranceValue)}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceLineInformation.propTypes = { invoiceLineMappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
