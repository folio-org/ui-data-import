import React from 'react';
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

const LOCATION_FIELDS_MAP = {
  LOCATIONS: 57,
  NAME: index => getSubfieldName(this.LOCATIONS, 0, index),
  QUANTITY_PHYSICAL: index => getSubfieldName(this.LOCATIONS, 1, index),
  QUANTITY_ELECTRONIC: index => getSubfieldName(this.LOCATIONS, 2, index),
};

export const Location = ({
  locations,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
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

  const onLocationAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
    const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

    handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
  };

  const onLocationClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
    const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

    handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
  };

  return (
    <Accordion
      id="location"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.section`} />}
    >
      <RepeatableField
        fields={locations}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.field.locations.addLabel`} />}
        onAdd={() => onAdd(locations, 'locations', LOCATION_FIELDS_MAP.LOCATIONS, initialFields, onLocationAdd, 'order')}
        onRemove={index => onRemove(index, locations, LOCATION_FIELDS_MAP.LOCATIONS, onLocationClean, 'order')}
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
  locations: PropTypes.arrayOf(PropTypes.object),
};

Location.defaultProps = { locations: [] };
