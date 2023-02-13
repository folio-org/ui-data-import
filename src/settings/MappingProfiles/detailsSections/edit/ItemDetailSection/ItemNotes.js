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

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';
import {
  AcceptedValuesField,
  BooleanActionField,
  RepeatableActionsField,
  WithValidation,
} from '../../../../../components';

import {
  getBoolSubfieldName,
  getRepeatableAcceptedValuesPath,
  getRepeatableFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';
import {
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  okapiShape,
  mappingProfileSubfieldShape,
} from '../../../../../utils';

export const ItemNotes = ({
  notes,
  initialFields,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
}) => {
  return (
    <Accordion
      id="item-notes"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemNotes.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-item-notes
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(25)}
            repeatableFieldAction={getRepeatableFieldAction(25)}
            repeatableFieldIndex={25}
            hasRepeatableFields={!!notes.length}
            onRepeatableActionChange={setReferenceTables}
            recordType={FOLIO_RECORD_TYPES.ITEM.type}
          >
            {isDisabled => (
              <RepeatableField
                fields={notes}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.field.notes.addLabel`} />}
                onAdd={() => onAdd(notes, 'notes', 25, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, notes, 25, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-item-note
                      xs={4}
                    >
                      <AcceptedValuesField
                        component={TextField}
                        name={getSubfieldName(25, 0, index)}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.noteType`} />}
                        optionValue="name"
                        optionLabel="name"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        wrapperSources={[{
                          wrapperSourceLink: WRAPPER_SOURCE_LINKS.ITEM_NOTE_TYPES,
                          wrapperSourcePath: 'itemNoteTypes',
                        }]}
                        setAcceptedValues={setReferenceTables}
                        acceptedValuesPath={getRepeatableAcceptedValuesPath(25, 0, index)}
                        okapi={okapi}
                      />
                    </Col>
                    <Col xs={4}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            name={getSubfieldName(25, 1, index)}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.note`} />}
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
                        name={getBoolSubfieldName(25, 2, index)}
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

ItemNotes.propTypes = {
  notes: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
