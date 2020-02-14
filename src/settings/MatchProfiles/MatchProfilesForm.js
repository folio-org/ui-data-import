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
import { LAYER_TYPES } from '../../utils/constants';
import { formConfigSamples } from '../../../test/bigtest/mocks';

import styles from './MatchProfilesForm.css';

const formName = 'matchProfilesForm';

export const MatchProfilesFormComponent = memo(({
  pristine,
  submitting,
  initialValues,
  handleSubmit,
  location: { search },
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

  const [selectedExistingRecord, setSelectedExistingRecord] = useState(isEditMode ? existingRecordType : '');
  const [incomingRecord, setIncomingRecord] = useState(INCOMING_RECORD_TYPES[incomingRecordType]);
  const [existingRecordFields, setExistingRecordFields] = useState([]);
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

  const onFieldSearch = (value, dataOptions) => {
    return dataOptions.filter(o => new RegExp(`${value}`, 'i').test(o.label));
  };

  const onExistingRecordChange = ({ type }) => {
    const matches = matchFields(jsonSchemas[type], type);
    const options = getDropdownOptions(matches);

    setSelectedExistingRecord(type);
    setExistingRecordFields(options);
    dispatch(change(formName, 'profile.existingRecordType', type));
    dispatch(change(formName, 'profile.matchDetails[0].existingRecordType', type));
  };

  const onIncomingRecordChange = record => {
    setIncomingRecord(record);
    dispatch(change(formName, 'profile.incomingRecordType', record.type));
    dispatch(change(formName, 'profile.matchDetails[0].incomingRecordType', record.type));
  };

  const existingRecordLabel = !isEmpty(selectedExistingRecord)
    ? <FormattedMessage id={FOLIO_RECORD_TYPES[selectedExistingRecord].captionId} />
    : '';
  const incomingRecordLabel = !isEmpty(incomingRecord)
    ? <FormattedMessage id={incomingRecord.captionId} />
    : '';

  const componentsProps = {
    'profile-headline': { children: headLine },
    'panel-existing': {
      id: 'panel-existing-edit',
      existingRecordType,
      incomingRecordType,
      onRecordSelect: onExistingRecordChange,
      onIncomingRecordChange,
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
    'criterion1-value-type': {
      dataOptions: isEmpty(existingRecordFields) ? getInitialFields() : existingRecordFields,
      onFilter: onFieldSearch,
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
      componentsProps={componentsProps}
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

  return { associatedJobProfilesAmount };
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
