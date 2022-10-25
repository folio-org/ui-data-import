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

import { AcceptedValuesField } from '../../../../../components';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getRepeatableAcceptedValuesPath,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';

export const Location = ({
  locations,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  return (
    <Accordion
      id="location"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.section`} />}
    >
      <RepeatableField
        fields={locations}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.field.locations.addLabel`} />}
        onAdd={() => onAdd(locations, 'locations', 61, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, locations, 61, setReferenceTables, 'order')}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={4}>
              <AcceptedValuesField
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.field.name`} />}
                name={getSubfieldName(61, 0, index)}
                optionValue="name"
                optionLabel="name"
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                wrapperSources={[{
                  wrapperSourceLink: '/locations?limit=1000&query=cql.allRecords=1 sortby name',
                  wrapperSourcePath: 'locations',
                }]}
                setAcceptedValues={setReferenceTables}
                acceptedValuesPath={getRepeatableAcceptedValuesPath(61, 0, index)}
                optionTemplate="**name** (**code**)"
                okapi={okapi}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.field.quantityPhysical`} />}
                name={getSubfieldName(61, 1, index)}
                type="number"
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.field.quantityElectronic`} />}
                name={getSubfieldName(61, 2, index)}
                type="number"
              />
            </Col>
          </Row>
        )}
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
