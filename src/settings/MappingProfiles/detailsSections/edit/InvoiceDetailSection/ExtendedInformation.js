import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField,
  Checkbox,
  useCurrencyOptions,
} from '@folio/stripes/components';
import { PAYMENT_METHOD_OPTIONS } from '@folio/stripes-acq-components';

import { AcceptedValuesField } from '../../../../../components';
import { useFieldMappingFieldValue } from '../../hooks';

import {
  getFieldName,
  getBoolFieldName,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  okapiShape,
  createOptionsList,
  composeValidators,
  validateRequiredField,
  validateQuotedString,
  BOOLEAN_ACTIONS,
  EXCHANGE_RATE_FIELD,
} from '../../../../../utils';

export const ExtendedInformation = ({
  mappingFields,
  okapi,
  setReferenceTables,
}) => {
  const EXTENDED_INFO_FIELDS_MAP = {
    FOLIO_INVOICE_NUMBER: getFieldName(19),
    PAYMENT_METHOD: getFieldName(20),
    CHECK_SUBSCRIPTION_OVERLAP: getBoolFieldName(21),
    EXPORT_TO_ACCOUNTING: getBoolFieldName(22),
    CURRENCY: getFieldName(23),
    CURRENT_EXCHANGE_RATE: getFieldName(24),
    SET_EXCHANGE_RATE: getFieldName(25),
  };

  const [exchangeRate] = useFieldMappingFieldValue([EXCHANGE_RATE_FIELD]);

  const [isUseSetExchangeRate, setIsUseSetExchangeRate] = useState(!!exchangeRate);

  const { formatMessage } = useIntl();
  const paymentMethodsList = createOptionsList(PAYMENT_METHOD_OPTIONS, formatMessage, 'labelId');
  const currenciesList = useCurrencyOptions();

  const exportToAccountingCheckbox = mappingFields?.[22]?.booleanFieldAction;
  const checkSubscriptionOverlapCheckbox = mappingFields?.[21]?.booleanFieldAction;

  return (
    <Accordion
      id="extended-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.section`} />}
    >
      <Row left="xs">
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.folioInvoiceNumber`} />}
            name={EXTENDED_INFO_FIELDS_MAP.FOLIO_INVOICE_NUMBER}
            disabled
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={EXTENDED_INFO_FIELDS_MAP.PAYMENT_METHOD}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.paymentMethod`} />}
            optionValue="value"
            optionLabel="label"
            isRemoveValueAllowed
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={paymentMethodsList}
            validation={composeValidators(validateRequiredField, validateQuotedString)}
            required
            okapi={okapi}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            vertical
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.checkSubscriptionOverlap`} />}
            name={EXTENDED_INFO_FIELDS_MAP.CHECK_SUBSCRIPTION_OVERLAP}
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={checkSubscriptionOverlapCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            vertical
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.exportToAccounting`} />}
            name={EXTENDED_INFO_FIELDS_MAP.EXPORT_TO_ACCOUNTING}
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={exportToAccountingCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={EXTENDED_INFO_FIELDS_MAP.CURRENCY}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.currency`} />}
            optionValue="value"
            optionLabel="label"
            isRemoveValueAllowed
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={currenciesList}
            validation={validateRequiredField}
            required
            okapi={okapi}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.currentExchangeRate`} />}
            name={EXTENDED_INFO_FIELDS_MAP.CURRENT_EXCHANGE_RATE}
            disabled
          />
        </Col>
        <Col xs={3}>
          <Checkbox
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.useSetExchangeRate`} />}
            checked={isUseSetExchangeRate}
            vertical
            onChange={() => {
              setIsUseSetExchangeRate(!isUseSetExchangeRate);
              if (isUseSetExchangeRate) {
                setReferenceTables(EXTENDED_INFO_FIELDS_MAP.SET_EXCHANGE_RATE, '');
              }
            }}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.setExchangeRate`} />}
            name={EXTENDED_INFO_FIELDS_MAP.SET_EXCHANGE_RATE}
            disabled={!isUseSetExchangeRate}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ExtendedInformation.propTypes = {
  okapi: okapiShape.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  mappingFields: PropTypes.arrayOf(PropTypes.object),
};
