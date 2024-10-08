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
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  AcceptedValuesField,
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
import {
  getWrapperSourceLink,
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const HoldingsNotes = ({
  notes,
  initialFields,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
  requestLimit,
}) => {
  return (
    <Accordion
      id="holdings-notes"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.holdingsNotes.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-notes
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(22)}
            repeatableFieldAction={getRepeatableFieldAction(22)}
            repeatableFieldIndex={22}
            hasRepeatableFields={!!notes.length}
            onRepeatableActionChange={setReferenceTables}
            recordType={FOLIO_RECORD_TYPES.HOLDINGS.type}
          >
            {isDisabled => (
              <RepeatableField
                fields={notes}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.holdingsNotes.addLabel`} />}
                onAdd={() => onAdd(notes, 'notes', 22, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, notes, 22, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-note
                      xs={4}
                    >
                      <AcceptedValuesField
                        component={TextField}
                        name={getSubfieldName(22, 0, index)}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.noteType`} />}
                        optionValue="name"
                        optionLabel="name"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        wrapperSources={[{
                          wrapperSourceLink: getWrapperSourceLink('HOLDINGS_NOTE_TYPES', requestLimit),
                          wrapperSourcePath: 'holdingsNoteTypes',
                        }]}
                        okapi={okapi}
                      />
                    </Col>
                    <Col xs={4}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.note`} />}
                            name={getSubfieldName(22, 1, index)}
                            validate={[validation]}
                          />
                        )}
                      </WithValidation>
                    </Col>
                    <Col
                      data-test-staff-only
                      xs={4}
                    >
                      <BooleanActionField
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.staffOnly`} />}
                        name={getBoolSubfieldName(22, 2, index)}
                        onBooleanFieldChange={setReferenceTables}
                        required
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

HoldingsNotes.propTypes = {
  notes: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  requestLimit: PropTypes.number,
};
