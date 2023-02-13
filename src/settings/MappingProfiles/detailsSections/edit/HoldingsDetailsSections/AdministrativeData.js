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
  BooleanActionField,
  AcceptedValuesField,
  RepeatableActionsField,
  WithValidation,
} from '../../../../../components';

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
import {
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const AdministrativeData = ({
  formerIds,
  statisticalCodeIds,
  administrativeNotes,
  initialFields,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
}) => {
  return (
    <Accordion
      id="administrative-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-suppress-from-discovery
          xs={6}
        >
          <BooleanActionField
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.discoverySuppress`} />}
            name={getBoolFieldName(0)}
            onBooleanFieldChange={setReferenceTables}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-holdings-hrid
          xs={3}
        >
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.hrid`} />}
            name={getFieldName(1)}
            disabled
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-former-ids
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(2)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.formerId.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(2)}
            repeatableFieldIndex={2}
            hasRepeatableFields={!!formerIds.length}
            onRepeatableActionChange={setReferenceTables}
            recordType={FOLIO_RECORD_TYPES.HOLDINGS.type}
          >
            {isDisabled => (
              <RepeatableField
                fields={formerIds}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.formerId.addLabel`} />}
                onAdd={() => onAdd(formerIds, 'formerIds', 2, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, formerIds, 2, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={12}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.formerId`} />}
                            name={getSubfieldName(2, 0, index)}
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
      <Row left="xs">
        <Col
          data-test-holdings-type
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(3)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.holdingsTypeId`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.HOLDING_TYPES,
              wrapperSourcePath: 'holdingsTypes',
            }]}
            isRemoveValueAllowed
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(3)}
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statistical-codes
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(4)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(4)}
            repeatableFieldIndex={4}
            hasRepeatableFields={!!statisticalCodeIds.length}
            onRepeatableActionChange={setReferenceTables}
            recordType={FOLIO_RECORD_TYPES.HOLDINGS.type}
          >
            {isDisabled => (
              <RepeatableField
                fields={statisticalCodeIds}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.addLabel`} />}
                onAdd={() => onAdd(statisticalCodeIds, 'statisticalCodeIds', 4, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, statisticalCodeIds, 4, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-statistical-code
                      xs={12}
                    >
                      <AcceptedValuesField
                        component={TextField}
                        name={getSubfieldName(4, 0, index)}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCode`} />}
                        optionValue="name"
                        optionLabel="name"
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
                        acceptedValuesPath={getRepeatableAcceptedValuesPath(4, 0, index)}
                        okapi={okapi}
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
            wrapperFieldName={getRepeatableFieldName(5)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.administrativeNotes.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(5)}
            repeatableFieldIndex={5}
            hasRepeatableFields={!!administrativeNotes.length}
            onRepeatableActionChange={setReferenceTables}
            recordType={FOLIO_RECORD_TYPES.HOLDINGS.type}
          >
            {isDisabled => (
              <RepeatableField
                fields={administrativeNotes}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.administrativeNotes.addLabel`} />}
                onAdd={() => onAdd(administrativeNotes, 'administrativeNotes', 5, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, administrativeNotes, 5, setReferenceTables, 'order')}
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
                            name={getSubfieldName(5, 0, index)}
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
  formerIds: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  statisticalCodeIds: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  administrativeNotes: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
