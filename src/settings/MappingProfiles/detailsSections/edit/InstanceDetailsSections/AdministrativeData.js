import React, { useCallback } from 'react';
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
  DatePickerDecorator,
  AcceptedValuesField,
  RepeatableActionsField,
  WithValidation,
} from '../../../../../components';

import {
  validateMARCWithDate,
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';
import {
  onAdd,
  onRemove,
  getFieldName,
  getSubfieldName,
  getBoolFieldName,
  getRepeatableFieldName,
  getAcceptedValuesPath,
  getRepeatableAcceptedValuesPath,
} from '../../utils';
import {
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';

export const AdministrativeData = ({
  statisticalCodes,
  administrativeNotes,
  initialFields,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
}) => {
  const validateDatepickerFieldValue = useCallback(
    value => validateMARCWithDate(value, false),
    [],
  );

  return (
    <Accordion
      id="administrative-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-suppress-from-discovery
          xs={4}
        >
          <BooleanActionField
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.discoverySuppress`} />}
            name={getBoolFieldName(0)}
          />
        </Col>
        <Col
          data-test-staff-suppress
          xs={4}
        >
          <BooleanActionField
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.staffSuppress`} />}
            name={getBoolFieldName(1)}
          />
        </Col>
        <Col
          data-test-previously-held
          xs={4}
        >
          <BooleanActionField
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.previouslyHeld`} />}
            name={getBoolFieldName(2)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-instance-hrid
          xs={6}
        >
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.hrid`} />}
            name={getFieldName(3)}
            disabled
          />
        </Col>
        <Col
          data-test-metadata-source
          xs={6}
        >
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.source`} />}
            name={getFieldName(4)}
            disabled
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-cataloged-date
          xs={6}
        >
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.catalogedDate`} />}
            name={getFieldName(5)}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={[validateDatepickerFieldValue]}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-status-term
          xs={12}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(6)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.statusId`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.INSTANCE_STATUSES,
              wrapperSourcePath: 'instanceStatuses',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(6)}
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-mode-of-issuance
          xs={12}
        >
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.modeOfIssuanceId`} />}
            name={getFieldName(7)}
            disabled
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statistical-codes
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(8)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(8)}
            repeatableFieldIndex={8}
            hasRepeatableFields={!!statisticalCodes.length}
            onRepeatableActionChange={setReferenceTables}
          >
            {isDisabled => (
              <RepeatableField
                fields={statisticalCodes}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.addLabel`} />}
                onAdd={() => onAdd(statisticalCodes, 'statisticalCodeIds', 8, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, statisticalCodes, 8, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-statistical-code
                      xs={12}
                    >
                      <AcceptedValuesField
                        okapi={okapi}
                        component={TextField}
                        name={getSubfieldName(8, 0, index)}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCode`} />}
                        optionLabel="name"
                        optionValue="name"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        wrapperSourcesFn="statisticalCodeTypeName"
                        wrapperSources={[{
                          wrapperSourceLink: WRAPPER_SOURCE_LINKS.STATISTICAL_CODES,
                          wrapperSourcePath: 'statisticalCodes',
                        }, {
                          wrapperSourceLink: WRAPPER_SOURCE_LINKS.STATISTICAL_CODE_TYPES,
                          wrapperSourcePath: 'statisticalCodeTypes',
                        }]}
                        optionTemplate="**statisticalCodeTypeName**: **code** - **name**"
                        setAcceptedValues={setReferenceTables}
                        acceptedValuesPath={getRepeatableAcceptedValuesPath(8, 0, index)}
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
          data-test-admisitrative-notes
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(9)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.administrativeNotes.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(9)}
            repeatableFieldIndex={9}
            hasRepeatableFields={!!administrativeNotes.length}
            onRepeatableActionChange={setReferenceTables}
          >
            {isDisabled => (
              <RepeatableField
                fields={administrativeNotes}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.administrativeNotes.addLabel`} />}
                onAdd={() => onAdd(administrativeNotes, 'administrativeNotes', 9, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, administrativeNotes, 9, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-admisitrative-note
                      xs={12}
                    >
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.administrativeNote`} />}
                            name={getSubfieldName(9, 0, index)}
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

AdministrativeData.propTypes = {
  statisticalCodes: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  administrativeNotes: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
