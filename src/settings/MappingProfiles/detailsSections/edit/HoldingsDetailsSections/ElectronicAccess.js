import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

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
  WithValidation,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getSubfieldName,
  getRepeatableFieldName,
  getRepeatableAcceptedValuesPath,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  isFieldPristine,
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const ElectronicAccess = ({
  electronicAccess,
  initialFields,
  setReferenceTables,
  getRepeatableFieldAction,
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
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(22)}
            repeatableFieldAction={getRepeatableFieldAction(22)}
            repeatableFieldIndex={22}
            hasRepeatableFields={!!electronicAccess.length}
            onRepeatableActionChange={setReferenceTables}
          >
            {isDisabled => (
              <RepeatableField
                fields={electronicAccess}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.EAccess.addLabel`} />}
                onAdd={() => onAdd(electronicAccess, 'electronicAccess', 22, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, electronicAccess, 22, setReferenceTables, 'order')}
                canAdd={!isDisabled}
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
                        wrapperSources={[{
                          wrapperSourceLink: '/electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name',
                          wrapperSourcePath: 'electronicAccessRelationships',
                        }]}
                        setAcceptedValues={setReferenceTables}
                        acceptedValuesPath={getRepeatableAcceptedValuesPath(22, 0, index)}
                        isFieldValueEqual={isFieldPristine}
                        okapi={okapi}
                      />
                    </Col>
                    <Col xs={2}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.uri`} />}
                            name={getSubfieldName(22, 1, index)}
                            validate={validation}
                            isEqual={isFieldPristine}
                          />
                        )}
                      </WithValidation>
                    </Col>
                    <Col xs={2}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.linkText`} />}
                            name={getSubfieldName(22, 2, index)}
                            validate={validation}
                            isEqual={isFieldPristine}
                          />
                        )}
                      </WithValidation>
                    </Col>
                    <Col xs={2}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.materialsSpecified`} />}
                            name={getSubfieldName(22, 3, index)}
                            validate={validation}
                            isEqual={isFieldPristine}
                          />
                        )}
                      </WithValidation>
                    </Col>
                    <Col xs={2}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.urlPublicNote`} />}
                            name={getSubfieldName(22, 4, index)}
                            validate={validation}
                            isEqual={isFieldPristine}
                          />
                        )}
                      </WithValidation>
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

ElectronicAccess.propTypes = {
  electronicAccess: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
