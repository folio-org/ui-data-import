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

import { getFieldName } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  okapiShape,
  createOptionsList,
} from '../../../../../utils';

export const ExtendedInformation = ({
  okapi,
  setReferenceTables,
}) => {
  const [isUseSetExchangeRate, setIsUseSetExchangeRate] = useState(false);

  const { formatMessage } = useIntl();
  const paymentMethodsList = createOptionsList(PAYMENT_METHOD_OPTIONS, formatMessage, 'labelId');
  const currenciesList = useCurrencyOptions();

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
            name={getFieldName(19)}
            disabled
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(20)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.paymentMethod`} />}
            optionValue="value"
            optionLabel="label"
            isRemoveValueAllowed
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={paymentMethodsList}
            okapi={okapi}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            vertical
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.checkSubscriptionOverlap`} />}
            name={getFieldName(21)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            vertical
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.exportToAccounting`} />}
            name={getFieldName(22)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(23)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.currency`} />}
            optionValue="value"
            optionLabel="label"
            isRemoveValueAllowed
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={currenciesList}
            okapi={okapi}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.currentExchangeRate`} />}
            name={getFieldName(24)}
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
                setReferenceTables(getFieldName(25), '');
              }
            }}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.setExchangeRate`} />}
            name={getFieldName(25)}
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
};
