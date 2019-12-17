import React, {
  memo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {
  get,
  isEmpty,
} from 'lodash';

import stripesForm from '@folio/stripes/form';

import {
  FlexibleForm,
  FOLIO_RECORD_TYPES,
} from '../../components';
import {
  compose,
  matchFields,
  getDropdownOptions,
} from '../../utils';
import { LAYER_TYPES } from '../../utils/constants';
import { formConfigSamples } from '../../../test/bigtest/mocks';

import styles from './MatchProfilesForm.css';

const formName = 'matchProfilesForm';

export const MatchProfilesFormComponent = memo(({
  pristine,
  submitting,
  initialValues: {
    existingRecordType,
    name,
    matchDetails,
  },
  handleSubmit,
  location: { search },
  associatedJobProfilesAmount,
  onCancel,
  jsonSchemas,
}) => {
  const { layer } = queryString.parse(search);
  const isEditMode = layer === LAYER_TYPES.EDIT;

  const [selectedExistingRecord, setSelectedExistingRecord] = useState(isEditMode ? existingRecordType : '');
  const [existingRecordFields, setExistingRecordFields] = useState([]);
  const [isConfirmEditModalOpen, setConfirmModalOpen] = useState(false);

  const isSubmitDisabled = pristine || submitting;
  const paneTitle = isEditMode
    ? (
      <FormattedMessage id="ui-data-import.edit">
        {txt => `${txt} ${name}`}
      </FormattedMessage>
    )
    : <FormattedMessage id="ui-data-import.settings.matchProfiles.new" />;
  const headLine = isEditMode
    ? name
    : <FormattedMessage id="ui-data-import.settings.matchProfiles.new" />;

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

  const onExistingRecordChange = record => {
    const { type } = record;
    const matches = matchFields(jsonSchemas[type], type);
    const options = getDropdownOptions(matches);

    setSelectedExistingRecord(type);
    setExistingRecordFields(options);
  };

  const componentsProps = {
    'profile-headline': { children: headLine },
    'panel-existing': {
      id: 'panel-existing-edit',
      onRecordSelect: onExistingRecordChange,
    },
    'existing-record-section': {
      label: (
        <FormattedMessage
          id="ui-data-import.match.existing.record"
          values={{
            recordType: !isEmpty(selectedExistingRecord)
              ? <FormattedMessage id={FOLIO_RECORD_TYPES[selectedExistingRecord].captionId} />
              : '',
          }}
        />
      ),
    },
    'existing-record-field': {
      label: (
        <FormattedMessage
          id="ui-data-import.match.existing.record.field"
          values={{
            recordType: !isEmpty(selectedExistingRecord)
              ? <FormattedMessage id={FOLIO_RECORD_TYPES[selectedExistingRecord].captionId} />
              : '',
          }}
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
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired || PropTypes.string.isRequired,
  associatedJobProfilesAmount: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  jsonSchemas: PropTypes.shape({
    INSTANCE: PropTypes.object,
    HOLDINGS: PropTypes.object,
    ITEM: PropTypes.object,
    ORDER: PropTypes.object,
    INVOICE: PropTypes.object,
  }).isRequired,
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
  stripesForm({
    form: formName,
    navigationCheck: true,
    enableReinitialize: true,
  }),
  connect(mapStateToProps),
)(MatchProfilesFormComponent);
