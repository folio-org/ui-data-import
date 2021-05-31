import React, {
  memo,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { connect } from 'react-redux';
import {
  identity,
  get,
  isEqual,
} from 'lodash';

import {
  Headline,
  TextArea,
  TextField,
  Select,
  Accordion,
  AccordionSet,
  AccordionStatus,
} from '@folio/stripes/components';
import { FullScreenForm } from '@folio/stripes-data-transfer-components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  EditKeyShortcutsWrapper,
  ProfileTree,
} from '../../components';

import {
  compose,
  validateRequiredField,
  withProfileWrapper,
  DATA_TYPES,
  PROFILE_LINKING_RULES,
  isFieldPristine,
} from '../../utils';

export const JobProfilesFormComponent = memo(({
  pristine,
  submitting,
  initialValues,
  childWrappers,
  handleSubmit,
  form,
  onCancel,
  stripes,
  parentResources,
  transitionToParams,
  match: { path },
  accordionStatusRef,
}) => {
  const { okapi } = stripes;
  const { profile } = initialValues;
  const isEditMode = Boolean(profile.id);
  const isSubmitDisabled = pristine || submitting;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const profileTreeData = useMemo(() => (isEditMode ? childWrappers : []), [isEditMode]);

  const addedRelations = form.getState().values.addedRelations;
  const deletedRelations = form.getState().values.deletedRelations;

  const addRelations = relations => {
    form.change('addedRelations', relations);
  };

  const deleteRelations = relations => {
    form.change('deletedRelations', relations);
  };

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
  const onSubmit = async event => {
    const record = await handleSubmit(event);

    if (record) {
      clearStorage();

      form.reset();
      transitionToParams({
        _path: `${path}/view/${record.id}`,
        layer: null,
      });
    }
  };

  return (
    <EditKeyShortcutsWrapper onSubmit={onSubmit}>
      <FullScreenForm
        id="job-profiles-form"
        paneTitle={paneTitle}
        submitButtonText={<FormattedMessage id="ui-data-import.saveAsProfile" />}
        cancelButtonText={<FormattedMessage id="ui-data-import.close" />}
        isSubmitButtonDisabled={isSubmitDisabled}
        onSubmit={onSubmit}
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
        <AccordionStatus ref={accordionStatusRef}>
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
                  validate={validateRequiredField}
                  isEqual={isFieldPristine}
                />
              </div>
              <div data-test-accepted-data-types-field>
                <FormattedMessage id="ui-data-import.settings.jobProfiles.chooseAcceptedDataType">
                  {([placeholder]) => (
                    <Field
                      label={<FormattedMessage id="ui-data-import.settings.jobProfiles.acceptedDataType" />}
                      name="profile.dataType"
                      component={Select}
                      required
                      itemToString={identity}
                      validate={validateRequiredField}
                      dataOptions={DATA_TYPES}
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
                  isEqual={isFieldPristine}
                />
              </div>
            </Accordion>
            <div data-test-job-profile-overview>
              <Accordion
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
                  onLink={addRelations}
                  onUnlink={deleteRelations}
                  okapi={okapi}
                  resources={parentResources}
                />
                <Field
                  name="addedRelations"
                  component={() => null}
                />
                <Field
                  name="deletedRelations"
                  component={() => null}
                />
              </Accordion>
            </div>
          </AccordionSet>
        </AccordionStatus>
      </FullScreenForm>
    </EditKeyShortcutsWrapper>
  );
});

JobProfilesFormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.shape({
    change: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  stripes: PropTypes.object.isRequired,
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
    }),
  ).isRequired,
  parentResources: PropTypes.object.isRequired,
  transitionToParams: PropTypes.func.isRequired,
  match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  accordionStatusRef: PropTypes.object,
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
  stripesFinalForm({
    navigationCheck: true,
    initialValuesEqual: isEqual,
  }),
  connect(mapStateToProps),
)(JobProfilesFormComponent);
