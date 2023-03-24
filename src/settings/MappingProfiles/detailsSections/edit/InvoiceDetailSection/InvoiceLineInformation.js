import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'redux-form';

import { isEmpty } from 'lodash';

import {
  Accordion,
  Row,
  Col,
  TextField,
  Checkbox,
  RepeatableField,
} from '@folio/stripes/components';
import { REF_NUMBER_TYPE_OPTIONS } from '@folio/stripes-acq-components';

import {
  AcceptedValuesField,
  DatePickerDecorator,
} from '../../../../../components';
import { useFieldMappingRefValues } from '../../hooks';

import {
  getSubfieldName,
  getBoolSubfieldName,
  onAdd,
  onRemove,
  getInnerSubfieldName,
  getInnerSubfieldsPath,
  getInnerRepeatableFieldPath,
  handleRepeatableFieldAndActionAdd,
  handleRepeatableFieldAndActionClean,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  BOOLEAN_ACTIONS,
  createOptionsList,
  validateRequiredField,
  okapiShape,
  REPEATABLE_ACTIONS,
} from '../../../../../utils';

export const InvoiceLineInformation = ({
  invoiceLinesFieldIndex,
  accountingNumberOptions,
  initialFields,
  mappingFields,
  setReferenceTables,
  okapi,
}) => {
  const INVOICE_LINE_INFO_FIELDS_MAP = {
    DESCRIPTION: getSubfieldName(invoiceLinesFieldIndex, 0, 0),
    PO_LINE_NUMBER: getSubfieldName(invoiceLinesFieldIndex, 1, 0),
    INVOICE_LINE_NUMBER: getSubfieldName(invoiceLinesFieldIndex, 2, 0),
    INVOICE_LINE_STATUS: getSubfieldName(invoiceLinesFieldIndex, 3, 0),
    VENDOR_REF_NO: index => getInnerSubfieldName(invoiceLinesFieldIndex, 0, 4, 0, index),
    VENDOR_REF_TYPE: index => getInnerSubfieldName(invoiceLinesFieldIndex, 0, 4, 1, index),
    SUBSCRIPTION_INFO: getSubfieldName(invoiceLinesFieldIndex, 5, 0),
    SUBSCRIPTION_START_DATE: getSubfieldName(invoiceLinesFieldIndex, 6, 0),
    SUBSCRIPTION_END_DATE: getSubfieldName(invoiceLinesFieldIndex, 7, 0),
    COMMENT: getSubfieldName(invoiceLinesFieldIndex, 8, 0),
    ACCOUNTING_CODE: getSubfieldName(invoiceLinesFieldIndex, 9, 0),
    ACCOUNT_NUMBER: getSubfieldName(invoiceLinesFieldIndex, 10, 0),
    QUANTITY: getSubfieldName(invoiceLinesFieldIndex, 11, 0),
    SUB_TOTAL: getSubfieldName(invoiceLinesFieldIndex, 12, 0),
    RELEASE_ENCUMBRANCE: getBoolSubfieldName(invoiceLinesFieldIndex, 13, 0),
  };

  const { formatMessage } = useIntl();

  const [vendorReferenceNumbers] = useFieldMappingRefValues(['invoiceLines.[0].fields[4].subfields']);
  const releaseEncumbranceCheckbox = mappingFields?.[invoiceLinesFieldIndex]?.subfields[0]?.fields[13]?.booleanFieldAction;
  const vendorRefTypesList = createOptionsList(REF_NUMBER_TYPE_OPTIONS, formatMessage, 'labelId');

  const getPathToAddField = currentIndex => getInnerSubfieldsPath(currentIndex, 0, 4);
  const onVendorRefNumberAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
    const repeatableFieldActionPath = getInnerRepeatableFieldPath(fieldIndex, 0, 4);

    handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
  };
  const onVendorRefNumbersClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
    const repeatableFieldActionPath = getInnerRepeatableFieldPath(fieldIndex, 0, 4);

    if (isLastSubfield && !refTable) {
      handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, REPEATABLE_ACTIONS.EXTEND_EXISTING, setReferenceTables, isLastSubfield);
    } else {
      handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
    }
  };

  return (
    <Accordion
      id="invoice-line-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.section`} />}
    >
      <Row left="xs">
        <Col xs={12}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.description`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.DESCRIPTION}
            validate={validateRequiredField}
            required
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.POLineNumber`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.PO_LINE_NUMBER}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.invoiceLineNumber`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.INVOICE_LINE_NUMBER}
            disabled
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.invoiceLineStatus`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.INVOICE_LINE_STATUS}
            disabled
          />
        </Col>
      </Row>
      <RepeatableField
        fields={vendorReferenceNumbers}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.vendorRefNumber.addLabel`} />}
        onAdd={() => onAdd(vendorReferenceNumbers, 'invoiceLines.fields[4].subfields[0]', invoiceLinesFieldIndex, initialFields, onVendorRefNumberAdd, 'order', getPathToAddField)}
        onRemove={index => onRemove(index, vendorReferenceNumbers, invoiceLinesFieldIndex, onVendorRefNumbersClean, 'order', getPathToAddField)}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={6}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.vendorRefNo`} />}
                name={INVOICE_LINE_INFO_FIELDS_MAP.VENDOR_REF_NO(index)}
              />
            </Col>
            <Col xs={6}>
              <AcceptedValuesField
                component={TextField}
                name={INVOICE_LINE_INFO_FIELDS_MAP.VENDOR_REF_TYPE(index)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.vendorRefType`} />}
                optionValue="value"
                optionLabel="label"
                isRemoveValueAllowed
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                acceptedValuesList={vendorRefTypesList}
                okapi={okapi}
              />
            </Col>
          </Row>
        )}
      />
      <Row left="xs">
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subscriptionInfo`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.SUBSCRIPTION_INFO}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subscriptionStartDate`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.SUBSCRIPTION_START_DATE}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subscriptionEndDate`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.SUBSCRIPTION_END_DATE}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.comment`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.COMMENT}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.accountingCode`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.ACCOUNTING_CODE}
            disabled
          />
        </Col>
        <Col xs={3}>
          {
            isEmpty(accountingNumberOptions) ? (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.accountNumber`} />}
                name={INVOICE_LINE_INFO_FIELDS_MAP.ACCOUNT_NUMBER}
              />
            ) : (
              <AcceptedValuesField
                component={TextField}
                name={INVOICE_LINE_INFO_FIELDS_MAP.ACCOUNT_NUMBER}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.accountNumber`} />}
                optionValue="value"
                optionLabel="label"
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                acceptedValuesList={accountingNumberOptions}
                okapi={okapi}
              />
            )
          }
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.quantity`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.QUANTITY}
            validate={validateRequiredField}
            required
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subTotal`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.SUB_TOTAL}
            validate={validateRequiredField}
            required
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={12}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.releaseEncumbrance`} />}
            name={INVOICE_LINE_INFO_FIELDS_MAP.RELEASE_ENCUMBRANCE}
            vertical
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={releaseEncumbranceCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceLineInformation.propTypes = {
  invoiceLinesFieldIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  accountingNumberOptions: PropTypes.arrayOf(PropTypes.object),
  okapi: okapiShape.isRequired,
  mappingFields: PropTypes.arrayOf(PropTypes.object),
};

InvoiceLineInformation.defaultProps = { accountingNumberOptions: [] };
