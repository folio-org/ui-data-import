import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  KeyValue,
} from '@folio/stripes/components';

import {
  getFieldValue,
  renderAmountValue,
  renderCheckbox,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  BOOLEAN_ACTIONS,
  mappingProfileFieldShape,
} from '../../../../../utils';

export const CostDetails = ({ mappingDetails }) => {
  const listUnitPrice = getFieldValue(mappingDetails, 'listUnitPrice', 'value');
  const quantityPhysical = getFieldValue(mappingDetails, 'quantityPhysical', 'value');
  const additionalCost = getFieldValue(mappingDetails, 'additionalCost', 'value');
  const currency = getFieldValue(mappingDetails, 'currency', 'value');
  const exchangeRate = getFieldValue(mappingDetails, 'exchangeRate', 'value');
  const electronicUnitPrice = getFieldValue(mappingDetails, 'electronicUnitPrice', 'value');
  const quantityElectronic = getFieldValue(mappingDetails, 'quantityElectronic', 'value');
  const discount = getFieldValue(mappingDetails, 'discount', 'value');
  const discountType = getFieldValue(mappingDetails, 'discountType', 'value');

  const useExchangeRateCheckbox = renderCheckbox('order.costDetails.useExchangeRate', exchangeRate ? BOOLEAN_ACTIONS.ALL_TRUE : false);

  return (
    <Accordion
      id="view-cost-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-unit-price
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.listUnitPrice`} />}
            value={listUnitPrice}
          />
        </Col>
        <Col
          data-test-quantity-physical
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.quantityPhysical`} />}
            value={quantityPhysical}
          />
        </Col>
        <Col
          data-test-additional-cost
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.additionalCost`} />}
            value={additionalCost}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-currency
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.currency`} />}
            value={currency}
          />
        </Col>
        <Col
          data-test-use-exchange-rate
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.useExchangeRate`} />}
            value={useExchangeRateCheckbox}
          />
        </Col>
        <Col
          data-test-exchange-rate
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.exchangeRate`} />}
            value={exchangeRate}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-unit-price-electronic
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.electronicUnitPrice`} />}
            value={electronicUnitPrice}
          />
        </Col>
        <Col
          data-test-quantity-electronic
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.quantityElectronic`} />}
            value={quantityElectronic}
          />
        </Col>
        <Col
          data-test-discount
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.discount`} />}
            value={renderAmountValue(discount, discountType)}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

CostDetails.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
