import React, {
  useCallback,
  useEffect,
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
import {
  useFieldMappingFieldValue,
  useDisabledOrderFields,
} from '../../hooks';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  clearFieldValue,
  getFieldName,
  renderFieldLabelWithInfo,
} from '../../utils';
import {
  CURRENCY_FIELD,
  SET_EXCHANGE_RATE_FIELD,
} from '../../../../../utils';

export const CostDetails = ({
  setReferenceTables,
  okapi,
}) => {
  const COST_DETAILS_FIELDS_MAP = {
    PHYSICAL_UNIT_PRICE: getFieldName(48),
    QUANTITY_PHYSICAL: getFieldName(49),
    ADDITIONAL_COST: getFieldName(50),
    CURRENCY: getFieldName(51),
    SET_EXCHANGE_RATE: getFieldName(52),
    ELECTRONIC_UNIT_PRICE: getFieldName(53),
    QUANTITY_ELECTRONIC: getFieldName(54),
    DISCOUNT: getFieldName(55),
    TYPE: getFieldName(56),
  };

  const physicalDetailsDisabledPaths = [
    COST_DETAILS_FIELDS_MAP.PHYSICAL_UNIT_PRICE,
    COST_DETAILS_FIELDS_MAP.QUANTITY_PHYSICAL,
  ];
  const electronicDetailsDisabledPaths = [
    COST_DETAILS_FIELDS_MAP.ELECTRONIC_UNIT_PRICE,
    COST_DETAILS_FIELDS_MAP.QUANTITY_ELECTRONIC,
  ];

  const [
    setExchangeRateValue,
    currency,
  ] = useFieldMappingFieldValue([
    SET_EXCHANGE_RATE_FIELD,
    CURRENCY_FIELD,
  ]);

  const isSetExchangeRateValueEmpty = !isEmpty(setExchangeRateValue);

  const [isUseExchangeChecked, setIsUseExchangeChecked] = useState(isSetExchangeRateValueEmpty);
  const [isSetExchangeDisabled, setIsSetExchangeDisabled] = useState(isSetExchangeRateValueEmpty);

  const { dismissPhysicalDetails, dismissElectronicDetails } = useDisabledOrderFields();

  useEffect(() => {
    if (dismissPhysicalDetails) {
      clearFieldValue({ paths: physicalDetailsDisabledPaths, setReferenceTables });
    }
  }, [dismissPhysicalDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dismissElectronicDetails) {
      clearFieldValue({ paths: electronicDetailsDisabledPaths, setReferenceTables });
    }
  }, [dismissElectronicDetails]); // eslint-disable-line react-hooks/exhaustive-deps

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
                disabled={dismissPhysicalDetails}
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
                disabled={dismissPhysicalDetails}
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
                name={COST_DETAILS_FIELDS_MAP.ADDITIONAL_COST}
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
            okapi={okapi}
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
                disabled={dismissElectronicDetails}
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
                disabled={dismissElectronicDetails}
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
            format={value => value?.replace(/"+/g, '')}
            parse={value => `"${value}"`}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

CostDetails.propTypes = {
  okapi: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
};
