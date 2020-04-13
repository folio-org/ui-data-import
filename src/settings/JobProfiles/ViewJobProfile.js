import React, {
  Component,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  intlShape,
  injectIntl,
  FormattedMessage,
} from 'react-intl';
import { get } from 'lodash';

import {
  Pane,
  Headline,
  KeyValue,
  Accordion,
  AccordionSet,
  MultiColumnList,
  ConfirmationModal,
  Callout,
  PaneHeader,
} from '@folio/stripes/components';
import {
  withTags,
  ViewMetaData,
  TagsAccordion,
} from '@folio/stripes/smart-components';
import {
  AppIcon,
  TitleManager,
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import {
  ENTITY_KEYS,
  PROFILE_TYPES,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
  PROFILE_LINKING_RULES,
} from '../../utils/constants';
import { createUrl } from '../../utils';
import { loadRecords } from '../../utils/loadRecords';
import {
  listTemplate,
  ActionMenu,
  EndOfItem,
  Preloader,
  Spinner,
  ProfileTree,
} from '../../components';

import { UploadingJobsContext } from '../../components/UploadingJobsContextProvider';

import sharedCss from '../../shared.css';

@stripesConnect
@injectIntl
@withTags
export class ViewJobProfile extends Component {
  static manifest = Object.freeze({
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
      path: createUrl('data-import-profiles/profileSnapshots/:{id}', { profileType: PROFILE_TYPES.JOB_PROFILE }),
      throwErrors: false,
    },
    jobsUsingThisProfile: {
      type: 'okapi',
      path: createUrl('metadata-provider/jobExecutions', {
        query: '(jobProfileInfo.id==":{id}") sortBy completedDate/sort.descending',
        limit: 25,
      }, false),
      throwErrors: false,
    },
  });

  static propTypes = {
    stripes: stripesShape.isRequired,
    history: PropTypes.shape({
      block: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    intl: intlShape.isRequired,
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
    paneId: PropTypes.string, // eslint-disable-line
    ENTITY_KEY: PropTypes.string, // eslint-disable-line
    actionMenuItems: PropTypes.arrayOf(PropTypes.string), // eslint-disable-line
  };

  static defaultProps = {
    paneId: 'pane-job-profile-details',
    ENTITY_KEY: ENTITY_KEYS.JOB_PROFILES,
    actionMenuItems: [
      'edit',
      'duplicate',
      'delete',
    ],
  };

  static contextType = UploadingJobsContext;

  state = {
    showDeleteConfirmation: false,
    showRunConfirmation: false,
    deletionInProgress: false,
    recordsLoadingInProgress: false,
  };

  calloutRef = createRef();

  get jobProfileData() {
    const { resources } = this.props;

    const jobProfile = resources.jobProfile || {};
    const [record] = jobProfile.records || [];

    return {
      record,
      hasLoaded: jobProfile.hasLoaded,
    };
  }

  get childWrappers() {
    const { resources: { childWrappers } } = this.props;

    return {
      id: get(childWrappers, ['records', '0', 'id'], null),
      wrappers: get(childWrappers, ['records', '0', 'childSnapshotWrappers'], []),
      hasLoaded: get(childWrappers, ['hasLoaded'], false),
    };
  }

  get jobsUsingThisProfileData() {
    const { resources } = this.props;

    const jobsUsingThisProfile = resources.jobsUsingThisProfile || {};
    const [{ jobExecutions: jobsUsingThisProfileData } = {}] = jobsUsingThisProfile.records || [];

    return {
      hasLoaded: jobsUsingThisProfile.hasLoaded,
      jobsUsingThisProfileData,
    };
  }

  showDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: true });
  };

  showRunConfirmation = () => {
    this.setState({ showRunConfirmation: true });
  };

  hideDeleteConfirmation = () => {
    this.setState({
      showDeleteConfirmation: false,
      deletionInProgress: false,
    });
  };

  hideRunConfirmation = () => {
    this.setState({
      showRunConfirmation: false,
      recordsLoadingInProgress: false,
    });
  };

  handleDelete(record) {
    const { onDelete } = this.props;
    const { deletionInProgress } = this.state;

    if (deletionInProgress) {
      return;
    }

    this.setState({ deletionInProgress: true }, async () => {
      await onDelete(record);
      this.hideDeleteConfirmation();
    });
  }

  loadRecords = async record => {
    const {
      stripes: { okapi },
      history,
    } = this.props;
    const { uploadDefinition } = this.context;
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
      this.hideRunConfirmation();
      this.calloutRef.current.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-data-import.communicationProblem" />,
      });

      this.setState({ recordsLoadingInProgress: false });
      console.error(error); // eslint-disable-line no-console
    }
  };

  handleRun(record) {
    const { recordsLoadingInProgress } = this.state;

    if (recordsLoadingInProgress) {
      return;
    }

    this.loadRecords(record);
  }

  renderActionMenu = menu => (
    <ActionMenu
      entity={this}
      menu={menu}
    />
  );

  renderPaneHeader = renderProps => {
    const {
      onClose,
      actionMenuItems,
    } = this.props;

    const { record } = this.jobProfileData;

    const actionMenu = Array.isArray(actionMenuItems) && !!actionMenuItems.length
      ? this.renderActionMenu
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
        actionMenu={actionMenu}
        dismissible
        onClose={onClose}
      />
    );
  };

  render() {
    const {
      intl,
      tagsEnabled,
    } = this.props;

    const {
      hasLoaded,
      record,
    } = this.jobProfileData;

    const {
      wrappers,
      hasLoaded: wrappersLoaded,
    } = this.childWrappers;

    const {
      hasLoaded: jobsUsingThisProfileDataHasLoaded,
      jobsUsingThisProfileData,
    } = this.jobsUsingThisProfileData;

    if (!record || !hasLoaded) {
      return <Spinner entity={this} />;
    }

    /** JobProfiles sample data does not contain user Ids because of back-end limitations
     * and therefore it is required to add it manually on UI side
     * @TODO: use real IDs when sample data will be removed (remove the block of code below)
     */
    {
      const userId = get(this.props, ['stripes', 'okapi', 'currentUser', 'id'], '');

      record.metadata = {
        ...record.metadata,
        createdByUserId: record.metadata.createdByUserId || userId,
        updatedByUserId: record.metadata.updatedByUserId || userId,
      };
    }

    const jobsUsingThisProfileFormatter = listTemplate({ intl });

    const tagsEntityLink = `data-import-profiles/jobProfiles/${record.id}`;

    return (
      <Pane
        id="pane-job-profile-details"
        defaultWidth="fill"
        fluidContentWidth
        renderHeader={this.renderPaneHeader}
      >
        <TitleManager record={record.name} />
        <Headline
          data-test-headline
          size="xx-large"
          tag="h2"
        >
          {record.name}
        </Headline>
        <AccordionSet>
          <Accordion label={<FormattedMessage id="ui-data-import.summary" />}>
            <ViewMetaData
              metadata={record.metadata}
              systemId={SYSTEM_USER_ID}
              systemUser={SYSTEM_USER_NAME}
            />
            <KeyValue label={<FormattedMessage id="ui-data-import.settings.jobProfiles.acceptedDataType" />}>
              <div data-test-accepted-data-type>{record.dataType}</div>
            </KeyValue>
            <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
              <div data-test-description>{record.description || '-'}</div>
            </KeyValue>
          </Accordion>
          {tagsEnabled && (
            <div data-test-tags-accordion>
              <TagsAccordion
                link={tagsEntityLink}
                entityWrapper={entity => ({
                  id: entity.id,
                  profile: entity,
                  addedRelations: [],
                  deletedRelations: [],
                })}
              />
            </div>
          )}
          <Accordion
            id="job-profile-overview"
            label={<FormattedMessage id="ui-data-import.settings.jobProfiles.overview" />}
          >
            {wrappersLoaded ? (
              <ProfileTree
                linkingRules={PROFILE_LINKING_RULES}
                contentData={wrappers}
                record={record}
              />
            ) : <Preloader />}
          </Accordion>
          <Accordion label={<FormattedMessage id="ui-data-import.settings.jobProfiles.jobsUsingThisProfile" />}>
            {jobsUsingThisProfileDataHasLoaded ? (
              <MultiColumnList
                id="jobs-using-this-profile"
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
            ) : <Preloader />}
          </Accordion>
        </AccordionSet>
        <EndOfItem
          className={sharedCss.endOfRecord}
          title={<FormattedMessage id="ui-data-import.endOfRecord" />}
        />
        <ConfirmationModal
          id="delete-job-profile-modal"
          open={this.state.showDeleteConfirmation}
          heading={(
            <FormattedMessage
              id="ui-data-import.modal.jobProfile.delete.header"
              values={{ name: record.name }}
            />
          )}
          message={<FormattedMessage id="ui-data-import.modal.jobProfile.delete.message" />}
          confirmLabel={<FormattedMessage id="ui-data-import.delete" />}
          cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
          onConfirm={() => this.handleDelete(record)}
          onCancel={this.hideDeleteConfirmation}
        />
        <ConfirmationModal
          id="run-job-profile-modal"
          open={this.state.showRunConfirmation}
          heading={<FormattedMessage id="ui-data-import.modal.jobProfile.run.header" />}
          message={(
            <SafeHTMLMessage
              id="ui-data-import.modal.jobProfile.run.message"
              values={{ name: record.name }}
            />
          )}
          confirmLabel={<FormattedMessage id="ui-data-import.run" />}
          onCancel={() => this.setState({ showRunConfirmation: false })}
          onConfirm={() => this.handleRun(record)}
        />
        <Callout ref={this.calloutRef} />
      </Pane>
    );
  }
}
