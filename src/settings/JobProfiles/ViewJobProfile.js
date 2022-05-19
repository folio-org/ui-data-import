import React, {
  useState,
  useRef,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Pane,
  Headline,
  KeyValue,
  NoValue,
  Accordion,
  AccordionSet,
  MultiColumnList,
  ConfirmationModal,
  Callout,
  PaneHeader,
  AccordionStatus,
} from '@folio/stripes/components';
import {
  withTags,
  ViewMetaData,
  TagsAccordion,
} from '@folio/stripes/smart-components';
import {
  EndOfItem,
  Preloader,
  createUrl,
} from '@folio/stripes-data-transfer-components';
import {
  AppIcon,
  TitleManager,
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import {
  UploadingJobsContext,
  listTemplate,
  DetailsKeyShortcutsWrapper,
  ActionMenu,
  Spinner,
  ProfileTree,
} from '../../components';

import {
  ENTITY_KEYS,
  PROFILE_TYPES,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
  PROFILE_LINKING_RULES,
  loadRecords,
  getEntity,
  getEntityTags,
  compose,
  createUrlFromArray,
  FILE_STATUSES,
  showActionMenu,
} from '../../utils';

import sharedCss from '../../shared.css';

const {
  COMMITTED,
  ERROR,
} = FILE_STATUSES;

const ViewJobProfileComponent = props => {
  const {
    resources,
    resources: { childWrappers },
    stripes,
    stripes: { okapi },
    history,
    tagsEnabled,
    location,
    onDelete,
    onClose,
    actionMenuItems,
    accordionStatusRef,
  } = props;

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showRunConfirmation, setShowRunConfirmation] = useState(false);
  const [isDeletionInProgress, setDeletionInProgress] = useState(false);
  const [isRecordsLoadingInProgress, setRecordsLoadingInProgress] = useState(false);

  const calloutRef = useRef(null);
  const { uploadDefinition } = useContext(UploadingJobsContext);

  const jobProfileData = () => {
    const jobProfile = resources.jobProfile || {};
    const [record] = jobProfile.records || [];

    return {
      record,
      hasLoaded: jobProfile.hasLoaded,
    };
  };

  const getChildWrappers = () => ({
    id: get(childWrappers, ['records', '0', 'id'], null),
    wrappers: get(childWrappers, ['records', '0', 'childSnapshotWrappers'], []),
    hasLoaded: get(childWrappers, ['hasLoaded'], false),
  });

  const getJobsUsingThisProfileData = () => {
    const jobsUsingThisProfile = resources.jobsUsingThisProfile || {};
    const [{ jobExecutions } = {}] = jobsUsingThisProfile.records || [];

    return {
      hasLoaded: jobsUsingThisProfile.hasLoaded,
      jobExecutions,
    };
  };

  const hideDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setDeletionInProgress(false);
  };

  const hideRunConfirmation = () => {
    setShowRunConfirmation(false);
    setRecordsLoadingInProgress(false);
  };

  const handleDelete = async record => {
    if (isDeletionInProgress) {
      return;
    }

    setDeletionInProgress(true);

    await onDelete(record);
    hideDeleteConfirmation();
  };

  const handleLoadRecords = async record => {
    const jobProfileInfo = {
      id: record.id,
      name: record.name,
      dataType: record.dataType,
    };

    try {
      await loadRecords({
        okapi,
        uploadDefinitionId: uploadDefinition.id,
        jobProfileInfo,
        defaultMapping: false,
      });

      history.push('/data-import');
    } catch (error) {
      hideRunConfirmation();
      calloutRef.current.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-data-import.communicationProblem" />,
      });

      setRecordsLoadingInProgress(false);
      console.error(error); // eslint-disable-line no-console
    }
  };

  const handleRun = async record => {
    if (isRecordsLoadingInProgress) {
      return;
    }

    await handleLoadRecords(record);
  };

  const renderActionMenu = menu => {
    const { record } = jobProfileData();

    return (
      <ActionMenu
        entity={{
          props,
          showRunConfirmation: () => setShowRunConfirmation(true),
          showDeleteConfirmation: () => setShowDeleteConfirmation(true),
        }}
        menu={menu}
        recordId={record?.id}
      />
    );
  };

  const renderPaneHeader = renderProps => {
    const { record } = jobProfileData();

    const actionMenu = Array.isArray(actionMenuItems) && !!actionMenuItems.length
      ? renderActionMenu
      : null;

    const paneTitle = (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="jobProfiles"
      >
        {record.name}
      </AppIcon>
    );

    return (
      <PaneHeader
        {...renderProps}
        paneTitle={paneTitle}
        paneSub={<FormattedMessage id="ui-data-import.jobProfileName" />}
        actionMenu={showActionMenu({
          renderer: actionMenu,
          stripes
        })}
        dismissible
        onClose={onClose}
      />
    );
  };

  const setRecordMetadata = record => {
    /** JobProfiles sample data does not contain user Ids because of back-end limitations
     * and therefore it is required to add it manually on UI side
     * @TODO: use real IDs when sample data will be removed (remove the block of code below)
     */
    const userId = get(okapi, ['currentUser', 'id'], '');

    record.metadata = {
      ...record.metadata,
      createdByUserId: record.metadata.createdByUserId || userId,
      updatedByUserId: record.metadata.updatedByUserId || userId,
    };
  };

  const {
    hasLoaded,
    record: jobProfileRecord,
  } = jobProfileData();
  const {
    wrappers,
    hasLoaded: wrappersLoaded,
  } = getChildWrappers();
  const {
    hasLoaded: jobsUsingThisProfileDataHasLoaded,
    jobExecutions: jobsUsingThisProfileData,
  } = getJobsUsingThisProfileData();

  if (!jobProfileRecord || !hasLoaded) {
    return (
      <Spinner
        data-test-pane-job-profile-details
        entity={{ props }}
      />
    );
  }

  setRecordMetadata(jobProfileRecord);

  const jobsUsingThisProfileFormatter = listTemplate({});
  const tagsEntityLink = `data-import-profiles/jobProfiles/${jobProfileRecord.id}`;

  return (
    <DetailsKeyShortcutsWrapper
      history={history}
      location={location}
      recordId={jobProfileRecord.id}
    >
      <Pane
        data-test-pane-job-profile-details
        defaultWidth="fill"
        fluidContentWidth
        renderHeader={renderPaneHeader}
        id="view-job-profile-pane"
      >
        <TitleManager record={jobProfileRecord.name} />
        <Headline
          data-test-headline
          size="xx-large"
          tag="h2"
        >
          {jobProfileRecord.name}
        </Headline>
        <AccordionStatus ref={accordionStatusRef}>
          <AccordionSet>
            <Accordion label={<FormattedMessage id="ui-data-import.summary" />}>
              <ViewMetaData
                metadata={jobProfileRecord.metadata}
                systemId={SYSTEM_USER_ID}
                systemUser={SYSTEM_USER_NAME}
              />
              <KeyValue label={<FormattedMessage id="ui-data-import.settings.jobProfiles.acceptedDataType" />}>
                <div data-test-accepted-data-type>{jobProfileRecord.dataType}</div>
              </KeyValue>
              <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
                <div data-test-description>{jobProfileRecord.description || <NoValue />}</div>
              </KeyValue>
            </Accordion>
            {tagsEnabled && (
              <div data-test-tags-accordion>
                <TagsAccordion
                  link={tagsEntityLink}
                  getEntity={getEntity}
                  getEntityTags={getEntityTags}
                  entityTagsPath="profile.tags"
                />
              </div>
            )}
            <div data-test-job-profile-overview-details>
              <Accordion
                label={<FormattedMessage id="ui-data-import.settings.jobProfiles.overview" />}
              >
                {wrappersLoaded ? (
                  <ProfileTree
                    linkingRules={PROFILE_LINKING_RULES}
                    contentData={wrappers}
                    record={jobProfileRecord}
                    resources={resources}
                    okapi={okapi}
                    showLabelsAsHotLink
                  />
                ) : (
                  <Preloader
                    message={<FormattedMessage id="ui-data-import.loading" />}
                    size="medium"
                    preloaderClassName={sharedCss.preloader}
                  />
                )}
              </Accordion>
            </div>
            <Accordion label={<FormattedMessage id="ui-data-import.settings.jobProfiles.jobsUsingThisProfile" />}>
              {jobsUsingThisProfileDataHasLoaded ? (
                <MultiColumnList
                  id="jobs-using-this-profile"
                  columnIdPrefix="jobs-using-this-profile"
                  totalCount={jobsUsingThisProfileData.length}
                  contentData={jobsUsingThisProfileData}
                  columnMapping={{
                    fileName: <FormattedMessage id="ui-data-import.fileName" />,
                    hrId: <FormattedMessage id="ui-data-import.settings.jobProfiles.jobID" />,
                    completedDate: <FormattedMessage id="ui-data-import.jobCompletedDate" />,
                    runBy: <FormattedMessage id="ui-data-import.runBy" />,
                  }}
                  visibleColumns={[
                    'fileName',
                    'hrId',
                    'completedDate',
                    'runBy',
                  ]}
                  formatter={jobsUsingThisProfileFormatter}
                  width="100%"
                />
              ) : (
                <Preloader
                  message={<FormattedMessage id="ui-data-import.loading" />}
                  size="medium"
                  preloaderClassName={sharedCss.preloader}
                />
              )}
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
        <EndOfItem
          className={sharedCss.endOfRecord}
          title={<FormattedMessage id="ui-data-import.endOfRecord" />}
        />
        <ConfirmationModal
          id="delete-job-profile-modal"
          open={showDeleteConfirmation}
          heading={(
            <FormattedMessage
              id="ui-data-import.modal.jobProfile.delete.header"
              values={{ name: jobProfileRecord.name }}
            />
          )}
          message={<FormattedMessage id="ui-data-import.modal.jobProfile.delete.message" />}
          confirmLabel={<FormattedMessage id="ui-data-import.delete" />}
          cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
          onConfirm={() => handleDelete(jobProfileRecord)}
          onCancel={hideDeleteConfirmation}
        />
        <ConfirmationModal
          id="run-job-profile-modal"
          open={showRunConfirmation}
          heading={<FormattedMessage id="ui-data-import.modal.jobProfile.run.header" />}
          message={(
            <FormattedMessage
              id="ui-data-import.modal.jobProfile.run.message"
              values={{ name: jobProfileRecord.name }}
            />
          )}
          confirmLabel={<FormattedMessage id="ui-data-import.run" />}
          onCancel={() => setShowRunConfirmation(false)}
          onConfirm={() => handleRun(jobProfileRecord)}
        />
        <Callout ref={calloutRef} />
      </Pane>
    </DetailsKeyShortcutsWrapper>
  );
};

