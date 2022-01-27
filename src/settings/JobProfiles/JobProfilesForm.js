import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { connect } from 'react-redux';
import {
  identity,
  get,
  isEqual,
  isEmpty,
} from 'lodash';

import {
  Headline,
  TextArea,
  TextField,
  Select,
  Accordion,
  AccordionSet,
  AccordionStatus,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  createOkapiHeaders,
  createUrl,
  FullScreenForm,
} from '@folio/stripes-data-transfer-components';
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
  ASSOCIATION_TYPES,
  PROFILE_TYPES,
  LAYER_TYPES,
  isFieldPristine,
} from '../../utils';

const dataTypes = DATA_TYPES.map(dataType => ({
  value: dataType,
  label: dataType,
}));

export const fetchAssociations = async (okapi, profileId) => {
  const { url } = okapi;
  const baseUrl = `${url}/data-import-profiles/profileAssociations/${profileId}/details`;

  const response = await fetch(
    createUrl(baseUrl, { masterType: ASSOCIATION_TYPES.actionProfiles }, false),
    { headers: { ...createOkapiHeaders(okapi) } },
  );
  const body = await response.json();

  return get(body, 'childSnapshotWrappers', []);
};

const getFlattenProfileTreeContent = function buildData(array) {
  return array.reduce((acc, item) => {
    if (item.childSnapshotWrappers.length) {
      const children = buildData(item.childSnapshotWrappers);

      return [...acc, item, ...children];
    }

    return [...acc, item];
  }, []);
};

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
  layerType,
}) => {
  const { okapi } = stripes;
  const { profile } = initialValues;
  const isEditMode = Boolean(profile.id);
  const isLayerCreate = layerType === LAYER_TYPES.CREATE;
  const isSubmitDisabled = pristine || submitting;
  const dataKey = 'jobProfiles.current';
  const profileTreeKey = 'profileTreeData';

  const [isModalOpen, showModal] = useState(false);
  const [profileTreeData, setProfileTreeData] = useState([]);

  useEffect(() => {
    const contentData = !isLayerCreate ? childWrappers : [];
    const getData = JSON.parse(sessionStorage.getItem(dataKey)) || contentData;

    setProfileTreeData(getData);
  }, [isLayerCreate, childWrappers]);

  useEffect(() => {
    const profileTreeContent = getFlattenProfileTreeContent(childWrappers)
      .filter(item => item.contentType === PROFILE_TYPES.ACTION_PROFILE || item.contentType === PROFILE_TYPES.MATCH_PROFILE);

    sessionStorage.setItem(profileTreeKey, JSON.stringify(profileTreeContent));
  }, [childWrappers]);

  useEffect(() => {
    if (layerType === LAYER_TYPES.DUPLICATE && !isEmpty(childWrappers)) {
      const relsToInitialize = [...childWrappers];

      const composeRelations = (masterProfileId, masterProfileType) => (accumulator, currentValue) => {
        const {
          contentType,
          profileId,
          order,
          reactTo,
          childSnapshotWrappers,
        } = currentValue;

        if (contentType === PROFILE_TYPES.MAPPING_PROFILE) return accumulator;

        const rel = {
          masterProfileId,
          masterProfileType,
          detailProfileId: profileId,
          detailProfileType: contentType,
          order,
          ...(reactTo && { reactTo }),
        };

        accumulator.push(rel);

        if (!isEmpty(childSnapshotWrappers)) {
          return childSnapshotWrappers.reduce(composeRelations(profileId, contentType), accumulator);
        }

        return accumulator;
      };

      form.initialize(values => {
        return {
          ...values,
          addedRelations: relsToInitialize.reduce(composeRelations(null, PROFILE_TYPES.JOB_PROFILE), []),
        };
      });
    }
  }, [childWrappers, layerType]); // eslint-disable-line react-hooks/exhaustive-deps

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
    event.preventDefault();

    const profileTreeContent = JSON.parse(sessionStorage.getItem(profileTreeKey));

    const requests = profileTreeContent
      .filter(record => record.contentType === PROFILE_TYPES.ACTION_PROFILE)
      .map(record => fetchAssociations(okapi, record.profileId));

    const associations = await Promise.all(requests);

    if (associations.some(isEmpty)) {
      showModal(true);
    } else {
      const record = await handleSubmit(event);

      if (record) {
        clearStorage();

        form.reset();
        transitionToParams({
          _path: `${path}/view/${record.id}`,
          layer: null,
        });
      }
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
                  setData={setProfileTreeData}
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
        <ConfirmationModal
          confirmLabel={<FormattedMessage id="ui-data-import.ok" />}
          bodyTag="div"
          heading={<FormattedMessage id="ui-data-import.settings.jobProfile.confirmationModal.heading" />}
          message={<FormattedMessage id="ui-data-import.settings.jobProfile.confirmationModal.body" />}
          onCancel={() => showModal(false)}
          onConfirm={() => showModal(false)}
          open={isModalOpen}
        />
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
    initialize: PropTypes.func.isRequired,
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
  layerType: PropTypes.oneOfType(LAYER_TYPES),
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
