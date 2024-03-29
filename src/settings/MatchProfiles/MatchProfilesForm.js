import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
import {
  get,
  set,
  isEmpty,
  isEqual,
  noop,
} from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';

import { TitleManager } from '@folio/stripes/core';
import {
  Headline,
  AccordionSet,
  Accordion,
  TextField,
  TextArea,
  RepeatableField,
  ConfirmationModal,
  AccordionStatus,
} from '@folio/stripes/components';
import {
  FullScreenForm,
  FOLIO_RECORD_TYPES,
} from '@folio/stripes-data-transfer-components';

import {
  EditKeyShortcutsWrapper,
  RecordTypesSelect,
  MatchingFieldsManager,
} from '../../components';
import { MatchCriterion } from '../../components/MatchCriterion/edit';

import {
  compose,
  withProfileWrapper,
  LAYER_TYPES,
  FORMS_SETTINGS,
  ENTITY_KEYS,
  RESTRICTED_MATCHING_MARC_FIELD_VALUE,
  handleProfileSave,
  isMARCType,
  validateRequiredField,
  validateAlphanumericOrAllowedValue,
  validateValueLength3,
  validateMARCFieldInMatchCriterion,
  validateValueLength1,
  MATCH_INCOMING_RECORD_TYPES,
} from '../../utils';

import { getSectionInitialValues } from './MatchProfiles';

const validate = values => {
  const errors = {};

  const enterValueMessage = <FormattedMessage id="ui-data-import.validation.enterValue" />;

  const existingRecordType = values.profile.existingRecordType;
  const incomingRecordType = values.profile.incomingRecordType;
  const existingRecordFields = values.profile.matchDetails[0].existingMatchExpression.fields;
  const incomingRecordFields = values.profile.matchDetails[0].incomingMatchExpression.fields;

  const validateMARCRecordFields = (recordFieldType, recordFields) => {
    const fieldValue = recordFields[0]?.value;
    const indicator1Value = recordFields[1]?.value;
    const indicator2Value = recordFields[2]?.value;
    const subfieldValue = recordFields[3]?.value;

    const isRestrictedValue = RESTRICTED_MATCHING_MARC_FIELD_VALUE.some(value => value === fieldValue);

    if (!fieldValue) {
      set(errors, `profile.matchDetails[0].${recordFieldType}MatchExpression.fields[0].value`, enterValueMessage);
    } else {
      const fieldValidation = validateAlphanumericOrAllowedValue(fieldValue) || validateValueLength3(fieldValue);

      if (fieldValidation) {
        set(errors, `profile.matchDetails[0].${recordFieldType}MatchExpression.fields[0].value`, fieldValidation);
      }
    }

    if (isRestrictedValue) {
      const validation = validateMARCFieldInMatchCriterion(indicator1Value, indicator2Value, subfieldValue);

      if (validation) {
        set(errors, `profile.matchDetails[0].${recordFieldType}MatchExpression.fields[1].value`, validation);
        set(errors, `profile.matchDetails[0].${recordFieldType}MatchExpression.fields[2].value`, validation);
        set(errors, `profile.matchDetails[0].${recordFieldType}MatchExpression.fields[3].value`, validation);
      }
    } else {
      const indicator1Validation = validateAlphanumericOrAllowedValue(indicator1Value, '*')
        || validateValueLength1(indicator1Value);
      const indicator2Validation = validateAlphanumericOrAllowedValue(indicator2Value, '*')
        || validateValueLength1(indicator2Value);
      const subfieldValidation = validateRequiredField(subfieldValue)
        || validateAlphanumericOrAllowedValue(subfieldValue) || validateValueLength1(subfieldValue);

      if (indicator1Validation) {
        set(errors, `profile.matchDetails[0].${recordFieldType}MatchExpression.fields[1].value`, indicator1Validation);
      }

      if (indicator2Validation) {
        set(errors, `profile.matchDetails[0].${recordFieldType}MatchExpression.fields[2].value`, indicator2Validation);
      }

      if (subfieldValidation) {
        set(errors, `profile.matchDetails[0].${recordFieldType}MatchExpression.fields[3].value`, subfieldValidation);
      }
    }
  };

  if (isMARCType(incomingRecordType) && !isEmpty(incomingRecordFields)) {
    validateMARCRecordFields('incoming', incomingRecordFields);
  }

  if (isMARCType(existingRecordType) && !isEmpty(existingRecordFields)) {
    validateMARCRecordFields('existing', existingRecordFields);
  } else if (!existingRecordFields[0].value) {
    set(errors, 'profile.matchDetails[0].existingMatchExpression.fields[0].value', enterValueMessage);
  }

  return errors;
};

