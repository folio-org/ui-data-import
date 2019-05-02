import React, {
  Component,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Icon,
  Pane,
  Button,
  PaneMenu,
  Headline,
  KeyValue,
  Accordion,
  AccordionSet,
  MultiColumnList,
  ConfirmationModal,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AppIcon,
  IntlConsumer,
  TitleManager,
  stripesShape,
  stripesConnect,
} from '@folio/stripes/core';

import { EndOfItem } from '../../components/EndOfItem';
import { Preloader } from '../../components/Preloader';
import { withJobLogsCellsFormatter } from '../../components/JobLogs/withJobLogsCellsFormatter';
import {
  JOB_STATUSES,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
} from '../../utils/constants';
import { createUrl, sortCollection, sortDates } from '../../utils';

import css from './JobProfiles.css';

@withJobLogsCellsFormatter
@stripesConnect
export class ViewJobProfile extends Component {
  static manifest = Object.freeze({
    jobProfile: {
      type: 'okapi',
      path: 'data-import-profiles/jobProfiles/:{id}',
      throwErrors: false,
    },
    jobsUsingThisProfile: {
      type: 'okapi',
      // TODO: UIDATIMP-180 - fix query param
      path: createUrl('metadata-provider/jobExecutions', {
        // query: '(jobProfileInfo.id==":{id}") sortBy completedDate/sort.descending',
        query: `(uiStatus=="${JOB_STATUSES.READY_FOR_PREVIEW}")`,
        limit: 25,
      }),
      throwErrors: false,
    },
  });

  static propTypes = {
    stripes: stripesShape.isRequired,
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
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    editLink: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onOpenEdit: PropTypes.func.isRequired,
    onDuplicate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    formatter: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      showDeleteConfirmation: false,
      deletionInProgress: false,
    };

    const { stripes } = this.props;

