import React, {
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'redux-form';
import { omit } from 'lodash';

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
  FieldOrganization,
  WithValidation,
} from '../../../../../components';
import {
  useDisabledOrderFields,
  useFieldMappingBoolFieldValue,
  useFieldMappingValueFromLookup,
} from '../../hooks';

import {
  TRANSLATION_ID_PREFIX,
  CREATE_INVENTORY_TYPES,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  clearFieldValue,
  getAcceptedValuesPath,
  getBoolFieldName,
  getFieldName,
  renderFieldLabelWithInfo,
} from '../../utils';
import {
  ACCESS_PROVIDER_FIELD,
  ACTIVATION_STATUS_FIELD,
  BOOLEAN_ACTIONS,
  TRIAL_FIELD,
  validateMARCWithDate,
} from '../../../../../utils';

export const EResourcesDetails = ({
  setReferenceTables,
  okapi,
}) => {
  const MATERIAL_TYPE_INDEX = 68;
  const E_RESOURCES_DETAILS_FIELDS_MAP = {
    ACCESS_PROVIDER: getFieldName(64),
    ACTIVATION_STATUS: getBoolFieldName(65),
    ACTIVATION_DUE: getFieldName(66),
    CREATE_INVENTORY: getFieldName(67),
    MATERIAL_TYPE: getFieldName(MATERIAL_TYPE_INDEX),
    TRIAL: getBoolFieldName(69),
    EXPECTED_ACTIVATION: getFieldName(70),
    USER_LIMIT: getFieldName(71),
    URL: getFieldName(72),
  };

  const { formatMessage } = useIntl();

  const [
    activationStatusCheckbox,
    trialCheckbox,
  ] = useFieldMappingBoolFieldValue([ACTIVATION_STATUS_FIELD, TRIAL_FIELD]);
  const [accessProviderId, mappingValue] = useFieldMappingValueFromLookup(ACCESS_PROVIDER_FIELD);

  const { dismissCreateInventory, dismissElectronicDetails } = useDisabledOrderFields();
  const eResourceCheckboxPaths = [E_RESOURCES_DETAILS_FIELDS_MAP.ACTIVATION_STATUS, E_RESOURCES_DETAILS_FIELDS_MAP.TRIAL];

  useEffect(() => {
    if (dismissCreateInventory) {
      clearFieldValue({
        paths: [E_RESOURCES_DETAILS_FIELDS_MAP.CREATE_INVENTORY, E_RESOURCES_DETAILS_FIELDS_MAP.MATERIAL_TYPE],
        setReferenceTables,
      });
    }
  }, [dismissCreateInventory]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dismissElectronicDetails) {
      clearFieldValue({
        paths: Object.values(omit(E_RESOURCES_DETAILS_FIELDS_MAP, ['ACTIVATION_STATUS', 'TRIAL'])),
        setReferenceTables,
      });
      clearFieldValue({
        paths: eResourceCheckboxPaths,
        isCheckbox: true,
        setReferenceTables,
      });
    }
  }, [dismissElectronicDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateDatepickerFieldValue = useCallback(
    value => validateMARCWithDate(value, false),
    [],
  );

  const createInventoryOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.instanceHoldingsItems` }),
      value: CREATE_INVENTORY_TYPES.INSTANCE_HOLDINGS_ITEM,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.instanceHoldings` }),
      value: CREATE_INVENTORY_TYPES.INSTANCE_HOLDINGS,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.instance` }),
      value: CREATE_INVENTORY_TYPES.INSTANCE,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.none` }),
      value: CREATE_INVENTORY_TYPES.NONE,
    },
  ];

  const createInventoryLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.createInventory`,
    `${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.electronicUnitPrice.info`,
  );
  const materialTypeLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.materialType`,
    `${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.materialType.info`,
  );

  return (
    <Accordion
      id="e-resources-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.section`} />}
    >
      <Row left="xs">
        <Col xs={3}>
          <WithValidation>
            {validation => (
              <FieldOrganization
                id={accessProviderId}
                mappingValue={mappingValue}
                setReferenceTables={setReferenceTables}
                name={E_RESOURCES_DETAILS_FIELDS_MAP.ACCESS_PROVIDER}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.accessProvider`} />}
                validate={[validation]}
                disabled={dismissElectronicDetails}
                isPluginDisabled={dismissElectronicDetails}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.activationStatus`} />}
            name={E_RESOURCES_DETAILS_FIELDS_MAP.ACTIVATION_STATUS}
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={activationStatusCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
            disabled={dismissElectronicDetails}
            type="checkbox"
            vertical
          />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.activationDue`} />}
            name={E_RESOURCES_DETAILS_FIELDS_MAP.ACTIVATION_DUE}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={[validateDatepickerFieldValue]}
            disabled={dismissElectronicDetails}
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={E_RESOURCES_DETAILS_FIELDS_MAP.CREATE_INVENTORY}
            label={createInventoryLabel}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={createInventoryOptions}
            disabled={dismissCreateInventory || dismissElectronicDetails}
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            label={materialTypeLabel}
            name={E_RESOURCES_DETAILS_FIELDS_MAP.MATERIAL_TYPE}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.MATERIAL_TYPES,
              wrapperSourcePath: 'mtypes',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(MATERIAL_TYPE_INDEX)}
            okapi={okapi}
            disabled={dismissElectronicDetails || dismissCreateInventory}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.trial`} />}
            name={E_RESOURCES_DETAILS_FIELDS_MAP.TRIAL}
            type="checkbox"
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={trialCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
            disabled={dismissElectronicDetails}
            vertical
          />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.expectedActivation`} />}
            name={E_RESOURCES_DETAILS_FIELDS_MAP.EXPECTED_ACTIVATION}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={[validateDatepickerFieldValue]}
            disabled={dismissElectronicDetails}
          />
        </Col>
        <Col xs={3}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.userLimit`} />}
                name={E_RESOURCES_DETAILS_FIELDS_MAP.USER_LIMIT}
                validate={[validation]}
                disabled={dismissElectronicDetails}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.url`} />}
                name={E_RESOURCES_DETAILS_FIELDS_MAP.URL}
                validate={[validation]}
                disabled={dismissElectronicDetails}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
    </Accordion>
  );
};

EResourcesDetails.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.object.isRequired,
};
