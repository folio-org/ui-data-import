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
  AcceptedValuesField,
  BooleanActionField,
  RepeatableActionsField,
} from '../../../../../components';

import {
  getBoolSubfieldName,
  getRepeatableFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  okapiShape,
  mappingProfileSubfieldShape,
} from '../../../../../utils';

export const ItemNotes = ({
  notes,
  initialFields,
  setReferenceTables,
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
          id="section-item-notes"
          xs={12}
        >
          <RepeatableActionsField wrapperFieldName={getRepeatableFieldName(24)}>
            <RepeatableField
              fields={notes}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.field.notes.addLabel`} />}
              onAdd={() => onAdd(notes, 'notes', 24, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, notes, 24, setReferenceTables, 'order')}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col
                    data-test-item-note
                    xs={4}
                  >
                    <AcceptedValuesField
                      component={TextField}
                      name={getSubfieldName(24, 0, index)}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.noteType`} />}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                      wrapperSourceLink="/item-note-types?limit=1000&query=cql.allRecords=1 sortby name"
                      wrapperSourcePath="itemNoteTypes"
                      okapi={okapi}
                    />
                  </Col>
                  <Col xs={4}>
                    <Field
                      component={TextField}
                      name={getSubfieldName(24, 1, index)}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.note`} />}
                    />
                  </Col>
                  <Col
                    data-test-staff-only
                    xs={4}
                  >
                    <BooleanActionField
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.staffOnly`} />}
                      name={getBoolSubfieldName(24, 2, index)}
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

ItemNotes.propTypes = {
  notes: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
