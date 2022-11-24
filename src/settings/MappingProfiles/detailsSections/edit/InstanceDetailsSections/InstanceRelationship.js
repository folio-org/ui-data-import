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
  WithValidation,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getSubfieldName,
  getRepeatableFieldName,
  getRepeatableAcceptedValuesPath,
} from '../../utils';
import {
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const InstanceRelationship = ({
  parentInstances,
  childInstances,
  initialFields,
  setReferenceTables,
  getRepeatableFieldAction,
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
            wrapperFieldName={getRepeatableFieldName(31)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.field.parentInstances.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(31)}
            repeatableFieldIndex={31}
            hasRepeatableFields={!!parentInstances.length}
            onRepeatableActionChange={setReferenceTables}
          >
            {isDisabled => (
              <RepeatableField
                fields={parentInstances}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.field.parentInstances.addLabel`} />}
                onAdd={() => onAdd(parentInstances, 'parentInstances', 31, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, parentInstances, 31, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={6}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.parentInstances.field.superInstanceId`} />}
                            name={getSubfieldName(31, 0, index)}
                            validate={[validation]}
                          />
                        )}
                      </WithValidation>

                    </Col>
                    <Col
                      data-test-parent-type-of-relation
                      xs={6}
                    >
                      <AcceptedValuesField
                        okapi={okapi}
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.parentInstances.field.instanceRelationshipTypeId`} />}
                        name={getSubfieldName(31, 1, index)}
                        optionValue="name"
                        optionLabel="name"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        wrapperSources={[{
                          wrapperSourceLink: WRAPPER_SOURCE_LINKS.INSTANCE_RELATIONSHIP_TYPES,
                          wrapperSourcePath: 'instanceRelationshipTypes',
                        }]}
                        setAcceptedValues={setReferenceTables}
                        acceptedValuesPath={getRepeatableAcceptedValuesPath(31, 1, index)}
                      />
                    </Col>
                  </Row>
                )}
              />
            )}
          </RepeatableActionsField>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-child-instances
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(32)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.field.childInstances.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(32)}
            repeatableFieldIndex={32}
            hasRepeatableFields={!!childInstances.length}
            onRepeatableActionChange={setReferenceTables}
          >
            {isDisabled => (
              <RepeatableField
                fields={childInstances}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.field.childInstances.addLabel`} />}
                onAdd={() => onAdd(childInstances, 'childInstances', 32, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, childInstances, 32, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={6}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.childInstances.field.subInstanceId`} />}
                            name={getSubfieldName(32, 0, index)}
                            validate={[validation]}
                          />
                        )}
                      </WithValidation>
                    </Col>
                    <Col
                      data-test-child-type-of-relation
                      xs={6}
                    >
                      <AcceptedValuesField
                        okapi={okapi}
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.childInstances.field.instanceRelationshipTypeId`} />}
                        name={getSubfieldName(32, 1, index)}
                        optionValue="name"
                        optionLabel="name"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        wrapperSources={[{
                          wrapperSourceLink: WRAPPER_SOURCE_LINKS.INSTANCE_RELATIONSHIP_TYPES,
                          wrapperSourcePath: 'instanceRelationshipTypes',
                        }]}
                        setAcceptedValues={setReferenceTables}
                        acceptedValuesPath={getRepeatableAcceptedValuesPath(32, 1, index)}
                      />
                    </Col>
                  </Row>
                )}
              />
            )}
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
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
