import React, {
  useState,
  useRef,
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  flow,
  get,
} from 'lodash';

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
  Icon,
  SRStatus
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
  listTemplate,
} from '@folio/stripes-data-transfer-components';
import {
  AppIcon,
  TitleManager,
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import {
  UploadingJobsContext,
  DetailsKeyShortcutsWrapper,
  ActionMenu,
  Spinner,
  ProfileTree,
} from '../../../components';

import { NoJobProfilePane } from './NoJobProfilePane';

import {
  ENTITY_KEYS,
  PROFILE_TYPES,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
  PROFILE_LINKING_RULES,
  loadRecords,
  getEntity,
  getEntityTags,
  createUrlFromArray,
  FILE_STATUSES,
  showActionMenu,
  permissions,
  BASE_URLS,
  fileNameCellFormatter,
  STATUS_CODES,
  requestConfiguration,
} from '../../../utils';

import RunJobModal from './RunJobModal';

import sharedCss from '../../../shared.css';

const {
  COMMITTED,
  ERROR,
} = FILE_STATUSES;

export function getAssociatedJobsURL(resources, splittingURL, nonSplitting) {
  const { splitStatus } = resources;
  if (!splitStatus?.isPending) {
    if (splitStatus?.records[0]?.splitStatus) {
      return splittingURL;
    } else if (splitStatus?.records[0]?.splitStatus === false) {
      return nonSplitting;
    }
  }
  return undefined;
}

const jobPartsCellFormatter = record => (
  <FormattedMessage
    id="ui-data-import.logViewer.partOfTotal"
    values={{
      number: record.jobPartNumber,
      total: record.totalJobParts
    }}
  />
);

const DEFAULT_ACTION_ITEMS = [
  'edit',
  'duplicate',
  'delete',
];

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
    actionMenuItems = DEFAULT_ACTION_ITEMS,
    accordionStatusRef,
  } = props;

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showRunConfirmation, setShowRunConfirmation] = useState(false);
  const [isDeletionInProgress, setDeletionInProgress] = useState(false);
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(false);

  const calloutRef = useRef(null);
  const sRStatusRef = useRef(null);
  const { uploadDefinition, uploadConfiguration } = useContext(UploadingJobsContext);
  const { formatMessage } = useIntl();
  const objectStorageConfiguration = uploadConfiguration?.canUseObjectStorage;
  const visibleColumns = useMemo(() => {
    const defaultVisibleColumns = [
      'fileName',
      'hrId',
      'completedDate',
      'runBy',
    ];
    if (objectStorageConfiguration) {
      const columns = [...defaultVisibleColumns];
      columns.splice(2, 0, 'jobParts');
      return columns;
    }
    return defaultVisibleColumns;
  }, [objectStorageConfiguration]);

  const jobProfileData = () => {
    const jobProfile = resources.jobProfileView || {};
    const [record] = jobProfile.records || [];
    const { failed: { httpStatus: statusCode } } = jobProfile;

    return {
      record,
      hasLoaded: jobProfile.hasLoaded,
      statusCode,
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
      setProcessingRequest(false);
      setIsConfirmButtonDisabled(false);
      hideRunConfirmation();

      const isUploadDefinitionError = error.status === STATUS_CODES.NOT_FOUND || error.status === STATUS_CODES.UNPROCESSABLE_ENTITY;

      calloutRef.current.sendCallout({
        type: 'error',
        message: <FormattedMessage id={`ui-data-import.${isUploadDefinitionError ? 'uploadDefinitionError' : 'communicationProblem'}`} />,
      });

      console.error(error); // eslint-disable-line no-console
    }
  };

  const handleRun = async record => {
    setIsConfirmButtonDisabled(true);
    setProcessingRequest(true);
    sRStatusRef.current?.sendMessage(formatMessage({ id: 'ui-data-import.processing' }));
    await handleLoadRecords(record);
  };

  const renderActionMenu = menu => {
    const { record } = jobProfileData();

    return (
      <ActionMenu
        entity={{
          props: {
            ...props,
            actionMenuItems,
            ENTITY_KEY: ENTITY_KEYS.JOB_PROFILES,
          },
          showRunConfirmation: () => setShowRunConfirmation(true),
          showDeleteConfirmation: () => setShowDeleteConfirmation(true),
        }}
        menu={menu}
        recordId={record?.id}
        baseUrl={BASE_URLS.JOB_PROFILE}
      />
    );
  };

  const renderPaneHeader = renderProps => {
    const { record } = jobProfileData();
    const { pathname } = location;
    const {
      SETTINGS_MANAGE,
      DATA_IMPORT_MANAGE,
    } = permissions;

    const actionMenu = Array.isArray(actionMenuItems) && !!actionMenuItems.length
      ? renderActionMenu
      : null;
    const perm = pathname.startsWith('/settings') ? SETTINGS_MANAGE : DATA_IMPORT_MANAGE;

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
          stripes,
          perm,
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
    statusCode,
  } = jobProfileData();
  const {
    wrappers,
    hasLoaded: wrappersLoaded,
  } = getChildWrappers();
  const {
    hasLoaded: jobsUsingThisProfileDataHasLoaded,
    jobExecutions: jobsUsingThisProfileData,
  } = getJobsUsingThisProfileData();

  if (statusCode === STATUS_CODES.NOT_FOUND) {
    return (
      <NoJobProfilePane
        onClose={onClose}
        history={history}
      />
    );
  }

  if (!jobProfileRecord || !hasLoaded) {
    return (
      <Spinner
        data-test-pane-job-profile-details
        entity={{ props }}
      />
    );
  }

  setRecordMetadata(jobProfileRecord);

  const jobsUsingThisProfileFormatter = {
    ...listTemplate({}),
    fileName: record => fileNameCellFormatter(record, location),
    jobParts: jobPartsCellFormatter
  };
  const tagsEntityLink = `data-import-profiles/jobProfiles/${jobProfileRecord.id}`;
  const isSettingsEnabled = stripes.hasPerm(permissions.SETTINGS_MANAGE) || stripes.hasPerm(permissions.SETTINGS_VIEW_ONLY);

  return (
    <DetailsKeyShortcutsWrapper
      history={history}
      location={location}
      recordId={jobProfileRecord.id}
      baseUrl={BASE_URLS.JOB_PROFILE}
    >
      <Pane
        data-test-pane-job-profile-details
        defaultWidth="fill"
        fluidContentWidth
        renderHeader={renderPaneHeader}
        id="view-job-profile-pane"
      >
        <TitleManager
          prefix={`${formatMessage({ id: 'ui-data-import.settings.dataImport.title' })} - `}
          page={formatMessage({ id: 'ui-data-import.settings.jobProfiles.title' })}
          record={jobProfileRecord?.name}
        />
        <Headline
          className={sharedCss.headline}
          data-test-headline
          size="xx-large"
          tag="h2"
        >
          {jobProfileRecord.name}
        </Headline>
        <SRStatus ref={sRStatusRef} />
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
            {(tagsEnabled && isSettingsEnabled) && (
              <div data-test-tags-accordion>
                <TagsAccordion
                  link={tagsEntityLink}
                  getEntity={getEntity}
                  getEntityTags={getEntityTags}
                  entityTagsPath="profile.tags"
                />
              </div>
            )}
            {isSettingsEnabled && (
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
            )}
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
                    jobParts: <FormattedMessage id="ui-data-import.jobParts" />
                  }}
                  visibleColumns={visibleColumns}
                  formatter={jobsUsingThisProfileFormatter}
                  nonInteractiveHeaders={['jobParts']}
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
        <RunJobModal
          id="run-job-profile-modal"
          open={showRunConfirmation}
          heading={<FormattedMessage id="ui-data-import.modal.jobProfile.run.header" />}
          message={(
            <>
              <FormattedMessage
                id="ui-data-import.modal.jobProfile.run.message"
                values={{ name: jobProfileRecord.name }}
              />
              { uploadConfiguration?.canUseObjectStorage && (
                <>
                  &nbsp;
                  <FormattedMessage
                    id="ui-data-import.modal.jobProfile.run.largeFileSplitting"
                  />
                </>
              )}
            </>
          )}
          confirmLabel={processingRequest ? (
            <Icon icon="spinner-ellipsis">
              <span className="sr-only"><FormattedMessage id="ui-data-import.processing" /></span>
            </Icon>) :
            <FormattedMessage id="ui-data-import.run" />}
          onCancel={() => setShowRunConfirmation(false)}
          onConfirm={() => handleRun(jobProfileRecord)}
          isConfirmButtonDisabled={isConfirmButtonDisabled}
          isCancelButtonDisabled={processingRequest}
        />
        <Callout ref={calloutRef} />
      </Pane>
    </DetailsKeyShortcutsWrapper>
  );
};

ViewJobProfileComponent.manifest = Object.freeze({
  jobProfileView: {
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
    path: (_q, _p, _l, _log, _props) => {
      const { id } = _p;

      const commonQueryParams = [
        `statusAny=${COMMITTED}`,
        `statusAny=${ERROR}`,
        `profileIdAny=${id}`,
        'limit=25',
        'sortBy=completed_date,desc',
      ];

      const nonSplittingJobsURL = createUrlFromArray('metadata-provider/jobExecutions', commonQueryParams);
      const splittingJobsURL = createUrlFromArray('metadata-provider/jobExecutions', [...commonQueryParams,
        'subordinationTypeNotAny=COMPOSITE_PARENT'
      ]);

      return getAssociatedJobsURL(_props.resources, splittingJobsURL, nonSplittingJobsURL);
    },
    throwErrors: false,
  },
  splitStatus: {
    type: 'okapi',
    path: requestConfiguration,
    shouldRefreshRemote: () => false,
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
    jobProfileView: PropTypes.shape({
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
      failed: PropTypes.shape({ httpStatus: PropTypes.number }),
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

export const ViewJobProfile = flow([
  () => withTags(ViewJobProfileComponent),
  stripesConnect,
])();
