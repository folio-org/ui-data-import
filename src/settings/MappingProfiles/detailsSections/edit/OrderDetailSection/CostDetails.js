import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField,
  Checkbox,
  currenciesOptions,
} from '@folio/stripes/components';
import { TypeToggle } from '@folio/stripes-acq-components';

import {
  AcceptedValuesField,
  WithValidation,
} from '../../../../../components';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getBoolFieldName,
  getFieldName,
  renderFieldLabelWithInfo,
} from '../../utils';
import { BOOLEAN_ACTIONS } from '../../../../../utils';

export const CostDetails = ({
  currency,
  useSetExchange,
}) => {
  const [isSetExchangeDisabled, setIsSetExchangeDisabled] = useState(useSetExchange === BOOLEAN_ACTIONS.ALL_FALSE);

  const physicalUnitPriceLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.costDetails.field.physicalUnitPrice`,
    `${TRANSLATION_ID_PREFIX}.order.costDetails.field.physicalUnitPrice.info`,
  );
  const quantityPhysicalLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.costDetails.field.quantityPhysical`,
    `${TRANSLATION_ID_PREFIX}.order.costDetails.field.physicalUnitPrice.info`,
  );
  const electronicUnitPriceLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.costDetails.field.electronicUnitPrice`,
    `${TRANSLATION_ID_PREFIX}.order.costDetails.field.electronicUnitPrice.info`,
  );
  const quantityElectronicLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.costDetails.field.quantityElectronic`,
    `${TRANSLATION_ID_PREFIX}.order.costDetails.field.electronicUnitPrice.info`,
  );

  return (
    <Accordion
      id="cost-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.section`} />}
    >
      <Row left="xs">
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.physicalUnitPrice`} />}
                name={getFieldName(50)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.quantityPhysical`} />}
                name={getFieldName(51)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.additionalCoast`} />}
                name={getFieldName(52)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(53)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.currency`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={currenciesOptions}
            required
          />
        </Col>
        <Col xs={4}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.useSetExchangeRate`} />}
            name={getBoolFieldName(54)}
            onChange={e => {
              setIsSetExchangeDisabled(!(e.target.value === BOOLEAN_ACTIONS.ALL_FALSE));
            }}
            type="checkbox"
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={useSetExchange === BOOLEAN_ACTIONS.ALL_TRUE}
            vertical
          />
        </Col>
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.setExchangeRate`} />}
                name={getFieldName(55)}
                validate={[validation]}
                disabled={isSetExchangeDisabled}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.electronicUnitPrice`} />}
                name={getFieldName(56)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={3}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.quantityElectronic`} />}
                name={getFieldName(57)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={3}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.discount`} />}
                name={getFieldName(58)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={3}>
          <Field
            component={TypeToggle}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.type`} />}
            name={getFieldName(59)}
            currency={currency}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

CostDetails.propTypes = {
  currency: PropTypes.string,
  useSetExchange: PropTypes.string,
};

CostDetails.defaultProps = {
  currency: null,
  useSetExchange: null,
};
