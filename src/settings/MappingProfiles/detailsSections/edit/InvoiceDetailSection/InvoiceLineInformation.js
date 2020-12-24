import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { isEmpty } from 'lodash';

import {
  Accordion,
  Row,
  Col,
  TextField,
  Checkbox,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  DatePickerDecorator,
} from '../../../../../components';

import { getFieldName } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { okapiShape } from '../../../../../utils';

export const InvoiceLineInformation = ({
  accountingNumberOptions,
  okapi,
}) => {
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
            name={getFieldName(26)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.POLineNumber`} />}
            name={getFieldName(27)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.invoiceLineNumber`} />}
            name={getFieldName(28)}
            disabled
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.vendorRefNo`} />}
            name={getFieldName(29)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.invoiceLineStatus`} />}
            name={getFieldName(30)}
            disabled
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subscriptionInfo`} />}
            name={getFieldName(31)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subscriptionStartDate`} />}
            name={getFieldName(32)}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subscriptionEndDate`} />}
            name={getFieldName(33)}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.comment`} />}
            name={getFieldName(34)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.accountingCode`} />}
            name={getFieldName(35)}
            disabled
          />
        </Col>
        <Col xs={3}>
          {
            isEmpty(accountingNumberOptions) ? (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.accountNumber`} />}
                name={getFieldName(36)}
              />
            ) : (
              <AcceptedValuesField
                component={TextField}
                name={getFieldName(36)}
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
            name={getFieldName(37)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subTotal`} />}
            name={getFieldName(38)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={12}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.releaseEncumbrance`} />}
            name={getFieldName(39)}
            vertical
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceLineInformation.propTypes = {
  accountingNumberOptions: PropTypes.arrayOf(PropTypes.object),
  okapi: okapiShape.isRequired,
};

InvoiceLineInformation.defaultProps = { accountingNumberOptions: [] };