ViewJobProfileComponent.manifest = Object.freeze({
  jobProfile: {
    type: 'okapi',
    path: 'data-import-profiles/jobProfiles/:{id}',
    throwErrors: false,

    // Next two parameters added as a workaround to fix UIDATIMP-424,
    // but it's not optimal from network side and produces extra GET requests.
    // Should be checked and reworked in the future

    // should resource be refreshed again on mount
    resourceShouldRefresh: true,
    // should resource be refreshed on POST/PUT/DELETE mutation
    shouldRefresh: () => false,
  },
  childWrappers: {
    type: 'okapi',
    path: createUrl('data-import-profiles/profileSnapshots/:{id}', {
      profileType: PROFILE_TYPES.JOB_PROFILE,
      jobProfileId: ':{id}',
    }, false),
    throwErrors: false,
    resourceShouldRefresh: true,
    shouldRefresh: () => false,
  },
  jobsUsingThisProfile: {
    type: 'okapi',
    path: (_q, _p) => {
      const { id } = _p;

      return createUrlFromArray('metadata-provider/jobExecutions', [
        `statusAny=${COMMITTED}`,
        `statusAny=${ERROR}`,
        `profileIdAny=${id}`,
        'limit=25',
        'sortBy=completed_date,desc',
      ]);
    },
    throwErrors: false,
  },
});
ViewJobProfileComponent.propTypes = {
  stripes: stripesShape.isRequired,
  history: PropTypes.shape({
    block: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.oneOfType([
    PropTypes.shape({
      search: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.string.isRequired,
  ]).isRequired,
  resources: PropTypes.shape({
    jobProfile: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          dataType: PropTypes.string.isRequired,
          metadata: PropTypes.shape({
            createdByUserId: PropTypes.string.isRequired,
            updatedByUserId: PropTypes.string.isRequired,
          }).isRequired,
          description: PropTypes.string,
        }),
      ),
    }),
    childWrappers: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
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
          description: PropTypes.string,
        }),
      ),
    }),
    jobsUsingThisProfile: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          dataType: PropTypes.string,
          metadata: PropTypes.shape({
            createdByUserId: PropTypes.string,
            updatedByUserId: PropTypes.string,
          }),
          description: PropTypes.string,
        }),
      ),
    }),
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ // eslint-disable-line object-curly-newline
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  tagsEnabled: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  ENTITY_KEY: PropTypes.string, // eslint-disable-line
  actionMenuItems: PropTypes.arrayOf(PropTypes.string), // eslint-disable-line
  accordionStatusRef: PropTypes.object,
};
ViewJobProfileComponent.defaultProps = {
  ENTITY_KEY: ENTITY_KEYS.JOB_PROFILES,
  actionMenuItems: [
    'edit',
    'duplicate',
    'delete',
  ],
};

export const ViewJobProfile = compose(
  stripesConnect,
  withTags,
)(ViewJobProfileComponent);
