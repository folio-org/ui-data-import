import React, { useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { get } from 'lodash';

import stripesForm from '@folio/stripes/form';

import { FlexibleForm } from '../../components';
import {
  compose,
  validateRequiredField,
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
  location: { search },
  connectedSource: { props: { editRecordInitialValues } },
  associatedJobProfilesAmount,
  onCancel,
}) => {
  const [isConfirmEditModalOpen, setConfirmModalOpen] = useState(false);

  const { layer } = queryString.parse(search);
  const isEditMode = layer === LAYER_TYPES.EDIT;
  const isSubmitDisabled = pristine || submitting;

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

  const onSubmit = e => {
    if (editWithModal) {
      e.preventDefault();
      setConfirmModalOpen(true);
    } else {
      handleSubmit(e);
    }
  };

  /*
  return (
    <FullScreenForm
      id="match-profiles-form"
      paneTitle={paneTitle}
      submitMessage={<FormattedMessage id="ui-data-import.saveAsProfile" />}
      isSubmitDisabled={isSubmitDisabled}
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
          label={<FormattedMessage id="ui-data-import.summary" />}
          separator={false}
        >
          <div data-test-name-field>
            <Field
              label={<FormattedMessage id="ui-data-import.name" />}
              name="name"
              required
              component={TextField}
              validate={[validateRequiredField]}
            />
          </div>
          <div data-test-description-field>
            <Field
              label={<FormattedMessage id="ui-data-import.description" />}
              name="description"
              component={TextArea}
            />
          </div>
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-data-import.details" />}
          separator={false}
        >
          <RecordTypesSelect />
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
  */
  return (
    <FlexibleForm
      component="FullScreenForm"
      id="match-profiles-form"
      config={formConfig}
      styles={styles}
      paneTitle={paneTitle}
      headLine={headLine}
      referenceTables={{ matchDetails: editRecordInitialValues.matchDetails }}
      submitMessage={<FormattedMessage id="ui-data-import.save" />}
      confirmationMessage={(
        <FormattedMessage
          id="ui-data-import.settings.matchProfiles.confirmEditModal.message"
          values={{ amount: associatedJobProfilesAmount }}
        />
      )}
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
};

const mapStateToProps = state => {
  const { length: associatedJobProfilesAmount } = get(
    state,
    ['folio_data_import_associated_job_profiles', 'records', 0, 'childSnapshotWrappers'],
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
