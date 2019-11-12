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
  Accordion,
  AccordionSet,
  MultiColumnList,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  ViewMetaData,
  withTags,
  TagsAccordion,
} from '@folio/stripes/smart-components';

import {
  createUrl,
  createLayerURL,
} from '../../utils';
import {
  LAYER_TYPES,
  ENTITY_KEYS,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
  PROFILE_TYPES,
} from '../../utils/constants';
import {
  Spinner,
  EndOfItem,
  ActionMenu,
  listTemplate,
  FOLIO_RECORD_TYPES,
  ACTION_TYPES,
  AssociatedJobProfiles,
} from '../../components';
import { LastMenu } from '../../components/ActionMenu/ItemTemplates/LastMenu';

import sharedCss from '../../shared.css';

@stripesConnect
@withTags
@withRouter
export class ViewActionProfile extends Component {
  static manifest = Object.freeze({
    actionProfile: {
      type: 'okapi',
      path: 'data-import-profiles/actionProfiles/:{id}',
      throwErrors: false,
    },
    associatedMappingProfile: {
      type: 'okapi',
      path: createUrl(
        'data-import-profiles/profileAssociations/:{id}/details',
        {
          detailType: PROFILE_TYPES.MAPPING_PROFILE,
          masterType: PROFILE_TYPES.ACTION_PROFILE,
          limit: 1,
        },
        false,
      ),
      throwErrors: false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      actionProfile: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      associatedMappingProfile: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      associatedJobProfiles: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    tagsEnabled: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    paneId: PropTypes.string,
    ENTITY_KEY: PropTypes.string, // eslint-disable-line
    actionMenuItems: PropTypes.arrayOf(PropTypes.string), // eslint-disable-line
  };

  static defaultProps = {
    paneId: 'pane-action-profile-details',
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

  associatedMappingProfileVisibleColumns = [
    'name',
    'tags',
    'updated',
    'updatedBy',
  ];

  columnWidths = { selected: 40 };

  get actionProfileData() {
    const { resources } = this.props;

    const actionProfile = resources.actionProfile || {};
    const [record] = actionProfile.records || [];

    return {
      hasLoaded: actionProfile.hasLoaded,
      record,
    };
  }

  get associatedMappingProfileData() {
    const associatedMappingProfile = get(
      this.props,
      ['resources', 'associatedMappingProfile', 'records', 0, 'childSnapshotWrappers'],
      []
    ).map(({ content }) => content);

    return { associatedMappingProfile };
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

  navigateToMappingProfile = (e, record) => {
    const { history } = this.props;

    history.push(`/settings/data-import/mapping-profiles/view/${record.id}`);
  };

  render() {
    const {
      onClose,
      paneId,
      tagsEnabled,
    } = this.props;
    const { showDeleteConfirmation } = this.state;

    const {
      hasLoaded,
      record: actionProfile,
    } = this.actionProfileData;

    const { associatedMappingProfile } = this.associatedMappingProfileData;

    if (!actionProfile || !hasLoaded) {
      return <Spinner entity={this} />;
    }

    const paneTitle = (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="actionProfiles"
      >
        {actionProfile.name}
      </AppIcon>
    );

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

    return (
      <Pane
        id={paneId}
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={paneTitle}
        paneSub={<FormattedMessage id="ui-data-import.actionProfileName" />}
        actionMenu={this.renderActionMenu}
        lastMenu={this.renderLastMenu(actionProfile)}
        dismissible
        onClose={onClose}
      >
        <TitleManager record={actionProfile.name} />
        <Headline
          data-test-headline
          size="xx-large"
          tag="h2"
        >
          {actionProfile.name}
        </Headline>
        <AccordionSet>
          <Accordion label={<FormattedMessage id="ui-data-import.summary" />}>
            <ViewMetaData
              metadata={actionProfile.metadata}
              systemId={SYSTEM_USER_ID}
              systemUser={SYSTEM_USER_NAME}
            />
            <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
              <div data-test-description>{actionProfile.description || '-'}</div>
            </KeyValue>
          </Accordion>
          {tagsEnabled && (
            <div data-test-tags-accordion>
              <TagsAccordion link={tagsEntityLink} />
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
            <div data-test-associated-mapping-profile>
              <MultiColumnList
                id="associated-mapping-profile"
                visibleColumns={this.associatedMappingProfileVisibleColumns}
                contentData={associatedMappingProfile}
                columnMapping={{
                  name: <FormattedMessage id="ui-data-import.name" />,
                  tags: <FormattedMessage id="ui-data-import.tags" />,
                  updated: <FormattedMessage id="ui-data-import.updated" />,
                  updatedBy: <FormattedMessage id="ui-data-import.updatedBy" />,
                }}
                columnWidths={this.columnWidths}
                isEmptyMessage={<FormattedMessage id="ui-data-import.none" />}
                formatter={listTemplate({ entityKey: ENTITY_KEYS.MAPPING_PROFILES })}
                onRowClick={this.navigateToMappingProfile}
              />
            </div>
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-data-import.settings.associatedJobProfiles" />}
            displayWhenOpen={(
              <Button>
                <FormattedMessage id="ui-data-import.options" />
              </Button>
            )}
          >
            <AssociatedJobProfiles detailType={PROFILE_TYPES.ACTION_PROFILE} />
          </Accordion>
        </AccordionSet>
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
    );
  }
}
