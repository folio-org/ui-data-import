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
  BooleanActionField,
  RepeatableActionsField,
  WithValidation,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getSubfieldName,
  getBoolSubfieldName,
  getRepeatableFieldName,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileSubfieldShape } from '../../../../../utils';

export const ReceivingHistory = ({
  receivingHistory,
  initialFields,
  setReferenceTables,
  getRepeatableFieldAction,
}) => {
  return (
    <Accordion
      id="holdings-receiving-history"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.receivingHistory.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-receiving-history-note
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(24)}
            repeatableFieldAction={getRepeatableFieldAction(24)}
            repeatableFieldIndex={24}
            hasRepeatableFields={!!receivingHistory.length}
            onRepeatableActionChange={setReferenceTables}
          >
            {isDisabled => (
              <RepeatableField
                fields={receivingHistory}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.receivingHistory.addLabel`} />}
                onAdd={() => onAdd(receivingHistory, 'receivingHistory.entries', 24, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, receivingHistory, 24, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-public-display
                      xs={4}
                    >
                      <BooleanActionField
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.publicDisplay`} />}
                        name={getBoolSubfieldName(24, 0, index)}
                      />
                    </Col>
                    <Col xs={4}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.enumeration`} />}
                            name={getSubfieldName(24, 1, index)}
                            validate={[validation]}
                          />
                        )}
                      </WithValidation>
                    </Col>
                    <Col
                      data-test-staff-only
                      xs={4}
                    >
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.chronology`} />}
                            name={getSubfieldName(24, 2, index)}
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

ReceivingHistory.propTypes = {
  receivingHistory: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
};
