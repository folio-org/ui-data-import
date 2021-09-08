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
  mappingProfileSubfieldShape,
  okapiShape,
  REPEATABLE_ACTIONS,
} from '../../../../../utils';

export const InvoiceLineInformation = ({
  vendorReferenceNumbers,
  accountingNumberOptions,
  initialFields,
  mappingFields,
  setReferenceTables,
  okapi,
}) => {
  const { formatMessage } = useIntl();

  const releaseEncumbranceCheckbox = mappingFields?.[26].subfields[0]?.fields[13].booleanFieldAction;
  const vendorRefTypesList = createOptionsList(REF_NUMBER_TYPE_OPTIONS, formatMessage, 'labelId');

  const getPathToAddField = currentIndex => getInnerSubfieldsPath(currentIndex, 0, 4);
  const onVendorRefNumberAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
    const repeatableFieldActionPath = getInnerRepeatableFieldPath(fieldIndex, 0, 4);

    handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
  };
  const onVendorRefNumbersClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
    const repeatableFieldActionPath = getInnerRepeatableFieldPath(fieldIndex, 0, 4);

    if (isLastSubfield) {
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
            name={getSubfieldName(26, 0, 0)}
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
            name={getSubfieldName(26, 1, 0)}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.invoiceLineNumber`} />}
            name={getSubfieldName(26, 2, 0)}
            disabled
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.invoiceLineStatus`} />}
            name={getSubfieldName(26, 3, 0)}
            disabled
          />
        </Col>
      </Row>
      <RepeatableField
        fields={vendorReferenceNumbers}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.vendorRefNumber.addLabel`} />}
        onAdd={() => onAdd(vendorReferenceNumbers, 'invoiceLines.fields[4].subfields[0]', 26, initialFields, onVendorRefNumberAdd, 'order', getPathToAddField)}
        onRemove={index => onRemove(index, vendorReferenceNumbers, 26, onVendorRefNumbersClean, 'order', getPathToAddField)}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={6}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.vendorRefNo`} />}
                name={getInnerSubfieldName(26, 0, 4, 0, index)}
              />
            </Col>
            <Col xs={6}>
              <AcceptedValuesField
                component={TextField}
                name={getInnerSubfieldName(26, 0, 4, 1, index)}
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
            name={getSubfieldName(26, 5, 0)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subscriptionStartDate`} />}
            name={getSubfieldName(26, 6, 0)}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subscriptionEndDate`} />}
            name={getSubfieldName(26, 7, 0)}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.comment`} />}
            name={getSubfieldName(26, 8, 0)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.accountingCode`} />}
            name={getSubfieldName(26, 9, 0)}
            disabled
          />
        </Col>
        <Col xs={3}>
          {
            isEmpty(accountingNumberOptions) ? (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.accountNumber`} />}
                name={getSubfieldName(26, 10, 0)}
              />
            ) : (
              <AcceptedValuesField
                component={TextField}
                name={getSubfieldName(26, 10, 0)}
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
            name={getSubfieldName(26, 11, 0)}
            validate={validateRequiredField}
            required
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subTotal`} />}
            name={getSubfieldName(26, 12, 0)}
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
            name={getBoolSubfieldName(26, 13, 0)}
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
  vendorReferenceNumbers: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  accountingNumberOptions: PropTypes.arrayOf(PropTypes.object),
  okapi: okapiShape.isRequired,
  mappingFields: PropTypes.arrayOf(PropTypes.object),
};

InvoiceLineInformation.defaultProps = { accountingNumberOptions: [] };
