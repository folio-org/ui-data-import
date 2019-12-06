import React, {
  useEffect,
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

export const MatchProfilesFormComponent = ({
  pristine,
  submitting,
  initialValues,
  handleSubmit,
  parentResources,
  location: { search },
  associatedJobProfilesAmount,
  onCancel,
}) => {
  const [isConfirmEditModalOpen, setConfirmModalOpen] = useState(false);
  const [existingRecordFields, setExistingRecordFields] = useState([]);
  const [selectedExistingRecord, setSelectedExistingRecord] = useState('');

  const { layer } = queryString.parse(search);
  const isEditMode = layer === LAYER_TYPES.EDIT;
  const isSubmitDisabled = pristine || submitting;
  const {
    instanceSchema,
    holdingsSchema,
    itemSchema,
    poPurchaseOrderSchema,
    poRenewalSchema,
    poLineSchema,
    poDetailsSchema,
    poContributorSchema,
    poReceivingHistorySchema,
    poCostSchema,
    poFundDistributionSchema,
    poLocationSchema,
    poPhysicalResourceSchema,
    poEResourceSchema,
    poVendorSchema,
    invoiceSchema,
    invoiceAdjustmentsSchema,
    invoiceDocumentMetadataSchema,
    invoiceLineSchema,
    invoiceFundDistributionSchema,
  } = parentResources;
  const resources = {
    INSTANCE: { ...get(instanceSchema, 'records[0]') },
    HOLDINGS: { ...get(holdingsSchema, 'records[0]') },
    ITEM: { ...get(itemSchema, 'records[0]') },
    ORDER: {
      ...get(poPurchaseOrderSchema, 'records[0]'),
      ...get(poRenewalSchema, 'records[0]'),
      ...get(poLineSchema, 'records[0]'),
      ...get(poDetailsSchema, 'records[0]'),
      ...get(poContributorSchema, 'records[0]'),
      ...get(poReceivingHistorySchema, 'records[0]'),
      ...get(poCostSchema, 'records[0]'),
      ...get(poFundDistributionSchema, 'records[0]'),
      ...get(poLocationSchema, 'records[0]'),
      ...get(poPhysicalResourceSchema, 'records[0]'),
      ...get(poEResourceSchema, 'records[0]'),
      ...get(poVendorSchema, 'records[0]'),
    },
    INVOICE: {
      ...get(invoiceSchema, 'records[0]'),
      ...get(invoiceAdjustmentsSchema, 'records[0]'),
      ...get(invoiceDocumentMetadataSchema, 'records[0]'),
      ...get(invoiceLineSchema, 'records[0]'),
      ...get(invoiceFundDistributionSchema, 'records[0]'),
    },
  };
  const paneTitle = isEditMode
    ? (
      <FormattedMessage id="ui-data-import.edit">
        {txt => `${txt} ${initialValues.name}`}
      </FormattedMessage>
    )
    : <FormattedMessage id="ui-data-import.settings.matchProfiles.new" />;
  const headLine = isEditMode
    ? initialValues.name
    : <FormattedMessage id="ui-data-import.settings.matchProfiles.new" />;

  const editWithModal = isEditMode && associatedJobProfilesAmount;
  const formConfig = formConfigSamples.find(cfg => cfg.name === formName);

  useEffect(() => {
    if (isEditMode) {
      setSelectedExistingRecord(initialValues.existingRecordType);
    }
  }, [isEditMode, initialValues.existingRecordType]);

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
    const matches = matchFields(resources[type], type);
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
      dataOptions: existingRecordFields,
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
      referenceTables={{ matchDetails: initialValues.matchDetails }}
      submitMessage={<FormattedMessage id="ui-data-import.saveAsProfile" />}
      isSubmitDisabled={isSubmitDisabled}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

MatchProfilesFormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  associatedJobProfilesAmount: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  parentResources: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.string,
      notes: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]),
    }),
    records: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      isPending: PropTypes.bool,
      other: PropTypes.shape({ totalRecords: PropTypes.number.isRequired }),
      successfulMutations: PropTypes.arrayOf(
        PropTypes.shape({
          record: PropTypes.shape({ // eslint-disable-line object-curly-newline
            id: PropTypes.string.isRequired,
          }).isRequired,
        }),
      ),
    }),
    resultCount: PropTypes.number,
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
