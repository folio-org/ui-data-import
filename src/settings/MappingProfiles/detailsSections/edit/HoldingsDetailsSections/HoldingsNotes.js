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
  AcceptedValuesField, BooleanActionField,
  RepeatableActionsField,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getFieldName,
  getSubfieldName,
  getBoolSubfieldName,
} from '../utils';
import { TRANSLATION_ID_PREFIX } from '../constants';
import {
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const HoldingsNotes = ({
  notes,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  return (
    <Accordion
      id="holdings-notes"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.holdingsNotes.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-notes
          id="section-holding-statements"
          xs={12}
        >
          <RepeatableActionsField wrapperFieldName={getFieldName(21)}>
            <RepeatableField
              fields={notes}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.holdingsNotes.addLabel`} />}
              onAdd={() => onAdd(notes, 'notes', 21, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, notes, 21, setReferenceTables, 'order')}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col
                    data-test-note
                    xs={4}
                  >
                    <AcceptedValuesField
                      component={TextField}
                      name={getSubfieldName(21, 0, index)}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.noteType`} />}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                      wrapperSourceLink="/holdings-note-types?limit=1000&query=cql.allRecords=1 sortby name"
                      wrapperSourcePath="holdingsNoteTypes"
                      okapi={okapi}
                    />
                  </Col>
                  <Col xs={4}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.note`} />}
                      name={getSubfieldName(21, 1, index)}
                    />
                  </Col>
                  <Col
                    data-test-staff-only
                    xs={4}
                  >
                    <BooleanActionField
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.staffOnly`} />}
                      name={getBoolSubfieldName(21, 2, index)}
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

HoldingsNotes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape(mappingProfileSubfieldShape)).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.shape(okapiShape).isRequired,
};
