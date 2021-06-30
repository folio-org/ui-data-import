import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { noop } from 'lodash';

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

import {
  getFieldName,
  getAcceptedValuesPath,
  getSubfieldName,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  okapiShape,
  validateRequiredField,
  isFieldPristine,
} from '../../../../../utils';

export const InvoiceInformation = ({
  hasLockTotal,
  setReferenceTables,
  okapi,
}) => {
  const [isLockTotal, setIsLockTotal] = useState(hasLockTotal);

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
            name={getFieldName(0)}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={validateRequiredField}
            isEqual={isFieldPristine}
            required
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.status`} />}
            name={getFieldName(1)}
            validate={validateRequiredField}
            isEqual={isFieldPristine}
            required
            disabled
          />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.paymentDue`} />}
            name={getFieldName(2)}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            isEqual={isFieldPristine}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.paymentTerms`} />}
            name={getFieldName(3)}
            isEqual={isFieldPristine}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.approvalDate`} />}
            name={getFieldName(4)}
            isEqual={isFieldPristine}
            disabled
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.approvedBy`} />}
            name={getFieldName(5)}
            isEqual={isFieldPristine}
            disabled
          />
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getSubfieldName(6, 0, 0)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.acqUnitIds`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/acquisitions-units/units',
              wrapperSourcePath: 'acquisitionsUnits',
            }]}
            isRemoveValueAllowed
            isFieldValueEqual={isFieldPristine}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(6)}
            isMultiSelection
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(7)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.billToName`} />}
            optionValue="value"
            optionLabel="value"
            parsedOptionValue="name"
            parsedOptionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/configurations/entries?limit=500&query=(module=TENANT and configName=tenant.addresses)',
              wrapperSourcePath: 'configs',
            }]}
            isRemoveValueAllowed
            isFieldValueEqual={isFieldPristine}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(7)}
            validation={noop}
            okapi={okapi}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.billToAddress`} />}
            name={getFieldName(8)}
            isEqual={isFieldPristine}
            disabled
          />
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(9)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.batchGroupId`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/batch-groups',
              wrapperSourcePath: 'batchGroups',
            }]}
            isRemoveValueAllowed
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(9)}
            validation={validateRequiredField}
            required
            isFieldValueEqual={isFieldPristine}
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.subTotal`} />}
            name={getFieldName(10)}
            isEqual={isFieldPristine}
            disabled
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.adjustmentsTotal`} />}
            name={getFieldName(11)}
            isEqual={isFieldPristine}
            disabled
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.total`} />}
            name={getFieldName(12)}
            isEqual={isFieldPristine}
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
                setReferenceTables(getFieldName(13), '');
              }
            }}
          />
        </Col>
        <Col xs={2}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.lockTotal`} />}
            name={getFieldName(13)}
            isEqual={isFieldPristine}
            disabled={!isLockTotal}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <Field
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceInformation.field.note`} />}
            component={TextArea}
            name={getFieldName(14)}
            isEqual={isFieldPristine}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceInformation.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  hasLockTotal: PropTypes.bool.isRequired,
};
