import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField,
  RepeatableField,
} from '@folio/stripes/components';

import {
  RepeatableActionsField,
  WithValidation,
} from '../../../../../components';

import {
  getFieldName,
  getRepeatableFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileSubfieldShape } from '../../../../../utils';

export const EnumerationData = ({
  yearCaption,
  initialFields,
  setReferenceTables,
  getRepeatableFieldAction,
}) => {
  return (
    <Accordion
      id="enumeration-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-enumeration
          xs={4}
        >
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={getFieldName(16)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.enumeration`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col
          data-test-chronology
          xs={4}
        >
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={getFieldName(17)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.chronology`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-volume
          xs={6}
        >
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={getFieldName(18)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.field.volume`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-years-and-captions
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(19)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.field.yearCaption`} />}
            repeatableFieldAction={getRepeatableFieldAction(19)}
            repeatableFieldIndex={19}
            hasRepeatableFields={!!yearCaption.length}
            onRepeatableActionChange={setReferenceTables}
          >
            {isDisabled => (
              <RepeatableField
                fields={yearCaption}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.field.yearCaption.addLabel`} />}
                onAdd={() => onAdd(yearCaption, 'yearCaption', 19, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, yearCaption, 19, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={12}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.field.yearCaption`} />}
                            name={getSubfieldName(19, 0, index)}
                            validate={[validation]}
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

EnumerationData.propTypes = {
  yearCaption: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
};
