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
import {
  getFieldValue,
  renderCheckbox,
} from '../../utils';
import { mappingProfileFieldShape } from '../../../../../utils';

export const ExtendedInformation = ({ mappingDetails }) => {
  const prohibitionIconElement = fieldName => <ProhibitionIcon fieldName={fieldName} />;

  const folioInvoiceNumberValue = getFieldValue(mappingDetails, 'folioInvoiceNo', 'value');
  const paymentMethodValue = getFieldValue(mappingDetails, 'paymentMethod', 'value');
  const checkSubscriptionOverlapValue = getFieldValue(mappingDetails, 'chkSubscriptionOverlap', 'booleanFieldAction');
  const exportToAccountingValue = getFieldValue(mappingDetails, 'exportToAccounting', 'booleanFieldAction');
  const currencyValue = getFieldValue(mappingDetails, 'currency', 'value');
  const currentExchangeRateValue = getFieldValue(mappingDetails, 'currentExchangeRate', 'value');
  const setExchangeRateValue = getFieldValue(mappingDetails, 'exchangeRate', 'value');

  const checkSubscriptionOverlapCheckbox = renderCheckbox('invoice.extendedInformation.field.checkSubscriptionOverlap', checkSubscriptionOverlapValue);
  const exportToAccountingCheckbox = renderCheckbox('invoice.extendedInformation.field.exportToAccounting', exportToAccountingValue);

  return (
    <Accordion
      id="extended-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-invoice-number
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.folioInvoiceNumber`} />}
            value={folioInvoiceNumberValue || prohibitionIconElement('folio-invoice-number')}
          />
        </Col>
        <Col
          data-test-payment-method
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.paymentMethod`} />}
            value={paymentMethodValue}
          />
        </Col>
        <Col
          data-test-check-subscription-overlap
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.checkSubscriptionOverlap`} />}
            value={checkSubscriptionOverlapCheckbox}
          />
        </Col>
        <Col
          data-test-export-to-accounting
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.exportToAccounting`} />}
            value={exportToAccountingCheckbox}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-currency
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.currency`} />}
            value={currencyValue}
          />
        </Col>
        <Col
          data-test-current-exchange-rate
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.currentExchangeRate`} />}
            value={currentExchangeRateValue || prohibitionIconElement('current-exchange-rate')}
          />
        </Col>
        <Col
          data-test-exchange-rate
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.extendedInformation.field.setExchangeRate`} />}
            value={setExchangeRateValue}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ExtendedInformation.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
