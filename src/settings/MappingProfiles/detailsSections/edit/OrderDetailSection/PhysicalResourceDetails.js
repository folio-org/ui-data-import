import React, { useCallback } from 'react';
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
  CREATE_INVENTORY_TYPES,
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  getAcceptedValuesPath,
  getFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
  renderFieldLabelWithInfo,
} from '../../utils';
import { validateMARCWithDate } from '../../../../../utils';

export const PhysicalResourceDetails = ({
  volumes,
  materialSupplierId,
  mappingValue,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const { formatMessage } = useIntl();

  const PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP = {
    MATERIAL_SUPPLIER: getFieldName(58),
    RECEIPT_DUE: getFieldName(59),
    EXPECTED_RECEIPT_DATE: getFieldName(60),
    CREATE_INVENTORY: getFieldName(61),
    MATERIAL_TYPE: 62,
    VOLUMES: 63,
    VOLUME: index => getSubfieldName(PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.VOLUMES, 0, index),
  };

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
    () => onAdd(volumes, 'volumes', PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.VOLUMES, initialFields, setReferenceTables, 'order'),
    [PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.VOLUMES, initialFields, setReferenceTables, volumes],
  );

  const handleVolumesClean = useCallback(
    index => onRemove(index, volumes, PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.VOLUMES, setReferenceTables, 'order'),
    [PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.VOLUMES, setReferenceTables, volumes],
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
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={12}>
          <AcceptedValuesField
            component={TextField}
            label={materialTypeLabel}
            name={getFieldName(PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.MATERIAL_TYPE)}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.MATERIAL_TYPES,
              wrapperSourcePath: 'mtypes',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(PHYSICAL_RESOURCE_DETAILS_FIELDS_MAP.MATERIAL_TYPE)}
            okapi={okapi}
          />
        </Col>
      </Row>
      <RepeatableField
        fields={volumes}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.volume.addLabel`} />}
        onAdd={handleVolumesAdd}
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
  volumes: PropTypes.arrayOf(PropTypes.object),
  materialSupplierId: PropTypes.string,
  mappingValue: PropTypes.string,
};

PhysicalResourceDetails.defaultProps = {
  volumes: [],
  materialSupplierId: null,
};
