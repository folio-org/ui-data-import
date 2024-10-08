import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
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
  getFieldName,
  getRepeatableFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
  renderFieldLabelWithInfo,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getWrapperSourceLink,
  createOptionsList,
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
  requestLimit,
}) => {
  const { formatMessage } = useIntl();

  const statusesList = createOptionsList(ITEM_STATUS_OPTIONS, formatMessage);
  const circulationNotesList = createOptionsList(ITEM_CIRCULATION_NOTES_OPTIONS, formatMessage);
  const initialCirculationNotes = useRef(circulationNotes);

  const permanentLoanTypeLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.item.itemLoans.field.loanTypePermanentRequired`,
    `${TRANSLATION_ID_PREFIX}.item.requiredWhenCreatingItem.info`,
  );
  const statusLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.item.itemLoans.field.loanStatus`,
    `${TRANSLATION_ID_PREFIX}.item.requiredWhenCreatingItem.info`,
  );

  const getCirculationNoteTypeState = index => {
    const initialValue = initialCirculationNotes.current[index]?.fields.find(item => item.name === 'noteType').value;
    const currentValue = circulationNotes[index]?.fields.find(item => item.name === 'noteType').value;
    const isDirty = currentValue !== initialValue;

    const updatedValue = circulationNotesList.find(item => `"${item.value}"` === currentValue);
    const updatedValueLabel = updatedValue?.label;
    const value = updatedValueLabel ? `"${updatedValueLabel}"` : currentValue;

    return {
      value,
      isDirty,
    };
  };

  const handleCirculationNoteTypeChange = index => value => {
    setReferenceTables(getSubfieldName(29, 0, index), value);
  };

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
            name={getFieldName(26)}
            label={permanentLoanTypeLabel}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('LOAN_TYPES', requestLimit),
              wrapperSourcePath: 'loantypes',
            }]}
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
            name={getFieldName(27)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemLoans.field.loanTypeTemporary`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('LOAN_TYPES', requestLimit),
              wrapperSourcePath: 'loantypes',
            }]}
            isRemoveValueAllowed
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
            name={getFieldName(28)}
            label={statusLabel}
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
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(29)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.field.circulationNotes.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(29)}
            repeatableFieldIndex={29}
            hasRepeatableFields={!!circulationNotes.length}
            onRepeatableActionChange={setReferenceTables}
            recordType={FOLIO_RECORD_TYPES.ITEM.type}
          >
            {isDisabled => (
              <RepeatableField
                fields={circulationNotes}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.field.circulationNotes.addLabel`} />}
                onAdd={() => onAdd(circulationNotes, 'circulationNotes', 29, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, circulationNotes, 29, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-circulation-note
                      xs={4}
                    >
                      <AcceptedValuesField
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.noteType`} />}
                        optionValue="value"
                        optionLabel="label"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        acceptedValuesList={circulationNotesList}
                        componentValue={getCirculationNoteTypeState(index).value}
                        onChange={handleCirculationNoteTypeChange(index)}
                        isDirty={getCirculationNoteTypeState(index).isDirty}
                        okapi={okapi}
                        isFormField={false}
                      />
                    </Col>
                    <Col xs={4}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            name={getSubfieldName(29, 1, index)}
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
                        name={getBoolSubfieldName(29, 2, index)}
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

LoanAndAvailability.propTypes = {
  circulationNotes: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  requestLimit: PropTypes.number,
};
