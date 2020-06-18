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
  RepeatableActionsField,
  AcceptedValuesField,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getSubfieldName,
  getRepeatableFieldName,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const InstanceRelationship = ({
  parentInstances,
  childInstances,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  return (
    <Accordion
      id="instance-relationship"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.relationship.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-parent-instances
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(30)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.field.parentInstances.legend`} />}
          >
            <RepeatableField
              fields={parentInstances}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.field.parentInstances.addLabel`} />}
              onAdd={() => onAdd(parentInstances, 'parentInstances', 30, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, parentInstances, 30, setReferenceTables, 'order')}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.parentInstances.field.superInstanceId`} />}
                      name={getSubfieldName(30, 0, index)}
                    />
                  </Col>
                  <Col
                    data-test-parent-type-of-relation
                    xs={6}
                  >
                    <AcceptedValuesField
                      okapi={okapi}
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.parentInstances.field.instnaceRelationshipTypeId`} />}
                      name={getSubfieldName(30, 1, index)}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                      wrapperSourceLink="/instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name"
                      wrapperSourcePath="instanceRelationshipTypes"
                    />
                  </Col>
                </Row>
              )}
            />
          </RepeatableActionsField>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-child-instances
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(31)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.field.childInstances.legend`} />}
          >
            <RepeatableField
              fields={childInstances}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.field.childInstances.addLabel`} />}
              onAdd={() => onAdd(childInstances, 'childInstances', 31, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, childInstances, 31, setReferenceTables, 'order')}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.childInstances.field.subInstanceId`} />}
                      name={getSubfieldName(31, 0, index)}
                    />
                  </Col>
                  <Col
                    data-test-child-type-of-relation
                    xs={6}
                  >
                    <AcceptedValuesField
                      okapi={okapi}
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.childInstances.field.instnaceRelationshipTypeId`} />}
                      name={getSubfieldName(31, 1, index)}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                      wrapperSourceLink="/instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name"
                      wrapperSourcePath="instanceRelationshipTypes"
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

InstanceRelationship.propTypes = {
  parentInstances: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  childInstances: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
