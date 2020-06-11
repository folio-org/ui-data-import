import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  RepeatableField,
  TextField,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  RepeatableActionsField,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getFieldName,
  getSubfieldName,
} from '../utils';
import { TRANSLATION_ID_PREFIX } from '../constants';
import {
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const ElectronicAccess = ({
  electronicAccess,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  return (
    <Accordion
      id="holdings-electronic-access"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-electronic-access
          id="section-electronic-access"
          xs={12}
        >
          <RepeatableActionsField wrapperFieldName={getFieldName(22)}>
            <RepeatableField
              fields={electronicAccess}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.EAccess.addLabel`} />}
              onAdd={() => onAdd(electronicAccess, 'electronicAccess', 22, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, electronicAccess, 22, setReferenceTables, 'order')}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col
                    data-test-electronic-relationship
                    xs={4}
                  >
                    <AcceptedValuesField
                      component={TextField}
                      name={getSubfieldName(22, 0, index)}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.relationship`} />}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                      wrapperSourceLink="/electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name"
                      wrapperSourcePath="electronicAccessRelationships"
                      okapi={okapi}
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.uri`} />}
                      name={getSubfieldName(22, 1, index)}
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.linkText`} />}
                      name={getSubfieldName(22, 2, index)}
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.materialsSpecified`} />}
                      name={getSubfieldName(22, 3, index)}
                    />
                  </Col>
                  <Col xs={2}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.urlPublicNote`} />}
                      name={getSubfieldName(22, 4, index)}
                    />
                  </Col>
                </Row>
              )}
            />
          </RepeatableActionsField>
        </Col>
      </Row>
    </Accordion>
  );
};

ElectronicAccess.propTypes = {
  electronicAccess: PropTypes.arrayOf(PropTypes.shape(mappingProfileSubfieldShape)).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.shape(okapiShape).isRequired,
};
