import React, { useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import { get } from 'lodash';

import {
  Headline,
  TextArea,
  TextField,
  Accordion,
  AccordionSet,
  ConfirmationModal,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import { FullScreenForm } from '../FullScreenForm';
import {
  compose,
  validateRequiredField,
} from '../../utils';
import { LAYER_TYPES } from '../../utils/constants';

const formName = 'actionProfilesForm';

export const ActionProfilesFormComponent = props => {
  const {
    pristine,
    submitting,
    initialValues,
    handleSubmit,
    location: { search },
    associatedJobProfilesAmount,
    onCancel,
  } = props;
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
    : <FormattedMessage id="ui-data-import.settings.actionProfiles.new" />;
  const headLine = isEditMode
    ? initialValues.name
    : <FormattedMessage id="ui-data-import.settings.actionProfiles.new" />;

  const editWithModal = isEditMode && associatedJobProfilesAmount;

  const onSubmit = e => {
    if (editWithModal) {
      e.preventDefault();
      setConfirmModalOpen(true);
    } else {
      handleSubmit(e);
    }
  };

  return (
    <FullScreenForm
      id="action-profiles-form"
      paneTitle={paneTitle}
      submitMessage={<FormattedMessage id="ui-data-import.save" />}
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
          <div>
            {/* will be implemented in https://issues.folio.org/browse/UIDATIMP-207 */}
          </div>
        </Accordion>
        {isEditMode || (
          <Accordion
            id="actionProfileFormAssociatedMappingProfileAccordion"
            label={<FormattedMessage id="ui-data-import.settings.actionProfiles.associatedMappingProfile" />}
            separator={false}
          >
            <div>
              {/* will be implemented in https://issues.folio.org/browse/UIDATIMP-208 */}
            </div>
          </Accordion>
        )}
      </AccordionSet>
      <ConfirmationModal
        id="confirm-edit-action-profile-modal"
        open={isConfirmEditModalOpen}
        heading={<FormattedMessage id="ui-data-import.settings.actionProfiles.confirmEditModal.heading" />}
        message={(
          <FormattedMessage
            id="ui-data-import.settings.actionProfiles.confirmEditModal.message"
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
};

ActionProfilesFormComponent.propTypes = {
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

export const ActionProfilesForm = compose(
  stripesForm({
    form: formName,
    navigationCheck: true,
    enableReinitialize: true,
  }),
  connect(mapStateToProps),
)(ActionProfilesFormComponent);
