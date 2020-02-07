import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  change,
} from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  identity,
  get,
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

const formName = 'jobProfilesForm';
const dataTypes = DATA_TYPES.map(dataType => ({
  value: dataType,
  label: dataType,
}));

export const JobProfilesFormComponent = ({
  pristine,
  submitting,
  initialValues,
  childWrappers,
  handleSubmit,
  onCancel,
  dispatch,
}) => {
  const { profile } = initialValues;
  const isEditMode = Boolean(profile.id);
  const isSubmitDisabled = pristine || submitting;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const profileTreeData = useMemo(() => (isEditMode ? childWrappers : []), [isEditMode]);
  const [addedRelations, setAddedRelations] = useState([]);
  const [deletedRelations, setDeletedRelations] = useState([]);

  useEffect(() => {
    dispatch(change(formName, 'addedRelations', addedRelations));
  }, [addedRelations]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(change(formName, 'deletedRelations', deletedRelations));
  }, [deletedRelations]); // eslint-disable-line react-hooks/exhaustive-deps

  const paneTitle = isEditMode ? (
    <FormattedMessage id="ui-data-import.edit">
      {txt => `${txt} ${profile.name}`}
    </FormattedMessage>
  ) : <FormattedMessage id="ui-data-import.settings.jobProfiles.new" />;
  const headLine = isEditMode ? profile.name : <FormattedMessage id="ui-data-import.settings.jobProfiles.new" />;
  const clearStorage = () => {
    let n = sessionStorage.length;

    while (n--) {
      const key = sessionStorage.key(n);

      if (/^jobProfiles\.current\.*/.test(key)) {
        sessionStorage.removeItem(key);
      }
    }
  };

  return (
    <FullScreenForm
      id="job-profiles-form"
      paneTitle={paneTitle}
      submitMessage={<FormattedMessage id="ui-data-import.saveAsProfile" />}
      isSubmitDisabled={isSubmitDisabled}
      onSubmit={record => {
        clearStorage();
        handleSubmit(record);
      }}
      onCancel={() => {
        clearStorage();
        onCancel();
      }}
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
            parentId={profile.id}
            linkingRules={PROFILE_LINKING_RULES}
            contentData={profileTreeData}
            hasLoaded
            relationsToAdd={addedRelations}
            relationsToDelete={deletedRelations}
            onLink={setAddedRelations}
            onUnlink={setDeletedRelations}
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
  dispatch: PropTypes.func.isRequired,
  childWrappers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      profileId: PropTypes.string.isRequired,
      contentType: PropTypes.string.isRequired,
      content: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        tags: PropTypes.shape({ tagList: PropTypes.arrayOf(PropTypes.string) }),
        match: PropTypes.string,
      }),
    })
  ).isRequired,
};

const mapStateToProps = state => {
  const childWrappers = get(
    state,
    ['folio_data_import_child_wrappers', 'records', 0, 'childSnapshotWrappers'],
    [],
  );

  return { childWrappers };
};

export const JobProfilesForm = compose(
  withProfileWrapper,
  stripesForm({
    form: formName,
    navigationCheck: true,
    enableReinitialize: true,
  }),
  connect(mapStateToProps)
)(JobProfilesFormComponent);
