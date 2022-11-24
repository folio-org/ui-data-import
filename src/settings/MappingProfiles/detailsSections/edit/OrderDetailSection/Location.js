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
  getSubfieldName,
  onAdd,
  onRemove,
  renderFieldLabelWithInfo,
} from '../../utils';

export const Location = ({
  locations,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const locationsFieldIndex = 61;
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

  return (
    <Accordion
      id="location"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.section`} />}
    >
      <RepeatableField
        fields={locations}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.field.locations.addLabel`} />}
        onAdd={() => onAdd(locations, 'locations', locationsFieldIndex, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, locations, locationsFieldIndex, setReferenceTables, 'order')}
        renderField={(field, index) => {
          return (
            <Row left="xs">
              <Col xs={4}>
                <AcceptedValuesField
                  component={TextField}
                  label={locationLabel}
                  name={getSubfieldName(locationsFieldIndex, 0, index)}
                  optionValue="name"
                  optionLabel="name"
                  wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                  wrapperSources={[{
                    wrapperSourceLink: WRAPPER_SOURCE_LINKS.LOCATIONS,
                    wrapperSourcePath: 'locations'
                  }]}
                  setAcceptedValues={setReferenceTables}
                  acceptedValuesPath={getRepeatableAcceptedValuesPath(locationsFieldIndex, 0, index)}
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
                      name={getSubfieldName(locationsFieldIndex, 1, index)}
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
                      name={getSubfieldName(locationsFieldIndex, 2, index)}
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
