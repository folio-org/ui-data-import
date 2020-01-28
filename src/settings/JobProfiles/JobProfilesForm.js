import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  get,
  identity,
} from 'lodash';

import {
  Headline,
  TextArea,
  TextField,
  Select,
  Accordion,
  AccordionSet,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import {
  DATA_TYPES,
  PROFILE_LINKING_RULES,
} from '../../utils/constants';
import {
  compose,
  validateRequiredField,
  withProfileWrapper,
} from '../../utils';
import {
  FullScreenForm,
  ProfileTree,
} from '../../components';

// @TODO: Remove this during backend unmocking task implementation
import { snapshotWrappers } from '../../../test/bigtest/mocks';

const formName = 'jobProfilesForm';
const dataTypes = DATA_TYPES.map(dataType => ({
  value: dataType,
  label: dataType,
}));

export const JobProfilesFormComponent = ({
  pristine,
  submitting,
  initialValues,
  handleSubmit,
  onCancel,
}) => {
  const { profile } = initialValues;
  const isEditMode = Boolean(profile.id);
  const isSubmitDisabled = pristine || submitting;
  // @TODO: Remove this during backend unmocking task implementation
  const currentWrapper = snapshotWrappers.find(item => item.id === profile.id);

  const paneTitle = isEditMode ? (
    <FormattedMessage id="ui-data-import.edit">
      {txt => `${txt} ${profile.name}`}
    </FormattedMessage>
  ) : <FormattedMessage id="ui-data-import.settings.jobProfiles.new" />;
  const headLine = isEditMode ? profile.name : <FormattedMessage id="ui-data-import.settings.jobProfiles.new" />;

  return (
    <FullScreenForm
      id="job-profiles-form"
      paneTitle={paneTitle}
      submitMessage={<FormattedMessage id="ui-data-import.saveAsProfile" />}
      isSubmitDisabled={isSubmitDisabled}
      onSubmit={handleSubmit}
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
          id="job-profile-summary"
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
          <div data-test-accepted-data-types-field>
            <FormattedMessage id="ui-data-import.settings.jobProfiles.chooseAcceptedDataType">
              {placeholder => (
                <Field
                  label={<FormattedMessage id="ui-data-import.settings.jobProfiles.acceptedDataType" />}
                  name="profile.dataType"
                  component={Select}
                  required
                  itemToString={identity}
                  validate={[validateRequiredField]}
                  dataOptions={dataTypes}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
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
          id="job-profile-overview"
          label={<FormattedMessage id="ui-data-import.settings.jobProfiles.overview" />}
          separator={false}
        >
          <ProfileTree
            linkingRules={PROFILE_LINKING_RULES}
            contentData={get(currentWrapper, 'childSnapshotWrappers', [])}
          />
        </Accordion>
      </AccordionSet>
    </FullScreenForm>
  );
};

JobProfilesFormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export const JobProfilesForm = compose(
  withProfileWrapper,
  stripesForm({
    form: formName,
    navigationCheck: true,
    enableReinitialize: true,
  }),
)(JobProfilesFormComponent);
