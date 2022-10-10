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
import { mappingProfileFieldShape } from '../../../../../utils';

export const CostDetails = ({ mappingDetails }) => {
  const listUnitPrice = getFieldValue(mappingDetails, 'listUnitPrice', 'value');
  const quantityPhysical = getFieldValue(mappingDetails, 'quantityPhysical', 'value');
  const additionalCost = getFieldValue(mappingDetails, 'additionalCost', 'value');
  const currency = getFieldValue(mappingDetails, 'currency', 'value');
  const useSetExchangeRate = getFieldValue(mappingDetails, 'useSetExchangeRate', 'booleanFieldAction');
  const exchangeRate = getFieldValue(mappingDetails, 'exchangeRate', 'value');
  const listUnitPriceElectronic = getFieldValue(mappingDetails, 'listUnitPriceElectronic', 'value');
  const quantityElectronic = getFieldValue(mappingDetails, 'quantityElectronic', 'value');
  const discount = getFieldValue(mappingDetails, 'discount', 'value');
  const discountType = getFieldValue(mappingDetails, 'discountType', 'value');

  const useSetExchangeRateCheckbox = renderCheckbox('order.costDetails.useSetExchangeRate', useSetExchangeRate);

  return (
    <Accordion
      id="view-cost-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-unit-price
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.listUnitPrice`} />}
            value={listUnitPrice}
          />
        </Col>
        <Col
          data-test-quantity-physical
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.quantityPhysical`} />}
            value={quantityPhysical}
          />
        </Col>
        <Col
          data-test-additional-cost
          xs={3}
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
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.currency`} />}
            value={currency}
          />
        </Col>
        <Col
          data-test-use-set-exchange-rate
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.useSetExchangeRate`} />}
            value={useSetExchangeRateCheckbox}
          />
        </Col>
        <Col
          data-test-exchange-rate
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.exchangeRate`} />}
            value={exchangeRate}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-list-unit-price-electronic
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.listUnitPriceElectronic`} />}
            value={listUnitPriceElectronic}
          />
        </Col>
        <Col
          data-test-quantity-electronic
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.quantityElectronic`} />}
            value={quantityElectronic}
          />
        </Col>
        <Col
          data-test-discount
          xs={3}
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
