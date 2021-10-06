import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  AppIcon,
  TitleManager,
  stripesConnect,
} from '@folio/stripes/core';
import {
  Pane,
  Button,
  Headline,
  KeyValue,
  NoValue,
  Accordion,
  AccordionSet,
  ConfirmationModal,
  PaneHeader,
  AccordionStatus,
} from '@folio/stripes/components';
import {
  ViewMetaData,
  withTags,
  TagsAccordion,
} from '@folio/stripes/smart-components';
import { EndOfItem } from '@folio/stripes-data-transfer-components';

import {
  ENTITY_KEYS,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
  PROFILE_TYPES,
  getEntity,
  getEntityTags,
} from '../../utils';
import {
  DetailsKeyShortcutsWrapper,
  Spinner,
  ActionMenu,
  FOLIO_RECORD_TYPES,
  ACTION_TYPES,
  ProfileAssociator,
} from '../../components';

import sharedCss from '../../shared.css';

@stripesConnect
@withTags
@withRouter
export class ViewActionProfile extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    actionProfile: {
      type: 'okapi',
      path: 'data-import-profiles/actionProfiles/:{id}',
      params: { withRelations: true },
      throwErrors: false,

      // Next two parameters added as a workaround to fix UIDATIMP-424,
      // but it's not optimal from network side and produces extra GET requests.
      // Should be checked and reworked in the future

