import React, {
  useCallback,
  useState,
} from 'react';
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

const COST_DETAILS_FIELDS_MAP = {
  PHYSICAL_UNIT_PRICE: getFieldName(47),
  QUANTITY_PHYSICAL: getFieldName(48),
  ADDITIONAL_COAST: getFieldName(49),
  CURRENCY: getFieldName(50),
  SET_EXCHANGE_RATE: getFieldName(51),
  ELECTRONIC_UNIT_PRICE: getFieldName(52),
  QUANTITY_ELECTRONIC: getFieldName(53),
  DISCOUNT: getFieldName(54),
  TYPE: getFieldName(55),
};

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

  const handleUseSetExchangeToggle = useCallback(
    () => {
      setIsUseExchangeChecked(prevState => !prevState);
      setIsSetExchangeDisabled(prevState => {
        if (!prevState) {
          setReferenceTables(getFieldName(51), '');
        }

        return !prevState;
      });
    },
    [setReferenceTables],
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
                label={physicalUnitPriceLabel}
                name={COST_DETAILS_FIELDS_MAP.PHYSICAL_UNIT_PRICE}
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
                name={COST_DETAILS_FIELDS_MAP.QUANTITY_PHYSICAL}
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
                name={COST_DETAILS_FIELDS_MAP.ADDITIONAL_COAST}
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
            name={COST_DETAILS_FIELDS_MAP.CURRENCY}
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
                name={COST_DETAILS_FIELDS_MAP.SET_EXCHANGE_RATE}
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
                name={COST_DETAILS_FIELDS_MAP.ELECTRONIC_UNIT_PRICE}
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
                name={COST_DETAILS_FIELDS_MAP.QUANTITY_ELECTRONIC}
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
                name={COST_DETAILS_FIELDS_MAP.DISCOUNT}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={3}>
          <Field
            component={TypeToggle}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.costDetails.field.type`} />}
            name={COST_DETAILS_FIELDS_MAP.TYPE}
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
