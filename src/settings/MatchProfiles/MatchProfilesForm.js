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
import { connect } from 'react-redux';
import {
  Field,
  change,
} from 'redux-form';
import {
  get,
  isEmpty,
  noop,
} from 'lodash';

import stripesForm from '@folio/stripes/form';

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
} from '../../components';
import { MatchCriterion } from '../../components/MatchCriterion/edit';

import {
  compose,
  matchFields,
  getDropdownOptions,
  withProfileWrapper,
  LAYER_TYPES,
  FORMS_SETTINGS,
  ENTITY_KEYS,
  validateRequiredField,
} from '../../utils';

import { getSectionInitialValues } from './MatchProfiles';

const formName = 'matchProfilesForm';

export const MatchProfilesFormComponent = memo(({
  pristine,
  submitting,
  initialValues,
  handleSubmit,
  location: { search },
  currentStaticValueType,
  associatedJobProfilesAmount,
  onCancel,
  jsonSchemas,
  dispatch,
  parentResources,
}) => {
  const intl = useIntl();

  const { profile } = initialValues;
  const {
    existingRecordType,
    incomingRecordType,
    name,
    matchDetails,
  } = profile;
  const { layer } = queryString.parse(search);

  const isEditMode = layer === LAYER_TYPES.EDIT;
  const staticValueTypes = FORMS_SETTINGS[ENTITY_KEYS.MATCH_PROFILES].MATCHING.STATIC_VALUE_TYPES;

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

  const getInitialFields = () => {
    if (isEditMode) {
      const matches = matchFields(jsonSchemas[existingRecordType], existingRecordType);

      return getDropdownOptions(matches, parentResources, intl);
    }

    return [];
  };

  const onSubmit = e => {
    if (editWithModal) {
      e.preventDefault();
      setConfirmModalOpen(true);
    } else {
      handleSubmit(e);
    }
  };

  const dispatchFormChange = (fieldName, fieldValue) => {
    dispatch(change(formName, fieldName, fieldValue));
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
          dispatchFormChange(`profile.matchDetails[${i}].incomingMatchExpression.staticValueDetails.${field}`, null);
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
    dispatchFormChange('profile.incomingRecordType', record.type);
    matchDetails.forEach((item, i) => {
      dispatchFormChange(`profile.matchDetails[${i}].incomingMatchExpression`, getSectionInitialValues(record.type));
      dispatchFormChange(`profile.matchDetails[${i}].incomingRecordType`, record.type);
    });

    if (record.type === MATCH_INCOMING_RECORD_TYPES.STATIC_VALUE.type) {
      setStaticValueType(staticValueTypes[0]);
    } else {
      setStaticValueType(null);
    }
  };

  const handleExistingRecordChange = ({ type }) => {
    const matches = matchFields(jsonSchemas[type], type);
    const options = getDropdownOptions(matches, parentResources, intl);

    setExistingRecord(type);
    setExistingRecordFields(options);
    dispatchFormChange('profile.existingRecordType', type);
    matchDetails.forEach((item, i) => {
      dispatchFormChange(`profile.matchDetails[${i}].existingMatchExpression`, getSectionInitialValues(type));
      dispatchFormChange(`profile.matchDetails[${i}].existingRecordType`, type);
    });
  };

  const handleQualifierSectionChange = (isChecked, matchDetailsIdx, expressionType, fieldsToClear) => {
    if (!isChecked) {
      fieldsToClear.forEach(field => {
        dispatchFormChange(`profile.matchDetails[${matchDetailsIdx}].${expressionType}.qualifier.${field}`, null);
      });
    }
  };

  const incomingRecordLabel = !isEmpty(incomingRecord)
    ? <FormattedMessage id={incomingRecord.captionId} />
    : '';
  const existingRecordLabel = !isEmpty(existingRecord)
    ? <FormattedMessage id={FOLIO_RECORD_TYPES[existingRecord].captionId} />
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
          <div data-test-name-field>
            <Field
              label={<FormattedMessage id="ui-data-import.name" />}
              name="profile.name"
              required
              component={TextField}
              validate={[validateRequiredField]}
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
          <RecordTypesSelect
            id="panel-existing-edit"
            existingRecordType={existingRecordType}
            incomingRecordType={incomingRecordType}
            onExistingSelect={handleExistingRecordChange}
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
                  existingRecordFields={isEmpty(existingRecordFields) ? getInitialFields() : existingRecordFields}
                  onStaticValueTypeChange={(event, newValue) => handleStaticValueTypeChange(newValue)}
                  onQualifierSectionChange={handleQualifierSectionChange}
                  dispatchFormChange={dispatchFormChange}
                />
              )}
            />
          </Accordion>
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
        onConfirm={() => {
          handleSubmit();
          setConfirmModalOpen(false);
        }}
        onCancel={() => setConfirmModalOpen(false)}
      />
    </FullScreenForm>
  );
});

MatchProfilesFormComponent.propTypes = {
  parentResources: PropTypes.object.isRequired,
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
  associatedJobProfilesAmount: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  currentStaticValueType: PropTypes.string,
  jsonSchemas: PropTypes.shape({
    INSTANCE: PropTypes.object,
    HOLDINGS: PropTypes.object,
    ITEM: PropTypes.object,
    ORDER: PropTypes.object,
    INVOICE: PropTypes.object,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const { length: associatedJobProfilesAmount } = get(
    state,
    ['folio_data_import_associated_jobprofiles', 'records', 0, 'childSnapshotWrappers'],
    [],
  );
  const currentStaticValueType = get(
    state,
    ['form', formName, 'values', 'profile', 'matchDetails', '0', 'incomingMatchExpression', 'staticValueDetails', 'staticValueType'],
    null,
  );

  return {
    currentStaticValueType,
    associatedJobProfilesAmount,
  };
};

export const MatchProfilesForm = compose(
  withProfileWrapper,
  stripesForm({
    form: formName,
    navigationCheck: true,
    enableReinitialize: true,
  }),
  connect(mapStateToProps),
)(MatchProfilesFormComponent);
