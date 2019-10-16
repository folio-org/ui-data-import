import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  AppIcon,
  TitleManager,
  stripesConnect,
} from '@folio/stripes/core';
import {
  Pane,
  Headline,
  KeyValue,
  Accordion,
  AccordionSet,
  MultiColumnList,
  ConfirmationModal,
  Button,
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
  INCOMING_RECORD_TYPES,
  FOLIO_RECORD_TYPES,
} from '../../components';
import { LastMenu } from '../../components/ActionMenu/ItemTemplates/LastMenu';

import sharedCss from '../../shared.css';

@stripesConnect
@withTags
export class ViewMappingProfile extends Component {
  static manifest = Object.freeze({
    mappingProfile: {
      type: 'okapi',
      path: 'data-import-profiles/mappingProfiles/:{id}',
      throwErrors: false,
    },
    associatedActionProfiles: {
      type: 'okapi',
      path: createUrl(
        'data-import-profiles/profileAssociations/:{id}/masters',
        {
          detailType: PROFILE_TYPES.MAPPING_PROFILE,
          masterType: PROFILE_TYPES.ACTION_PROFILE,
          query: 'cql.allRecords=1 sortBy name/ascending',
        },
        false,
      ),
      throwErrors: false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      mappingProfile: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      associatedActionProfiles: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    location: PropTypes.object.isRequired,
    tagsEnabled: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    paneId: PropTypes.string,
    ENTITY_KEY: PropTypes.string, // eslint-disable-line
    actionMenuItems: PropTypes.arrayOf(PropTypes.string), // eslint-disable-line
  };

  static defaultProps = {
    paneId: 'pane-mapping-profile-details',
    ENTITY_KEY: ENTITY_KEYS.MAPPING_PROFILES,
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

  associatedActionProfilesVisibleColumns = [
    'name',
    'action',
    'tags',
    'updated',
    'updatedBy',
  ];

  associatedActionProfilesColumnWidths = { selected: 40 };

  get mappingProfileData() {
    const { resources } = this.props;

    const mappingProfile = resources.mappingProfile || {};
    const [record] = mappingProfile.records || [];

    return {
      hasLoaded: mappingProfile.hasLoaded,
      record,
    };
  }

  get associatedActionProfilesData() {
    const associatedActionProfiles = get(
      this.props,
      ['resources', 'associatedActionProfiles', 'records', 0, 'childSnapshotWrappers'],
      []
    ).map(({ content }) => content);

    return { associatedActionProfiles };
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

  render() {
    const {
      onClose,
      paneId,
      tagsEnabled,
    } = this.props;
    const { showDeleteConfirmation } = this.state;

    const {
      hasLoaded,
      record: mappingProfile,
    } = this.mappingProfileData;

    const { associatedActionProfiles } = this.associatedActionProfilesData;

    if (!mappingProfile || !hasLoaded) {
      return <Spinner entity={this} />;
    }

    const paneTitle = (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="mappingProfiles"
      >
        {mappingProfile.name}
      </AppIcon>
    );

    // MappingProfiles sample data does not contain user Ids because of back-end limitations
    // and therefore it is required to add it manually on UI side
    // TODO: use real IDs when sample data will be removed (remove the block of code below)
    {
      const userId = get(this.props, ['stripes', 'okapi', 'currentUser', 'id'], '');

      mappingProfile.metadata = {
        ...mappingProfile.metadata,
        createdByUserId: mappingProfile.metadata.createdByUserId || userId,
        updatedByUserId: mappingProfile.metadata.updatedByUserId || userId,
      };
    }

    const tagsEntityLink = `data-import-profiles/mappingProfiles/${mappingProfile.id}`;

    return (
      <Pane
        id={paneId}
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={paneTitle}
        paneSub={<FormattedMessage id="ui-data-import.mappingProfileName" />}
        actionMenu={this.renderActionMenu}
        lastMenu={this.renderLastMenu(mappingProfile)}
        dismissible
        onClose={onClose}
      >
        <TitleManager record={mappingProfile.name} />
        <Headline
          data-test-headline
          size="xx-large"
          tag="h2"
        >
          {mappingProfile.name}
        </Headline>
        <AccordionSet>
          <Accordion label={<FormattedMessage id="ui-data-import.summary" />}>
            <ViewMetaData
              metadata={mappingProfile.metadata}
              systemId={SYSTEM_USER_ID}
              systemUser={SYSTEM_USER_NAME}
            />
            <KeyValue label={<FormattedMessage id="ui-data-import.incomingRecordType" />}>
              <div data-test-incoming-record-type>
                <FormattedMessage id={INCOMING_RECORD_TYPES[mappingProfile.incomingRecordType].captionId} />
              </div>
            </KeyValue>
            <KeyValue label={<FormattedMessage id="ui-data-import.folioRecordType" />}>
              <div data-test-folio-record-type>
                <FormattedMessage id={FOLIO_RECORD_TYPES[mappingProfile.folioRecord].captionId} />
              </div>
            </KeyValue>
            <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
              <div data-test-description>{mappingProfile.description || '-'}</div>
            </KeyValue>
          </Accordion>
          {tagsEnabled && (
            <div data-test-tags-accordion>
              <TagsAccordion link={tagsEntityLink} />
            </div>
          )}
          <Accordion label={<FormattedMessage id="ui-data-import.details" />}>
            <div style={{ height: 60 }}>{/* will be implemented in future stories */}</div>
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-data-import.settings.associatedActionProfiles" />}
            displayWhenOpen={(
              <Button>
                <FormattedMessage id="ui-data-import.options" />
              </Button>
            )}
          >
            <div data-test-associated-action-profiles>
              <MultiColumnList
                id="associated-action-profiles"
                visibleColumns={this.associatedActionProfilesVisibleColumns}
                contentData={associatedActionProfiles}
                columnMapping={{
                  name: <FormattedMessage id="ui-data-import.name" />,
                  action: <FormattedMessage id="ui-data-import.action" />,
                  tags: <FormattedMessage id="ui-data-import.tags" />,
                  updated: <FormattedMessage id="ui-data-import.updated" />,
                  updatedBy: <FormattedMessage id="ui-data-import.updatedBy" />,
                }}
                columnWidths={this.associatedActionProfilesColumnWidths}
                isEmptyMessage={<FormattedMessage id="ui-data-import.none" />}
                formatter={listTemplate({ entityKey: ENTITY_KEYS.ACTION_PROFILES })}
              />
            </div>
          </Accordion>
        </AccordionSet>
        <EndOfItem
          className={sharedCss.endOfRecord}
          title={<FormattedMessage id="ui-data-import.endOfRecord" />}
        />
        <ConfirmationModal
          id="delete-mapping-profile-modal"
          open={showDeleteConfirmation}
          heading={(
            <FormattedMessage
              id="ui-data-import.modal.mappingProfile.delete.header"
              values={{ name: mappingProfile.name }}
            />
          )}
          message={<FormattedMessage id="ui-data-import.modal.mappingProfile.delete.message" />}
          confirmLabel={<FormattedMessage id="ui-data-import.delete" />}
          cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
          onConfirm={() => this.handleDelete(mappingProfile)}
          onCancel={this.hideDeleteConfirmation}
        />
      </Pane>
    );
  }
}
