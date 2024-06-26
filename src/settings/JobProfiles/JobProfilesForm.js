import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useSelector,
  useDispatch,
} from 'react-redux';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
import {
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
  TitleManager,
  stripesConnect,
} from '@folio/stripes/core';

import {
  EditKeyShortcutsWrapper,
  ProfileTree,
} from '../../components';

import {
  compose,
  validateRequiredField,
  withProfileWrapper,
  STATE_MANAGEMENT,
  DATA_TYPES,
  PROFILE_LINKING_RULES,
  ASSOCIATION_TYPES,
  PROFILE_TYPES,
  LAYER_TYPES,
  isFieldPristine,
} from '../../utils';
import {
  clearCurrentProfileTreeContent,
  clearProfileTreeContent,
  setProfileTreeContent,
} from '../../redux';

const dataTypes = DATA_TYPES.map(dataType => ({
  value: dataType,
  label: dataType,
}));

export const fetchAssociations = async (okapi, profileId) => {
  const { url } = okapi;
  const baseUrl = `${url}/data-import-profiles/profileAssociations/${profileId}/details`;

  try {
    const response = await fetch(
      createUrl(baseUrl, { masterType: ASSOCIATION_TYPES.actionProfiles }, false),
      { headers: { ...createOkapiHeaders(okapi) } },
    );
    const body = await response.json();

    return get(body, 'childSnapshotWrappers', []);
  } catch (error) {
    return error;
  }
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
  handleSubmit,
  form,
  onCancel,
  stripes,
  parentResources,
  transitionToParams,
  baseUrl,
  accordionStatusRef,
  layerType,
  mutator,
  resources,
}) => {
  const dataKey = 'currentData';
  const profileTreeKey = 'profileTreeData';

  const { okapi } = stripes;
  const { profile } = initialValues;
  const isEditMode = Boolean(profile.id);
  const isLayerCreate = layerType === LAYER_TYPES.CREATE;
  const isLayerDuplicate = layerType === LAYER_TYPES.DUPLICATE;
  const isSubmitDisabled = pristine || submitting;

  const childWrappers = useMemo(
    () => resources.profileSnapshots?.records.at(-1)?.childSnapshotWrappers || [],
    [resources.profileSnapshots.records],
  );
  const profileWrapperId = useMemo(
    () => {
      const lastRecord = resources.profileSnapshots?.records.at(-1);
      return (!isLayerCreate && !isLayerDuplicate && lastRecord) ? lastRecord?.profileWrapperId : null;
    },
    [isLayerCreate, isLayerDuplicate, resources.profileSnapshots.records],
  );

  const { formatMessage } = useIntl();

  const dispatch = useDispatch();
  const isEqualValues = (oldValue, newValue) => isEqual(newValue, oldValue);
  const currentJobProfileTreeContent = useSelector(state => {
    return get(
      state,
      [STATE_MANAGEMENT.REDUCER, dataKey],
      [],
    );
  }, isEqualValues);
  const profileTreeContent = useSelector(state => {
    return get(
      state,
      [STATE_MANAGEMENT.REDUCER, profileTreeKey],
      [],
    );
  }, isEqualValues);

  const [isModalOpen, showModal] = useState(false);
  const [profileTreeData, setProfileTreeData] = useState([]);

  useEffect(() => {
    async function fetchChildWrappers() {
      await mutator.profileSnapshots.GET();
    }

    if (!isLayerCreate) {
      fetchChildWrappers().then();
    }
  }, [isLayerCreate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const flattenTreeContent = getFlattenProfileTreeContent(childWrappers)
      .filter(item => item.contentType === PROFILE_TYPES.ACTION_PROFILE || item.contentType === PROFILE_TYPES.MATCH_PROFILE);

    dispatch(setProfileTreeContent(flattenTreeContent));
  }, [childWrappers]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const removeKeys = (obj, keys) => {
      let index;
      for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
          switch (typeof (obj[prop])) {
            case 'object':
              index = keys.indexOf(prop);
              if (index > -1) {
                delete obj[prop];
              } else {
                removeKeys(obj[prop], keys);
              }
              break;
            default:
              index = keys.indexOf(prop);
              if (index > -1) {
                delete obj[prop];
              }
              break;
          }
        }
      }
    };

    const contentData = !isLayerCreate ? childWrappers : [];
    const treeData = !isEmpty(currentJobProfileTreeContent) ? currentJobProfileTreeContent : contentData;

    // af far as new profileWrapperId should be created for new profiles
    // it is needed to omit these fields during duplication because it copies
    // data from the original job profile
    const massageTreeData = () => (isLayerDuplicate
      ? treeData.forEach(obj => removeKeys(obj, ['profileWrapperId']))
      : treeData);

    massageTreeData();

    setProfileTreeData(treeData);
  }, [isLayerCreate, childWrappers]); // eslint-disable-line react-hooks/exhaustive-deps

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
    dispatch(clearProfileTreeContent());
    dispatch(clearCurrentProfileTreeContent());
  };
  const onSubmit = async event => {
    event.preventDefault();

    const requests = profileTreeContent
      .filter(record => record.contentType === PROFILE_TYPES.ACTION_PROFILE)
      .map(record => fetchAssociations(okapi, record.content.id));

    Promise.all(requests)
      .then(async (associations) => {
        if (associations.some(isEmpty)) {
          showModal(true);
        } else {
          const record = await handleSubmit(event);

          if (record) {
            clearStorage();
            form.reset();
            transitionToParams({ _path: `${baseUrl}/view/${record.id}` });
          }
        }
      })
      .catch(error => {
        return error;
      });
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
        <TitleManager
          prefix={`${formatMessage({ id: 'ui-data-import.settings.dataImport.title' })} - `}
          page={formatMessage({ id: 'ui-data-import.settings.jobProfiles.title' })}
          record={`${formatMessage({ id: `ui-data-import.${layerType}` })} ${profile.name}`}
        />
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
                  profileWrapperId={profileWrapperId}
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

JobProfilesFormComponent.manifest = Object.freeze({
  profileSnapshots: {
    type: 'okapi',
    GET: {
      path: createUrl('data-import-profiles/profileSnapshots/:{id}', {
        profileType: PROFILE_TYPES.JOB_PROFILE,
        jobProfileId: ':{id}',
      }, false),
    },
    accumulate: true,
    throwErrors: false,
    resourceShouldRefresh: true,
    shouldRefresh: () => false,
  },
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
  parentResources: PropTypes.object.isRequired,
  transitionToParams: PropTypes.func.isRequired,
  baseUrl: PropTypes.string.isRequired,
  mutator: PropTypes.shape({ profileSnapshots: PropTypes.shape({ GET: PropTypes.func }) }).isRequired,
  resources: PropTypes.shape({ profileSnapshots: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }) }).isRequired,
  accordionStatusRef: PropTypes.object,
  layerType: PropTypes.oneOf(Object.values(LAYER_TYPES)),
};

export const JobProfilesForm = compose(
  withProfileWrapper,
  stripesFinalForm({
    navigationCheck: true,
    initialValuesEqual: isEqual,
  }),
  stripesConnect,
)(JobProfilesFormComponent);
