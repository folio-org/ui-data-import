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

import { getSubfieldName } from '../../utils';
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
            name={getSubfieldName(26, 0, 0)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.POLineNumber`} />}
            name={getSubfieldName(26, 1, 0)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.invoiceLineNumber`} />}
            name={getSubfieldName(26, 2, 0)}
            disabled
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.vendorRefNo`} />}
            name={getSubfieldName(26, 3, 0)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.invoiceLineStatus`} />}
            name={getSubfieldName(26, 4, 0)}
            disabled
          />
        </Col>
      </Row>
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
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.subTotal`} />}
            name={getSubfieldName(26, 12, 0)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={12}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineInformation.field.releaseEncumbrance`} />}
            name={getSubfieldName(26, 13, 0)}
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