export const MatchProfilesFormComponent = memo(({
  pristine,
  submitting,
  initialValues,
  handleSubmit,
  onCancel,
  jsonSchemas,
  form,
  transitionToParams,
  accordionStatusRef,
  layerType,
  baseUrl,
}) => {
  const { formatMessage } = useIntl();

  const { profile } = initialValues;
  const {
    existingRecordType: initialExistingRecordType,
    name,
    matchDetails,
  } = profile;
  const associatedJobProfiles = profile.parentProfiles || [];
  const associatedJobProfilesAmount = associatedJobProfiles.length;

  const isEditMode = layerType === LAYER_TYPES.EDIT;
  const isDuplicateMode = layerType === LAYER_TYPES.DUPLICATE;
  const staticValueTypes = FORMS_SETTINGS[ENTITY_KEYS.MATCH_PROFILES].MATCHING.STATIC_VALUE_TYPES;

  const currentStaticValueType = get(form.getState(), ['values', 'profile', 'matchDetails', '0', 'incomingMatchExpression', 'staticValueDetails', 'staticValueType'], null);
  const currectIncomingRecordType = get(form.getState(), ['values', 'profile', 'incomingRecordType'], null);
  const currectExistingRecordType = get(form.getState(), ['values', 'profile', 'existingRecordType'], null);

  const [incomingRecord, setIncomingRecord] = useState({});
  const [existingRecord, setExistingRecord] = useState({});
  const [existingRecordFields, setExistingRecordFields] = useState([]);
  const [staticValueType, setStaticValueType] = useState(currentStaticValueType);
  const [isConfirmEditModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    setIncomingRecord(MATCH_INCOMING_RECORD_TYPES[currectIncomingRecordType]);
    setExistingRecord(FOLIO_RECORD_TYPES[currectExistingRecordType]);
    setStaticValueType(currentStaticValueType);
  }, [currectExistingRecordType, currectIncomingRecordType, currentStaticValueType]);

  const isSubmitDisabled = pristine || submitting;
  const newLabel = <FormattedMessage id="ui-data-import.settings.matchProfiles.new" />;
  const getLabel = label => (isEditMode ? label : newLabel);

  const paneTitle = getLabel((
    <FormattedMessage id="ui-data-import.edit">
      {txt => `${txt} ${name}`}
    </FormattedMessage>
  ));
  const headLine = getLabel(name);

  const editWithModal = isEditMode && associatedJobProfilesAmount;

  const getInitialFields = (matchFields, getDropdownOptions) => {
    if (isEditMode || isDuplicateMode) {
      const matches = matchFields(jsonSchemas[initialExistingRecordType], initialExistingRecordType);

      return getDropdownOptions(matches);
    }

    return [];
  };

  const onSubmit = async event => {
    if (editWithModal) {
      event.preventDefault();
      setConfirmModalOpen(true);
    } else {
      await handleProfileSave(handleSubmit, form.reset, transitionToParams, baseUrl)(event);
    }
  };

  const changeFormState = (fieldName, fieldValue) => {
    form.change(fieldName, fieldValue);
  };

  const handleStaticValueTypeChange = selectedStaticType => {
    setStaticValueType(selectedStaticType);

    const staticTypeFields = {
      TEXT: ['text'],
      NUMBER: ['number'],
      EXACT_DATE: ['exactDate'],
      DATE_RANGE: ['fromDate', 'toDate'],
    };

    const changeFormFields = staticType => {
      staticTypeFields[staticType].forEach(field => {
        matchDetails.forEach((item, i) => {
          changeFormState(`profile.matchDetails[${i}].incomingMatchExpression.staticValueDetails.${field}`, null);
        });
      });
    };

    Object.keys(staticTypeFields).forEach(staticType => {
      if (staticType !== selectedStaticType) {
        changeFormFields(staticType);
      }
    });
  };

  const handleIncomingRecordChange = record => {
    setIncomingRecord(record);
    changeFormState('profile.incomingRecordType', record.type);
    matchDetails.forEach((item, i) => {
      changeFormState(`profile.matchDetails[${i}].incomingMatchExpression`, getSectionInitialValues(record.type));
      changeFormState(`profile.matchDetails[${i}].incomingRecordType`, record.type);
    });

    if (record.type === MATCH_INCOMING_RECORD_TYPES.STATIC_VALUE.type) {
      setStaticValueType(staticValueTypes[0]);
    } else {
      setStaticValueType(null);
    }
  };

  const handleExistingRecordChange = (record, matchFields, getDropdownOptions) => {
    const { type } = record;
    const matches = matchFields(jsonSchemas[type], type);
    const options = getDropdownOptions(matches);

    setExistingRecord(record);
    setExistingRecordFields(options);
    changeFormState('profile.existingRecordType', type);
    matchDetails.forEach((item, i) => {
      changeFormState(`profile.matchDetails[${i}].existingMatchExpression`, getSectionInitialValues(type));
      changeFormState(`profile.matchDetails[${i}].existingRecordType`, type);
    });
  };

  const handleQualifierSectionChange = (isChecked, matchDetailsIdx, expressionType, fieldsToClear) => {
    if (!isChecked) {
      fieldsToClear.forEach(field => {
        changeFormState(`profile.matchDetails[${matchDetailsIdx}].${expressionType}.qualifier.${field}`, null);
      });
    }
  };

  const incomingRecordLabel = !isEmpty(incomingRecord)
    ? formatMessage({ id: incomingRecord.captionId })
    : '';
  const existingRecordLabel = !isEmpty(existingRecord)
    ? formatMessage({ id: existingRecord.captionId })
    : '';

  return (
    <EditKeyShortcutsWrapper onSubmit={onSubmit}>
      <FullScreenForm
        id="match-profiles-form"
        paneTitle={paneTitle}
        submitButtonText={<FormattedMessage id="ui-data-import.saveAsProfile" />}
        cancelButtonText={<FormattedMessage id="ui-data-import.close" />}
        isSubmitButtonDisabled={isSubmitDisabled}
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <TitleManager
          prefix={`${formatMessage({ id: 'ui-data-import.settings.dataImport.title' })} - `}
          page={formatMessage({ id: 'ui-data-import.settings.matchProfiles.title' })}
          record={`${formatMessage({ id: `ui-data-import.${layerType}` })} ${profile.name}`}
        />
        <Headline
          size="xx-large"
          tag="h2"
          data-test-header-title
        >
          {headLine}
        </Headline>
        <AccordionStatus ref={accordionStatusRef}>
          <AccordionSet>
            <Accordion
              id="summary"
              label={<FormattedMessage id="ui-data-import.summary" />}
              separator={false}
            >
              {/* Register known field names to ensure form.change usages behave as expected */}
              <Field
                name="profile.incomingRecordType"
                render={() => null}
              />
              <Field
                name="profile.existingRecordType"
                render={() => null}
              />
              {/* End of Registering known field names */}

              <div data-test-name-field>
                <Field
                  label={<FormattedMessage id="ui-data-import.name" />}
                  name="profile.name"
                  required
                  component={TextField}
                  validate={validateRequiredField}
                />
              </div>
              <div data-test-description-field>
                <Field
                  label={<FormattedMessage id="ui-data-import.description" />}
                  name="profile.description"
                  component={TextArea}
                />
              </div>
            </Accordion>
            <Accordion
              id="match-profile-details"
              label={<FormattedMessage id="ui-data-import.details" />}
              separator={false}
            >
              <MatchingFieldsManager>
                {({
                  matchFields,
                  getDropdownOptions,
                }) => (
                  <>
                    <RecordTypesSelect
                      id="panel-existing-edit"
                      existingRecordType={existingRecord?.type}
                      incomingRecordType={incomingRecord?.type}
                      onExistingSelect={(record) => handleExistingRecordChange(record, matchFields, getDropdownOptions)}
                      onIncomingSelect={handleIncomingRecordChange}
                    />
                    <Accordion
                      id="match-criteria"
                      label={<FormattedMessage id="ui-data-import.match.criteria" />}
                      separator={false}
                    >
                      <RepeatableField
                        fields={matchDetails}
                        canAdd={false}
                        canRemove={false}
                        onAdd={noop}
                        renderField={(field, index) => (
                          <MatchCriterion
                            repeatableIndex={index}
                            matchDetails={field}
                            incomingRecordType={incomingRecord?.type}
                            existingRecordType={existingRecord?.type}
                            staticValueType={staticValueType}
                            incomingRecordLabel={incomingRecordLabel}
                            existingRecordLabel={existingRecordLabel}
                            existingRecordFields={isEmpty(existingRecordFields) ? getInitialFields(matchFields, getDropdownOptions) : existingRecordFields}
                            onStaticValueTypeChange={handleStaticValueTypeChange}
                            onQualifierSectionChange={handleQualifierSectionChange}
                            changeFormState={changeFormState}
                            formValues={matchDetails}
                          />
                        )}
                      />
                    </Accordion>
                  </>
                )}
              </MatchingFieldsManager>
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
        <ConfirmationModal
          id="confirm-edit-match-profile-modal"
          open={isConfirmEditModalOpen}
          heading={<FormattedMessage id="ui-data-import.settings.matchProfiles.confirmEditModal.heading" />}
          message={(
            <FormattedMessage
              id="ui-data-import.settings.matchProfiles.confirmEditModal.message"
              values={{ amount: associatedJobProfilesAmount }}
            />
          )}
          confirmLabel={<FormattedMessage id="ui-data-import.confirm" />}
          onConfirm={async () => {
            await handleProfileSave(handleSubmit, form.reset, transitionToParams, baseUrl)();
            setConfirmModalOpen(false);
          }}
          onCancel={() => setConfirmModalOpen(false)}
        />
      </FullScreenForm>
    </EditKeyShortcutsWrapper>
  );
});

MatchProfilesFormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  baseUrl: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  jsonSchemas: PropTypes.shape({
    INSTANCE: PropTypes.object,
    HOLDINGS: PropTypes.object,
    ITEM: PropTypes.object,
    ORDER: PropTypes.object,
    INVOICE: PropTypes.object,
  }).isRequired,
  form: PropTypes.shape({
    getState: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    getFieldState: PropTypes.func.isRequired,
    batch: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  }).isRequired,
  transitionToParams: PropTypes.func.isRequired,
  match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  accordionStatusRef: PropTypes.object,
  layerType: PropTypes.string,
};

export const MatchProfilesForm = compose(
  withProfileWrapper,
  stripesFinalForm({
    navigationCheck: true,
    destroyOnUnregister: true,
    initialValuesEqual: isEqual,
    validate,
  }),
)(MatchProfilesFormComponent);