      // should resource be refreshed again on mount
      resourceShouldRefresh: true,
      // should resource be refreshed on POST/PUT/DELETE mutation
      shouldRefresh: () => false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      actionProfile: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    location: PropTypes.oneOfType([
      PropTypes.shape({
        search: PropTypes.string.isRequired,
        pathname: PropTypes.string.isRequired,
      }).isRequired,
      PropTypes.string.isRequired,
    ]).isRequired,
    tagsEnabled: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    ENTITY_KEY: PropTypes.string, // eslint-disable-line
    actionMenuItems: PropTypes.arrayOf(PropTypes.string), // eslint-disable-line
    accordionStatusRef: PropTypes.object,
  };

  static defaultProps = {
    ENTITY_KEY: ENTITY_KEYS.ACTION_PROFILES,
    actionMenuItems: [
      'edit',
      'duplicate',
      'delete',
    ],
  };

  state = {
    deletionInProgress: false,
    showDeleteConfirmation: false,
  };

  get actionProfileData() {
    const { resources } = this.props;

    const actionProfile = resources.actionProfile || {};
    const [record] = actionProfile.records || [];

    return {
      hasLoaded: actionProfile.hasLoaded,
      record,
    };
  }

  showDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: true });
  };

  hideDeleteConfirmation = () => {
    this.setState({
      showDeleteConfirmation: false,
      deletionInProgress: false,
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

  renderActionMenu = menu => {
    const { record } = this.actionProfileData;

    return (
      <ActionMenu
        entity={this}
        menu={menu}
        recordId={record?.id}
      />
    );
  };

  renderPaneHeader = renderProps => {
    const { onClose } = this.props;
    const { record: actionProfile } = this.actionProfileData;

    const paneTitle = (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="actionProfiles"
      >
        {actionProfile.name}
      </AppIcon>
    );

    return (
      <PaneHeader
        {...renderProps}
        paneTitle={paneTitle}
        paneSub={<FormattedMessage id="ui-data-import.actionProfileName" />}
        actionMenu={this.renderActionMenu}
        dismissible
        onClose={onClose}
      />
    );
  };

  render() {
    const {
      tagsEnabled,
      history,
      location,
      accordionStatusRef,
    } = this.props;
    const { showDeleteConfirmation } = this.state;
    const {
      hasLoaded,
      record: actionProfile,
    } = this.actionProfileData;

    if (!actionProfile || !hasLoaded) {
      return (
        <Spinner
          data-test-mapping-profile-details
          entity={this}
        />
      );
    }

    // ActionProfiles sample data does not contain user Ids because of back-end limitations
    // and therefore it is required to add it manually on UI side
    // TODO: use real IDs when sample data will be removed (remove the block of code below)
    {
      const userId = get(this.props, ['stripes', 'okapi', 'currentUser', 'id'], '');

      actionProfile.metadata = {
        ...actionProfile.metadata,
        createdByUserId: actionProfile.metadata.createdByUserId || userId,
        updatedByUserId: actionProfile.metadata.updatedByUserId || userId,
      };
    }

    const tagsEntityLink = `data-import-profiles/actionProfiles/${actionProfile.id}`;
    const associations = [...[], ...actionProfile.parentProfiles, ...actionProfile.childProfiles];

    return (
      <DetailsKeyShortcutsWrapper
        history={history}
        location={location}
        recordId={actionProfile?.id}
      >
        <Pane
          data-test-pane-action-profile-details
          defaultWidth="fill"
          fluidContentWidth
          renderHeader={this.renderPaneHeader}
        >
          <TitleManager record={actionProfile.name} />
          <Headline
            data-test-headline
            size="xx-large"
            tag="h2"
          >
            {actionProfile.name}
          </Headline>
          <AccordionStatus ref={accordionStatusRef}>
            <AccordionSet>
              <Accordion label={<FormattedMessage id="ui-data-import.summary" />}>
                <ViewMetaData
                  metadata={actionProfile.metadata}
                  systemId={SYSTEM_USER_ID}
                  systemUser={SYSTEM_USER_NAME}
                />
                <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
                  <div data-test-description>{actionProfile.description || <NoValue />}</div>
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
              <Accordion label={<FormattedMessage id="ui-data-import.details" />}>
                <KeyValue label={<FormattedMessage id="ui-data-import.action" />}>
                  <div data-test-action>
                    <FormattedMessage id={ACTION_TYPES[actionProfile.action].captionId} />
                  </div>
                </KeyValue>
                <KeyValue label={<FormattedMessage id="ui-data-import.folioRecordType" />}>
                  <div data-test-folio-record>
                    <FormattedMessage id={FOLIO_RECORD_TYPES[actionProfile.folioRecord].captionId} />
                  </div>
                </KeyValue>
              </Accordion>
              <Accordion
                label={<FormattedMessage id="ui-data-import.settings.associatedMappingProfile" />}
                displayWhenOpen={(
                  <Button>
                    <FormattedMessage id="ui-data-import.options" />
                  </Button>
                )}
              >
                <ProfileAssociator
                  entityKey={ENTITY_KEYS.MAPPING_PROFILES}
                  namespaceKey="AMP"
                  parentType={PROFILE_TYPES.ACTION_PROFILE}
                  masterType={PROFILE_TYPES.ACTION_PROFILE}
                  detailType={PROFILE_TYPES.MAPPING_PROFILE}
                  profileType={ENTITY_KEYS.ACTION_PROFILES}
                  contentData={associations}
                  hasLoaded={hasLoaded}
                  record={actionProfile}
                  isMultiSelect={false}
                  isMultiLink
                />
              </Accordion>
              <Accordion
                label={<FormattedMessage id="ui-data-import.settings.associatedJobProfiles" />}
                displayWhenOpen={(
                  <Button>
                    <FormattedMessage id="ui-data-import.options" />
                  </Button>
                )}
              >
                <ProfileAssociator
                  entityKey={ENTITY_KEYS.JOB_PROFILES}
                  namespaceKey="AJP"
                  parentType={PROFILE_TYPES.ACTION_PROFILE}
                  masterType={PROFILE_TYPES.JOB_PROFILE}
                  detailType={PROFILE_TYPES.ACTION_PROFILE}
                  profileType={ENTITY_KEYS.ACTION_PROFILES}
                  contentData={associations}
                  hasLoaded={hasLoaded}
                  record={actionProfile}
                  isMultiSelect
                  isMultiLink
                />
              </Accordion>
            </AccordionSet>
          </AccordionStatus>
          <EndOfItem
            className={sharedCss.endOfRecord}
            title={<FormattedMessage id="ui-data-import.endOfRecord" />}
          />
          <ConfirmationModal
            id="delete-action-profile-modal"
            open={showDeleteConfirmation}
            heading={(
              <FormattedMessage
                id="ui-data-import.modal.actionProfile.delete.header"
                values={{ name: actionProfile.name }}
              />
            )}
            message={<FormattedMessage id="ui-data-import.modal.actionProfile.delete.message" />}
            confirmLabel={<FormattedMessage id="ui-data-import.delete" />}
            cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
            onConfirm={() => this.handleDelete(actionProfile)}
            onCancel={this.hideDeleteConfirmation}
          />
        </Pane>
      </DetailsKeyShortcutsWrapper>
    );
  }
}
