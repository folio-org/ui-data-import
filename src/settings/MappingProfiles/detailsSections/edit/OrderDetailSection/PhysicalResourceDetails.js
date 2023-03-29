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

import {
  Accordion,
  RepeatableField,
  TextField,
  Row,
  Col,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  DatePickerDecorator,
  FieldOrganization,
  WithValidation,
} from '../../../../../components';
import {
  useDisabledOrderFields,
  useFieldMappingRefValues,
  useFieldMappingValueFromLookup,
} from '../../hooks';

import {
  FIELD_NAME_PREFIX,
  CREATE_INVENTORY_TYPES,
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  clearFieldValue,
  getAcceptedValuesPath,
  getFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
  renderFieldLabelWithInfo,
} from '../../utils';
import {
  MATERIAL_SUPPLIER_FIELD,
  validateMARCWithDate,
  VOLUMES_FIELD,
} from '../../../../../utils';

export const PhysicalResourceDetails = ({
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const MATERIAL_TYPE_INDEX = 62;
  const VOLUMES_INDEX = 63;
  const PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP = {
    MATERIAL_SUPPLIER: getFieldName(58),
    RECEIPT_DUE: getFieldName(59),
    EXPECTED_RECEIPT_DATE: getFieldName(60),
    CREATE_INVENTORY: getFieldName(61),
    MATERIAL_TYPE: getFieldName(MATERIAL_TYPE_INDEX),
    VOLUME: index => getSubfieldName(VOLUMES_INDEX, 0, index),
  };

  const physicalDetailsDisabledPaths = [
    PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.MATERIAL_SUPPLIER,
    PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.CREATE_INVENTORY,
    PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.RECEIPT_DUE,
    PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.EXPECTED_RECEIPT_DATE,
    PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.MATERIAL_TYPE,
  ];

  const { formatMessage } = useIntl();

  const [volumes] = useFieldMappingRefValues([VOLUMES_FIELD]);
  const [materialSupplierId, mappingValue] = useFieldMappingValueFromLookup(MATERIAL_SUPPLIER_FIELD);

  const { dismissCreateInventory, dismissPhysicalDetails } = useDisabledOrderFields();

  useEffect(() => {
    if (dismissCreateInventory) {
      clearFieldValue({
        paths: [PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.CREATE_INVENTORY, PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.MATERIAL_TYPE],
        setReferenceTables,
      });
    }
  }, [dismissCreateInventory]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dismissPhysicalDetails) {
      clearFieldValue({
        paths: physicalDetailsDisabledPaths,
        setReferenceTables,
      });
      clearFieldValue({
        paths: [`${FIELD_NAME_PREFIX}[${VOLUMES_INDEX}]`],
        setReferenceTables,
        isSubfield: true,
      });
    }
  }, [dismissPhysicalDetails]); // eslint-disable-line react-hooks/exhaustive-deps

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
    `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.createInventory`,
    `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.physicalUnitPrice.info`,
  );
  const materialTypeLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.materialType`,
    `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.materialType.info`,
  );

  const handleVolumesAdd = useCallback(
    () => onAdd(volumes, 'volumes', VOLUMES_INDEX, initialFields, setReferenceTables, 'order'),
    [VOLUMES_INDEX, initialFields, setReferenceTables, volumes],
  );

  const handleVolumesClean = useCallback(
    index => onRemove(index, volumes, VOLUMES_INDEX, setReferenceTables, 'order'),
    [VOLUMES_INDEX, setReferenceTables, volumes],
  );

  return (
    <Accordion
      id="physical-resource-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.section`} />}
    >
      <Row left="xs">
        <Col xs={3}>
          <WithValidation>
            {validation => (
              <FieldOrganization
                id={materialSupplierId}
                mappingValue={mappingValue}
                setReferenceTables={setReferenceTables}
                name={PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.MATERIAL_SUPPLIER}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.materialSupplier`} />}
                validate={[validation]}
                disabled={dismissPhysicalDetails}
                isPluginDisabled={dismissPhysicalDetails}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.receiptDue`} />}
            name={PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.RECEIPT_DUE}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={[validateDatepickerFieldValue]}
            disabled={dismissPhysicalDetails}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.expectedReceiptDate`} />}
            name={PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.EXPECTED_RECEIPT_DATE}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={[validateDatepickerFieldValue]}
            disabled={dismissPhysicalDetails}
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.CREATE_INVENTORY}
            label={createInventoryLabel}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={createInventoryOptions}
            disabled={dismissCreateInventory || dismissPhysicalDetails}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={12}>
          <AcceptedValuesField
            component={TextField}
            label={materialTypeLabel}
            name={PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.MATERIAL_TYPE}
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
            disabled={dismissPhysicalDetails || dismissCreateInventory}
          />
        </Col>
      </Row>
      <RepeatableField
        fields={volumes}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.volume.addLabel`} />}
        onAdd={handleVolumesAdd}
        canAdd={!dismissPhysicalDetails}
        onRemove={handleVolumesClean}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={12}>
              <WithValidation>
                {validation => (
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.volume`} />}
                    name={PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.VOLUME(index)}
                    validate={[validation]}
                  />
                )}
              </WithValidation>
            </Col>
          </Row>
        )}
      />
    </Accordion>
  );
};

PhysicalResourceDetails.propTypes = {
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.object.isRequired,
};
