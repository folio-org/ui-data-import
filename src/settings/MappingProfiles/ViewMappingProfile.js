import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  AppIcon,
  IntlConsumer,
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
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

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
} from '../../components';
import { LastMenu } from '../../components/ActionMenu/ItemTemplates/LastMenu';
import {
  INCOMING_RECORD_TYPES,
  RECORD_TYPES,
} from '../../components/ListTemplate/recordTypes';

import sharedCss from '../../shared.css';

@stripesConnect
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
    onClose: PropTypes.func.isRequired,
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

  associatedActionProfilesVisibleColumns = [
    'name',
    'action',
    'tags',
    'updated',
    'updatedBy',
  ];

  associatedActionProfilesColumnWidths = {
    selected: 40,
    name: 200,
    action: 200,
    tags: 150,
    updated: 150,
    updatedBy: 250,
  };

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
    } = this.props;

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
                <FormattedMessage id={RECORD_TYPES[mappingProfile.folioRecord].captionId} />
              </div>
            </KeyValue>
            <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
              <div data-test-description>{mappingProfile.description || '-'}</div>
            </KeyValue>
          </Accordion>
          <Accordion label={<FormattedMessage id="ui-data-import.details" />}>
            <div style={{ height: 60 }}>{/* will be implemented in future stories */}</div>
          </Accordion>
          <Accordion label={<FormattedMessage id="ui-data-import.settings.associatedActionProfiles" />}>
            <div data-test-associated-action-profiles>
              <IntlConsumer>
                {intl => (
                  <MultiColumnList
                    id="associated-action-profiles"
                    visibleColumns={this.associatedActionProfilesVisibleColumns}
                    contentData={associatedActionProfiles}
                    columnMapping={{
                      name: intl.formatMessage({ id: 'ui-data-import.name' }),
                      action: intl.formatMessage({ id: 'ui-data-import.action' }),
                      tags: intl.formatMessage({ id: 'ui-data-import.tags' }),
                      updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                      updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                    }}
                    columnWidths={this.associatedActionProfilesColumnWidths}
                    isEmptyMessage={<FormattedMessage id="ui-data-import.none" />}
                    formatter={listTemplate({ entityKey: ENTITY_KEYS.ACTION_PROFILES })}
                  />
                )}
              </IntlConsumer>
            </div>
          </Accordion>
        </AccordionSet>
        <EndOfItem
          className={sharedCss.endOfRecord}
          title={<FormattedMessage id="ui-data-import.endOfRecord" />}
        />
      </Pane>
    );
  }
}
