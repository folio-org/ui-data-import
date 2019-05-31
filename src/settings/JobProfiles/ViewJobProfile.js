import React, { Component } from 'react';
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
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AppIcon,
  TitleManager,
  stripesShape,
  stripesConnect,
} from '@folio/stripes/core';

import {
  LAYER_TYPES,
  ENTITY_CONFIGS,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
} from '../../utils/constants';
import {
  createUrl,
  createLayerURL,
} from '../../utils';
import {
  listTemplate,
  ActionMenu,
  EndOfItem,
  Preloader,
  Spinner,
} from '../../components';
import { LastMenu } from '../../components/ActionMenu/ItemTemplates/LastMenu';

import sharedCss from '../../shared.css';

@stripesConnect
@injectIntl
export class ViewJobProfile extends Component {
  static manifest = Object.freeze({
    jobProfile: {
      type: 'okapi',
      path: 'data-import-profiles/jobProfiles/:{id}',
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
    intl: intlShape.isRequired,
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
      params: PropTypes.shape({ // eslint-disable-line object-curly-newline
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    paneId: PropTypes.string, // eslint-disable-line
  };

  static defaultProps = { paneId: 'pane-job-profile-details' };

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

    return {
      hasLoaded: jobsUsingThisProfile.hasLoaded,
      jobsUsingThisProfileData,
    };
  }

  entityKey = ENTITY_CONFIGS.JOB_PROFILES.ENTITY_KEY;

  actionMenuItems = [
    'edit',
    'duplicate',
    'delete',
  ];

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

  renderActionMenu = menu => (
    <ActionMenu
      entity={this}
      menu={menu}
    />
  );

  renderLastMenu = record => (
    <LastMenu
      caption="ui-data-import.edit"
      location={createLayerURL(this.props.location, LAYER_TYPES.EDIT)}
      style={{ visibility: !record ? 'hidden' : 'visible' }}
      dataAttributes={{ 'data-test-edit-item-button': '' }}
    />
  );

  render() {
    const {
      intl,
      onClose,
    } = this.props;

    const {
      hasLoaded,
      record,
    } = this.jobProfileData;
    const {
      hasLoaded: jobsUsingThisProfileDataHasLoaded,
      jobsUsingThisProfileData,
    } = this.jobsUsingThisProfileData;

    if (!record || !hasLoaded) {
      return <Spinner entity={this} />;
    }

    // start
    // JobProfiles sample data does not contain user Ids because of back-end limitations
    // and therefore it is required to add it manually on UI side
    // TODO: use real IDs when sample data will be removed (remove code from start to end)
    const userId = get(this.props, ['stripes', 'okapi', 'currentUser', 'id'], '');

    record.metadata = {
      ...record.metadata,
      createdByUserId: record.metadata.createdByUserId || userId,
      updatedByUserId: record.metadata.updatedByUserId || userId,
    };
    // end

    const paneTitle = (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="jobProfiles"
      >
        {record.name}
      </AppIcon>
    );
    const formatter = listTemplate({ intl });

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
          <Accordion label={<FormattedMessage id="ui-data-import.summary" />}>
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
                  width="100%"
                />
              )
              : <Preloader />}
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
      </Pane>
    );
  }
}
