import React, { useState } from 'react';
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
  currenciesOptions,
} from '@folio/stripes/components';
import { TypeToggle } from '@folio/stripes-acq-components';

import {
  AcceptedValuesField,
  WithValidation,
} from '../../../../../components';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getFieldName,
  renderFieldLabelWithInfo,
} from '../../utils';

export const CostDetails = ({
  currency,
  setExchangeRateValue,
  setReferenceTables,
}) => {
  const [isUseExchangeChecked, setIsUseExchangeChecked] = useState(!isEmpty(setExchangeRateValue));
  const [isSetExchangeDisabled, setIsSetExchangeDisabled] = useState(isEmpty(setExchangeRateValue));

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

  const handleUseSetExchangeToggle = () => {
    setIsUseExchangeChecked(prevState => !prevState);
    setIsSetExchangeDisabled(prevState => {
      if (!prevState) {
        setReferenceTables(getFieldName(51), '');
      }

      return !prevState;
    });
  };

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
                label={physicalUnitPriceLabel}
                name={getFieldName(47)}
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
                label={quantityPhysicalLabel}
                name={getFieldName(48)}
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
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.additionalCost`} />}
                name={getFieldName(49)}
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
            name={getFieldName(50)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.currency`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={currenciesOptions}
            required
          />
        </Col>
        <Col xs={4}>
          <Checkbox
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.useSetExchangeRate`} />}
            onChange={handleUseSetExchangeToggle}
            checked={isUseExchangeChecked}
            vertical
          />
        </Col>
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.setExchangeRate`} />}
                name={getFieldName(51)}
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
                label={electronicUnitPriceLabel}
                name={getFieldName(52)}
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
                label={quantityElectronicLabel}
                name={getFieldName(53)}
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
                name={getFieldName(54)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={3}>
          <Field
            component={TypeToggle}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.type`} />}
            name={getFieldName(55)}
            currency={currency}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

CostDetails.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  currency: PropTypes.string,
  setExchangeRateValue: PropTypes.string,
};

CostDetails.defaultProps = {
  currency: null,
  setExchangeRateValue: null,
};
