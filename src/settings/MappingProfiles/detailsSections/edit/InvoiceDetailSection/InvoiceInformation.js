import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField,
  TextArea,
  Checkbox,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  DatePickerDecorator,
} from '../../../../../components';
import { useFieldMappingFieldValue } from '../../hooks';

import {
  getFieldName,
  getAcceptedValuesPath,
  getSubfieldName,
  renderFieldLabelWithInfo,
} from '../../utils';
import {
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  composeValidators,
  LOCK_TOTAL_FIELD,
  okapiShape,
  validateQuotedString,
  validateRequiredField,
} from '../../../../../utils';

export const InvoiceInformation = ({
  setReferenceTables,
  okapi,
}) => {
  const INVOICE_INFO_FIELDS_MAP = {
    INVOICE_DATE: getFieldName(0),
    STATUS: getFieldName(1),
    PAYMENT_DUE: getFieldName(2),
    PAYMENT_TERMS: getFieldName(3),
    APPROVAL_DATE: getFieldName(4),
    APPROVED_BY: getFieldName(5),
    ACQ_UNITS: 6,
    BILL_TO_NAME: 7,
    BILL_TO_ADDRESS: getFieldName(8),
    BATCH_GROUP: 9,
    SUB_TOTAL: getFieldName(10),
    ADJUSTMENTS_TOTAL: getFieldName(11),
    TOTAL: getFieldName(12),
    LOCK_TOTAL: getFieldName(13),
    NOTE: getFieldName(14),
  };

  const [lockTotalFromDetails] = useFieldMappingFieldValue([LOCK_TOTAL_FIELD]);
  const [isLockTotal, setIsLockTotal] = useState(!!lockTotalFromDetails);

  const acqUnitsLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.acqUnitIds`,
    `${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.acqUnitIds.info`,
  );

  return (
    <Accordion
      id="invoice-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.section`} />}
    >
      <Row left="xs">
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.invoiceDate`} />}
            name={INVOICE_INFO_FIELDS_MAP.INVOICE_DATE}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={validateRequiredField}
            required
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.status`} />}
            name={INVOICE_INFO_FIELDS_MAP.STATUS}
            validate={validateRequiredField}
            required
            disabled
          />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.paymentDue`} />}
            name={INVOICE_INFO_FIELDS_MAP.PAYMENT_DUE}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.paymentTerms`} />}
            name={INVOICE_INFO_FIELDS_MAP.PAYMENT_TERMS}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.approvalDate`} />}
            name={INVOICE_INFO_FIELDS_MAP.APPROVAL_DATE}
            disabled
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.approvedBy`} />}
            name={INVOICE_INFO_FIELDS_MAP.APPROVED_BY}
            disabled
          />
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getSubfieldName(INVOICE_INFO_FIELDS_MAP.ACQ_UNITS, 0, 0)}
            label={acqUnitsLabel}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.ACQUISITIONS_UNITS,
              wrapperSourcePath: 'acquisitionsUnits',
            }]}
            isRemoveValueAllowed
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(INVOICE_INFO_FIELDS_MAP.ACQ_UNITS)}
            validation={validateQuotedString}
            isMultiSelection
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(INVOICE_INFO_FIELDS_MAP.BILL_TO_NAME)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.billToName`} />}
            optionValue="value"
            optionLabel="value"
            parsedOptionValue="name"
            parsedOptionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.ADDRESSES,
              wrapperSourcePath: 'configs',
            }]}
            isRemoveValueAllowed
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(INVOICE_INFO_FIELDS_MAP.BILL_TO_NAME)}
            validation={validateQuotedString}
            okapi={okapi}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.billToAddress`} />}
            name={INVOICE_INFO_FIELDS_MAP.BILL_TO_ADDRESS}
            disabled
          />
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(INVOICE_INFO_FIELDS_MAP.BATCH_GROUP)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.batchGroupId`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.BATCH_GROUPS,
              wrapperSourcePath: 'batchGroups',
            }]}
            isRemoveValueAllowed
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(INVOICE_INFO_FIELDS_MAP.BATCH_GROUP)}
            validation={composeValidators(validateRequiredField, validateQuotedString)}
            required
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.subTotal`} />}
            name={INVOICE_INFO_FIELDS_MAP.SUB_TOTAL}
            disabled
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.adjustmentsTotal`} />}
            name={INVOICE_INFO_FIELDS_MAP.ADJUSTMENTS_TOTAL}
            disabled
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.total`} />}
            name={INVOICE_INFO_FIELDS_MAP.TOTAL}
            disabled
          />
        </Col>
        <Col xs={1}>
          <Checkbox
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.isLockTotal`} />}
            checked={isLockTotal}
            vertical
            onChange={() => {
              setIsLockTotal(!isLockTotal);
              if (isLockTotal) {
                setReferenceTables(INVOICE_INFO_FIELDS_MAP.LOCK_TOTAL, '');
              }
            }}
          />
        </Col>
        <Col xs={2}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.lockTotal`} />}
            name={INVOICE_INFO_FIELDS_MAP.LOCK_TOTAL}
            disabled={!isLockTotal}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <Field
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.note`} />}
            component={TextArea}
            name={INVOICE_INFO_FIELDS_MAP.NOTE}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceInformation.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
