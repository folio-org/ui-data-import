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
  getAcceptedValuesPath,
  getBoolSubfieldName,
  getFieldName,
  getRepeatableFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  ITEM_STATUS_OPTIONS,
  ITEM_CIRCULATION_NOTES_OPTIONS,
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const LoanAndAvailability = ({
  circulationNotes,
  initialFields,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
}) => {
  const createOptionList = arr => arr.map(option => ({
    value: option.value,
    label: <FormattedMessage id={option.label} />,
  }));

  const statusesList = createOptionList(ITEM_STATUS_OPTIONS);
  const circulationNotesList = createOptionList(ITEM_CIRCULATION_NOTES_OPTIONS);

  return (
    <Accordion
      id="item-loans"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemLoans.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-permanent-loan-type
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(25)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemLoans.field.loanTypePermanentRequired`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/loan-types?limit=1000&query=cql.allRecords=1 sortby name',
              wrapperSourcePath: 'loantypes',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(25)}
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-temporary-loan-type
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(26)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemLoans.field.loanTypeTemporary`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/loan-types?limit=1000&query=cql.allRecords=1 sortby name',
              wrapperSourcePath: 'loantypes',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(26)}
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-status
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(27)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemLoans.field.loanStatus`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={statusesList}
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-circulation-notes
          id="section-circulation-notes"
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(28)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.field.circulationNotes.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(28)}
            repeatableFieldIndex={28}
            hasRepeatableFields={!!circulationNotes.length}
            onRepeatableActionChange={setReferenceTables}
          >
            {isDisabled => (
              <RepeatableField
                fields={circulationNotes}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.field.circulationNotes.addLabel`} />}
                onAdd={() => onAdd(circulationNotes, 'circulationNotes', 28, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, circulationNotes, 28, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-circulation-note
                      xs={4}
                    >
                      <AcceptedValuesField
                        component={TextField}
                        name={getSubfieldName(28, 0, index)}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.noteType`} />}
                        optionValue="value"
                        optionLabel="label"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        acceptedValuesList={circulationNotesList}
                        okapi={okapi}
                      />
                    </Col>
                    <Col xs={4}>
                      <Field
                        component={TextField}
                        name={getSubfieldName(28, 1, index)}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.note`} />}
                      />
                    </Col>
                    <Col
                      data-test-staff-only
                      xs={4}
                    >
                      <BooleanActionField
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.staffOnly`} />}
                        name={getBoolSubfieldName(28, 2, index)}
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

LoanAndAvailability.propTypes = {
  circulationNotes: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
