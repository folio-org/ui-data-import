import React, {
  useCallback,
  useEffect,
} from 'react';
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
import {
  useDisabledOrderFields,
  useFieldMappingRefValues,
} from '../../hooks';

import {
  FIELD_NAME_PREFIX,
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  clearFieldValue,
  clearSubfieldValue,
  getRepeatableAcceptedValuesPath,
  getRepeatableFieldName,
  getSubfieldName,
  handleRepeatableFieldAndActionAdd,
  handleRepeatableFieldAndActionClean,
  onAdd,
  onRemove,
  renderFieldLabelWithInfo,
} from '../../utils';

import {
  LOCATIONS_FIELD,
  QUANTITY_PHYSICAL_FIELD,
  QUANTITY_ELECTRONIC_FIELD,
} from '../../../../../utils';

export const Location = ({
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const LOCATIONS_INDEX = 57;
  const LOCATION_FIELDS_MAP = {
    NAME: index => getSubfieldName(LOCATIONS_INDEX, 0, index),
    QUANTITY_PHYSICAL: index => getSubfieldName(LOCATIONS_INDEX, 1, index),
    QUANTITY_ELECTRONIC: index => getSubfieldName(LOCATIONS_INDEX, 2, index),
  };

  const [locations] = useFieldMappingRefValues([LOCATIONS_FIELD]);
  const { dismissCreateInventory, dismissPhysicalDetails, dismissElectronicDetails } = useDisabledOrderFields();

  useEffect(() => {
    if (dismissCreateInventory) {
      clearFieldValue({
        paths: [`${FIELD_NAME_PREFIX}[${LOCATIONS_INDEX}]`],
        setReferenceTables,
        isSubfield: true,
      });
    }
  }, [dismissCreateInventory]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dismissPhysicalDetails) {
      clearSubfieldValue({
        mappingFieldIndex: LOCATIONS_INDEX,
        setReferenceTables,
        subfields: locations,
        subfieldName: QUANTITY_PHYSICAL_FIELD,
      });
    }
  }, [dismissPhysicalDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dismissElectronicDetails) {
      clearSubfieldValue({
        mappingFieldIndex: LOCATIONS_INDEX,
        setReferenceTables,
        subfields: locations,
        subfieldName: QUANTITY_ELECTRONIC_FIELD,
      });
    }
  }, [dismissElectronicDetails]); // eslint-disable-line react-hooks/exhaustive-deps

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

      return onAdd(locations, 'locations', LOCATIONS_INDEX, initialFields, onLocationAdd, 'order');
    },
    [LOCATIONS_INDEX, initialFields, locations, setReferenceTables],
  );

  const handleLocationClean = useCallback(
    index => {
      const onLocationClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
        const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

        handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
      };

      return onRemove(index, locations, LOCATIONS_INDEX, onLocationClean, 'order');
    },
    [LOCATIONS_INDEX, locations, setReferenceTables],
  );

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
        canAdd={!dismissCreateInventory}
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
                  acceptedValuesPath={getRepeatableAcceptedValuesPath(LOCATIONS_INDEX, 0, index)}
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
                      label={quantityElectronicLabel}
                      name={LOCATION_FIELDS_MAP.QUANTITY_ELECTRONIC(index)}
                      validate={[validation]}
                      disabled={dismissElectronicDetails}
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
