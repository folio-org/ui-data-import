import React, {
  memo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import {
  get,
  isEmpty,
} from 'lodash';

import stripesForm from '@folio/stripes/form';

import {
  FlexibleForm,
  FOLIO_RECORD_TYPES,
  INCOMING_RECORD_TYPES,
} from '../../components';
import {
  compose,
  matchFields,
  getDropdownOptions,
  withProfileWrapper,
} from '../../utils';
import {
  LAYER_TYPES,
  FORMS_SETTINGS, ENTITY_KEYS,
} from '../../utils/constants';

// @TODO: Remove this after server-side configs will be available
import { formConfigSamples } from '../../../test/bigtest/mocks';

import { getSectionInitialValues } from './MatchProfiles';

import styles from './MatchProfilesForm.css';

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
}) => {
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

  const [incomingRecord, setIncomingRecord] = useState(INCOMING_RECORD_TYPES[incomingRecordType]);
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
  const formConfig = formConfigSamples.find(cfg => cfg.name === formName);

  const getInitialFields = () => {
    if (isEditMode) {
      const matches = matchFields(jsonSchemas[existingRecordType], existingRecordType);

      return getDropdownOptions(matches);
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
          dispatch(change(formName, `profile.matchDetails[${i}].incomingMatchExpression.staticValueDetails.${field}`, null));
        });
      });
    };

    Object.keys(staticTypeFields).forEach(staticType => {
      if (staticType !== selectedStaticType) {
        changeFormFields(staticType);
      }
    });
  };

  const handleFieldSearch = (value, dataOptions) => {
    return dataOptions.filter(o => new RegExp(`${value}`, 'i').test(o.label));
  };

  const handleIncomingRecordChange = record => {
    setIncomingRecord(record);
    dispatch(change(formName, 'profile.incomingRecordType', record.type));
    matchDetails.forEach((item, i) => {
      dispatch(change(formName, `profile.matchDetails[${i}].incomingMatchExpression`, getSectionInitialValues(record.type)));
      dispatch(change(formName, `profile.matchDetails[${i}].incomingRecordType`, record.type));
    });

    if (record.type === INCOMING_RECORD_TYPES.STATIC_VALUE.type) {
      setStaticValueType(staticValueTypes[0]);
    } else {
      setStaticValueType(null);
    }
  };

  const handleExistingRecordChange = ({ type }) => {
    const matches = matchFields(jsonSchemas[type], type);
    const options = getDropdownOptions(matches);

    setExistingRecord(type);
    setExistingRecordFields(options);
    dispatch(change(formName, 'profile.existingRecordType', type));
    matchDetails.forEach((item, i) => {
      dispatch(change(formName, `profile.matchDetails[${i}].existingMatchExpression`, getSectionInitialValues(type)));
      dispatch(change(formName, `profile.matchDetails[${i}].existingRecordType`, type));
    });
  };

  const incomingRecordLabel = !isEmpty(incomingRecord)
    ? <FormattedMessage id={incomingRecord.captionId} />
    : '';
  const existingRecordLabel = !isEmpty(existingRecord)
    ? <FormattedMessage id={FOLIO_RECORD_TYPES[existingRecord].captionId} />
    : '';

  const injectedProps = {
    'profile-headline': { children: headLine },
    'section-incoming-field': { stateFieldValue: incomingRecord.type },
    'section-incoming-qualifier': { stateFieldValue: incomingRecord.type },
    'section-incoming-qualifier-part': { stateFieldValue: incomingRecord.type },
    'section-incoming-static-value-text': { stateFieldValue: staticValueType },
    'section-existing-field': { stateFieldValue: existingRecord },
    'section-existing-qualifier': { stateFieldValue: existingRecord },
    'section-existing-qualifier-part': { stateFieldValue: existingRecord },
    'panel-existing': {
      id: 'panel-existing-edit',
      existingRecordType,
      incomingRecordType,
      onExistingSelect: handleExistingRecordChange,
      onIncomingSelect: handleIncomingRecordChange,
    },
    'incoming-record-section': {
      label: (
        <FormattedMessage
          id="ui-data-import.match.incoming.record"
          values={{ recordType: incomingRecordLabel }}
        />
      ),
    },
    'incoming-record-field': {
      label: (
        <FormattedMessage
          id="ui-data-import.match.incoming.record.field"
          values={{ recordType: incomingRecordLabel }}
        />
      ),
    },
    'criterion-static-value-type': { onChange: (event, newValue) => handleStaticValueTypeChange(newValue) },
    'existing-record-section': {
      label: (
        <FormattedMessage
          id="ui-data-import.match.existing.record"
          values={{ recordType: existingRecordLabel }}
        />
      ),
    },
    'existing-record-field': {
      label: (
        <FormattedMessage
          id="ui-data-import.match.existing.record.field"
          values={{ recordType: existingRecordLabel }}
        />
      ),
    },
    'criterion-value-type': {
      dataOptions: isEmpty(existingRecordFields) ? getInitialFields() : existingRecordFields,
      onFilter: handleFieldSearch,
    },
    'confirm-edit-match-profile-modal': {
      open: isConfirmEditModalOpen,
      heading: <FormattedMessage id="ui-data-import.settings.matchProfiles.confirmEditModal.heading" />,
      message: (
        <FormattedMessage
          id="ui-data-import.settings.matchProfiles.confirmEditModal.message"
          values={{ amount: associatedJobProfilesAmount }}
        />
      ),
      confirmLabel: <FormattedMessage id="ui-data-import.confirm" />,
      onConfirm: () => {
        handleSubmit();
        setConfirmModalOpen(false);
      },
      onCancel: () => setConfirmModalOpen(false),
    },
  };

  return (
    <FlexibleForm
      component="FullScreenForm"
      id="match-profiles-form"
      config={formConfig}
      styles={styles}
      paneTitle={paneTitle}
      headLine={headLine}
      injectedProps={injectedProps}
      referenceTables={{ matchDetails }}
      submitMessage={<FormattedMessage id="ui-data-import.saveAsProfile" />}
      isSubmitDisabled={isSubmitDisabled}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
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
  // @TODO: Remove this when FlexibleForm internal state mamagement will be implemented.
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
