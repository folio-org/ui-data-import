import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
  WithValidation,
} from '../../../../../components';
import { useFieldMappingFieldValue, useFieldMappingRefValues } from '../../hooks';

import {
  ORDER_FORMATS,
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  getRepeatableAcceptedValuesPath,
  getRepeatableFieldName,
  getSubfieldName,
  handleRepeatableFieldAndActionAdd,
  handleRepeatableFieldAndActionClean,
  onAdd,
  onRemove,
  renderFieldLabelWithInfo,
} from '../../utils';
import { LOCATIONS_FIELD, ORDER_FORMAT_FILED } from '../../../../../utils';

export const Location = ({
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const LOCATION_FIELDS_MAP = {
    LOCATIONS: 57,
    NAME: index => getSubfieldName(LOCATION_FIELDS_MAP.LOCATIONS, 0, index),
    QUANTITY_PHYSICAL: index => getSubfieldName(LOCATION_FIELDS_MAP.LOCATIONS, 1, index),
    QUANTITY_ELECTRONIC: index => getSubfieldName(LOCATION_FIELDS_MAP.LOCATIONS, 2, index),
  };

  const [orderFormat] = useFieldMappingFieldValue([ORDER_FORMAT_FILED]);

  const [locations] = useFieldMappingRefValues([LOCATIONS_FIELD]);

  const isPhysicalDetailsDisabled = useMemo(() => orderFormat === ORDER_FORMATS.ELECTRONIC_RESOURCE, [orderFormat]);
  /*
  useEffect(() => {
    if (!isPhysicalDetailsDisabled) {
      setReferenceTables(LOCATION_FIELDS_MAP.QUANTITY_PHYSICAL, physicalUnitPrice);
    } else {
      setReferenceTables(LOCATION_FIELDS_MAP.QUANTITY_PHYSICAL, '');
    }
  }, [isPhysicalDetailsDisabled]); // eslint-disable-line react-hooks/exhaustive-deps */

  const locationLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.location.field.name`,
    `${TRANSLATION_ID_PREFIX}.order.location.field.name.info`,
  );
  const quantityPhysicalLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.location.field.quantityPhysical`,
    `${TRANSLATION_ID_PREFIX}.order.location.field.quantityPhysical.info`,
  );
  const quantityElectronicLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.location.field.quantityElectronic`,
    `${TRANSLATION_ID_PREFIX}.order.location.field.quantityElectronic.info`,
  );

  const handleLocationAdd = useCallback(
    () => {
      const onLocationAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
        const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

        handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
      };

      return onAdd(locations, 'locations', LOCATION_FIELDS_MAP.LOCATIONS, initialFields, onLocationAdd, 'order');
    },
    [LOCATION_FIELDS_MAP.LOCATIONS, initialFields, locations, setReferenceTables],
  );

  const handleLocationClean = useCallback(
    index => {
      const onLocationClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
        const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

        handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
      };

      return onRemove(index, locations, LOCATION_FIELDS_MAP.LOCATIONS, onLocationClean, 'order');
    },
    [LOCATION_FIELDS_MAP.LOCATIONS, locations, setReferenceTables],
  );

  const setQuantityPhysicalValue = (path) => {
    console.log(path);
    if (!isPhysicalDetailsDisabled) {
      console.log('test');
    } else {
      setReferenceTables(path, '');
    }
  };

  return (
    <Accordion
      id="location"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.section`} />}
    >
      <RepeatableField
        fields={locations}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.field.locations.addLabel`} />}
        onAdd={handleLocationAdd}
        onRemove={handleLocationClean}
        renderField={(field, index) => {
          return (
            <Row left="xs">
              <Col xs={4}>
                <AcceptedValuesField
                  component={TextField}
                  label={locationLabel}
                  name={LOCATION_FIELDS_MAP.NAME(index)}
                  optionValue="name"
                  optionLabel="name"
                  wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                  wrapperSources={[{
                    wrapperSourceLink: WRAPPER_SOURCE_LINKS.LOCATIONS,
                    wrapperSourcePath: 'locations'
                  }]}
                  setAcceptedValues={setReferenceTables}
                  acceptedValuesPath={getRepeatableAcceptedValuesPath(LOCATION_FIELDS_MAP.LOCATIONS, 0, index)}
                  optionTemplate="**name** (**code**)"
                  okapi={okapi}
                />
              </Col>
              <Col xs={4}>
                <WithValidation>
                  {validation => (
                    <Field
                      component={TextField}
                      label={quantityPhysicalLabel}
                      name={LOCATION_FIELDS_MAP.QUANTITY_PHYSICAL(index)}
                      validate={[validation]}
                      value={setQuantityPhysicalValue(LOCATION_FIELDS_MAP.QUANTITY_PHYSICAL(index))}
                      disabled={isPhysicalDetailsDisabled}
                    />
                  )}
                </WithValidation>
              </Col>
              <Col xs={4}>
                <WithValidation>
                  {validation => (
                    <Field
                      component={TextField}
                      label={quantityElectronicLabel}
                      name={LOCATION_FIELDS_MAP.QUANTITY_ELECTRONIC(index)}
                      validate={[validation]}
                    />
                  )}
                </WithValidation>
              </Col>
            </Row>
          );
        }}
      />
    </Accordion>
  );
};

Location.propTypes = {
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.object.isRequired,
};