    this.connectedViewMetaData = stripes.connect(ViewMetaData);
  }

  get jobProfileData() {
    const { resources } = this.props;

    const jobProfile = resources.jobProfile || {};
    const [record] = jobProfile.records || [];

    return {
      hasLoaded: jobProfile.hasLoaded,
      record,
    };
  }

  get jobsUsingThisProfileData() {
    const { resources } = this.props;

    const jobsUsingThisProfile = resources.jobsUsingThisProfile || {};
    const [{ jobExecutionDtos: jobsUsingThisProfileData } = {}] = jobsUsingThisProfile.records || [];

    // TODO: UIDATIMP-180 - remove front-end sorting
    const jobsUsingThisProfileDataSorted = sortCollection(
      jobsUsingThisProfileData,
      [(a, b) => sortDates(b.completedDate, a.completedDate)],
    );

    return {
      hasLoaded: jobsUsingThisProfile.hasLoaded,
      jobsUsingThisProfileData: jobsUsingThisProfileDataSorted,
    };
  }

  renderActionMenu = menu => (
    <Fragment>
      <Button
        data-test-edit-job-profile-menu-button
        buttonStyle="dropdownItem"
        onClick={() => this.handleOpenEdit(menu)}
      >
        <Icon icon="edit">
          <FormattedMessage id="ui-data-import.edit" />
        </Icon>
      </Button>
      <Button
        data-test-duplicate-job-profile-menu-button
        buttonStyle="dropdownItem"
        onClick={() => this.handleOpenDuplicate(menu)}
      >
        <Icon icon="duplicate">
          <FormattedMessage id="ui-data-import.duplicate" />
        </Icon>
      </Button>
      <Button
        data-test-delete-job-profile-menu-button
        buttonStyle="dropdownItem"
        onClick={() => this.showDeleteConfirmation()}
      >
        <Icon icon="trash">
          <FormattedMessage id="ui-data-import.delete" />
        </Icon>
      </Button>
    </Fragment>
  );

  handleOpenEdit = menu => {
    const { onOpenEdit } = this.props;

    onOpenEdit();
    menu.onToggle();
  };

  handleOpenDuplicate = menu => {
    const { onDuplicate } = this.props;

    onDuplicate();
    menu.onToggle();
  };

  showDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: true });
  };

  hideDeleteConfirmation = () => {
    this.setState({
      showDeleteConfirmation: false,
      deletionInProgress: false,
    });
  };

  handleDelete = record => {
    const { onDelete } = this.props;
    const { deletionInProgress } = this.state;

    if (deletionInProgress) {
      return;
    }

    this.setState({ deletionInProgress: true }, async () => {
      await onDelete(record);
      this.hideDeleteConfirmation();
    });
  };

  renderLastMenu(record) {
    const {
      onOpenEdit,
      editLink,
    } = this.props;

    const editButtonVisibility = !record ? 'hidden' : 'visible';

    return (
      <PaneMenu>
        <Button
          data-test-edit-job-profile-button
          href={editLink}
          style={{ visibility: editButtonVisibility }}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
          onClick={onOpenEdit}
        >
          <FormattedMessage id="ui-data-import.edit" />
        </Button>
      </PaneMenu>
    );
  }

  render() {
    const {
      onClose,
      formatter,
    } = this.props;

    const {
      hasLoaded,
      record,
    } = this.jobProfileData;
    const {
      hasLoaded: jobsUsingThisProfileDataHasLoaded,
      jobsUsingThisProfileData,
    } = this.jobsUsingThisProfileData;

    const renderSpinner = !record || !hasLoaded;

    if (renderSpinner) {
      return (
        <Pane
          id="pane-job-profile-details"
          defaultWidth="fill"
          fluidContentWidth
          paneTitle=""
          dismissible
          onClose={onClose}
        >
          <Preloader />
        </Pane>
      );
    }

    // TODO: UIDATIMP-180 - use real IDs
    const userId = get(this.props, ['stripes', 'okapi', 'currentUser', 'id'], '');

    record.metadata = {
      ...record.metadata,
      createdByUserId: record.metadata.createdByUserId || userId,
      updatedByUserId: record.metadata.updatedByUserId || userId,
    };

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
      <Pane
        id="pane-job-profile-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={paneTitle}
        paneSub={<FormattedMessage id="ui-data-import.jobProfileName" />}
        actionMenu={this.renderActionMenu}
        lastMenu={this.renderLastMenu(record)}
        dismissible
        onClose={onClose}
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
          <Accordion label={<FormattedMessage id="ui-data-import.settings.jobProfiles.summary" />}>
            <this.connectedViewMetaData
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
          <Accordion label={<FormattedMessage id="ui-data-import.settings.jobProfiles.overview" />}>
            <div style={{ height: 60 }}>{/* will be implemented in UIDATIMP-152 */}</div>
          </Accordion>
          <Accordion label={<FormattedMessage id="ui-data-import.settings.jobProfiles.jobsUsingThisProfile" />}>
            {jobsUsingThisProfileDataHasLoaded
              ? (
                <IntlConsumer>
                  {intl => (
                    <MultiColumnList
                      id="jobs-using-this-profile"
                      totalCount={jobsUsingThisProfileData.length}
                      contentData={jobsUsingThisProfileData}
                      columnMapping={{
                        fileName: intl.formatMessage({ id: 'ui-data-import.fileName' }),
                        hrId: intl.formatMessage({ id: 'ui-data-import.settings.jobProfiles.jobID' }),
                        completedDate: intl.formatMessage({ id: 'ui-data-import.jobCompletedDate' }),
                        runBy: intl.formatMessage({ id: 'ui-data-import.runBy' }),
                      }}
                      visibleColumns={[
                        'fileName',
                        'hrId',
                        'completedDate',
                        'runBy',
                      ]}
                      formatter={formatter}
                    />
                  )}
                </IntlConsumer>
              )
              : <Preloader />}
          </Accordion>
        </AccordionSet>
        <EndOfItem
          className={css.endOfRecord}
          title={<FormattedMessage id="ui-data-import.endOfRecord" />}
        />
        <ConfirmationModal
          id="delete-job-profile-modal"
          open={this.state.showDeleteConfirmation}
          heading={
            <FormattedMessage
              id="ui-data-import.modal.jobProfile.delete.header"
              values={{ name: record.name }}
            />
          }
          message={<FormattedMessage id="ui-data-import.modal.jobProfile.delete.message" />}
          confirmLabel={<FormattedMessage id="ui-data-import.delete" />}
          cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
          onConfirm={() => this.handleDelete(record)}
          onCancel={this.hideDeleteConfirmation}
        />
      </Pane>
    );
  }
}
