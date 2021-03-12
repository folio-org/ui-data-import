import React, {
  memo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
import {
  get,
  isEmpty,
  isEqual,
  noop,
} from 'lodash';

import stripesFinalForm from '@folio/stripes-final-form';

import {
  Headline,
  AccordionSet,
  Accordion,
  TextField,
  TextArea,
  RepeatableField,
  ConfirmationModal,
} from '@folio/stripes/components';
import { FullScreenForm } from '@folio/stripes-data-transfer-components';

import {
  FOLIO_RECORD_TYPES,
  MATCH_INCOMING_RECORD_TYPES,
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
  validateRequiredField,
  handleProfileSave,
} from '../../utils';

import { getSectionInitialValues } from './MatchProfiles';

export const MatchProfilesFormComponent = memo(({
  pristine,
  submitting,
  initialValues,
  handleSubmit,
  location: { search },
  onCancel,
  jsonSchemas,
  form,
  transitionToParams,
  match: { path },
}) => {
  const { formatMessage } = useIntl();

  const { profile } = initialValues;
  const {
    existingRecordType,
    incomingRecordType,
    name,
    matchDetails,
  } = profile;
  const associatedJobProfiles = profile.parentProfiles || [];
  const associatedJobProfilesAmount = associatedJobProfiles.length;
  const { layer } = queryString.parse(search);

  const isEditMode = layer === LAYER_TYPES.EDIT;
  const staticValueTypes = FORMS_SETTINGS[ENTITY_KEYS.MATCH_PROFILES].MATCHING.STATIC_VALUE_TYPES;

  const currentStaticValueType = get(form.getState(), ['values', 'profile', 'matchDetails', '0', 'incomingMatchExpression', 'staticValueDetails', 'staticValueType'], null);

  const [incomingRecord, setIncomingRecord] = useState(MATCH_INCOMING_RECORD_TYPES[incomingRecordType]);
  const [existingRecord, setExistingRecord] = useState(isEditMode ? existingRecordType : '');
  const [existingRecordFields, setExistingRecordFields] = useState([]);
  const [staticValueType, setStaticValueType] = useState(currentStaticValueType);
  const [isConfirmEditModalOpen, setConfirmModalOpen] = useState(false);

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
    if (isEditMode) {
      const matches = matchFields(jsonSchemas[existingRecordType], existingRecordType);

      return getDropdownOptions(matches);
    }

    return [];
  };
  const onSubmit = async event => {
    if (editWithModal) {
      event.preventDefault();
      setConfirmModalOpen(true);
    } else {
      await handleProfileSave(handleSubmit, form.reset, transitionToParams, path)(event);
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

  const handleExistingRecordChange = (type, matchFields, getDropdownOptions) => {
    const matches = matchFields(jsonSchemas[type], type);
    const options = getDropdownOptions(matches);

    setExistingRecord(type);
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
    ? formatMessage({ id: FOLIO_RECORD_TYPES[existingRecord].captionId })
    : '';

  return (
    <FullScreenForm
      id="match-profiles-form"
      paneTitle={paneTitle}
      submitButtonText={<FormattedMessage id="ui-data-import.saveAsProfile" />}
      cancelButtonText={<FormattedMessage id="ui-data-import.close" />}
      isSubmitButtonDisabled={isSubmitDisabled}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      <Headline
        size="xx-large"
        tag="h2"
        data-test-header-title
      >
        {headLine}
      </Headline>
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
                  existingRecordType={existingRecordType}
                  incomingRecordType={incomingRecordType}
                  onExistingSelect={({ type }) => handleExistingRecordChange(type, matchFields, getDropdownOptions)}
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
                        incomingRecordType={incomingRecord.type}
                        existingRecordType={existingRecord}
                        staticValueType={staticValueType}
                        incomingRecordLabel={incomingRecordLabel}
                        existingRecordLabel={existingRecordLabel}
                        existingRecordFields={isEmpty(existingRecordFields) ? getInitialFields(matchFields, getDropdownOptions) : existingRecordFields}
                        onStaticValueTypeChange={handleStaticValueTypeChange}
                        onQualifierSectionChange={handleQualifierSectionChange}
                        changeFormState={changeFormState}
                        formValues={form.getState().values}
                      />
                    )}
                  />
                </Accordion>
              </>
            )}
          </MatchingFieldsManager>
        </Accordion>
      </AccordionSet>
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
          await handleProfileSave(handleSubmit, form.reset, transitionToParams, path)();
          setConfirmModalOpen(false);
        }}
        onCancel={() => setConfirmModalOpen(false)}
      />
    </FullScreenForm>
  );
});

MatchProfilesFormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  location: PropTypes.oneOfType([
    PropTypes.shape({
      search: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.string.isRequired,
  ]),
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
};

export const MatchProfilesForm = compose(
  withProfileWrapper,
  stripesFinalForm({
    navigationCheck: true,
    destroyOnUnregister: true,
    initialValuesEqual: isEqual,
  }),
)(MatchProfilesFormComponent);
