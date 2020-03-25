import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  get,
  cloneDeep,
} from 'lodash';

import {
  AppIcon,
  TitleManager,
  stripesConnect,
} from '@folio/stripes/core';
import {
  Headline,
  Pane,
  ConfirmationModal,
  PaneHeader,
} from '@folio/stripes/components';
import { withTags } from '@folio/stripes/smart-components';

import {
  ENTITY_KEYS,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
  PROFILE_TYPES,
} from '../../utils/constants';
import {
  Spinner,
  EndOfItem,
  ActionMenu,
  FlexibleForm,
  INCOMING_RECORD_TYPES,
  FOLIO_RECORD_TYPES,
} from '../../components';

import { formConfigSamples } from '../../../test/bigtest/mocks';

import sharedCss from '../../shared.css';
import styles from '../MatchProfiles/ViewMatchProfile.css';

const formName = 'mappingProfilesForm';

@stripesConnect
@withTags
export class ViewMappingProfile extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    mappingProfile: {
      type: 'okapi',
      path: 'data-import-profiles/mappingProfiles/:{id}',
      params: { withRelations: true },
      throwErrors: false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      mappingProfile: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
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

  get mappingProfileData() {
    const { resources } = this.props;

    const mappingProfile = resources.mappingProfile || {};
    const [record] = mappingProfile.records || [];

    return {
      hasLoaded: mappingProfile.hasLoaded,
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

  renderActionMenu = menu => (
    <ActionMenu
      entity={this}
      menu={menu}
    />
  );

  renderPaneHeader = renderProps => {
    const { onClose } = this.props;

    const { record: mappingProfile } = this.mappingProfileData;

    const paneTitle = (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="mappingProfiles"
      >
        {mappingProfile.name}
      </AppIcon>
    );

    return (
      <PaneHeader
        {...renderProps}
        paneTitle={paneTitle}
        paneSub={<FormattedMessage id="ui-data-import.mappingProfileName" />}
        actionMenu={this.renderActionMenu}
        dismissible
        onClose={onClose}
      />
    );
  };

  render() {
    const {
      tagsEnabled,
      paneId,
    } = this.props;
    const { showDeleteConfirmation } = this.state;

    const {
      hasLoaded,
      record: mappingProfile,
    } = this.mappingProfileData;

    if (!mappingProfile || !hasLoaded) {
      return <Spinner entity={this} />;
    }

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

    const getIncomingRecordTypesDataOptions = () => Object.entries(INCOMING_RECORD_TYPES)
      .map(([recordType, { captionId }]) => ({
        value: recordType,
        label: captionId,
      }));
    const getExistingRecordTypesDataOptions = () => Object.entries(FOLIO_RECORD_TYPES)
      .map(([recordType, { captionId }]) => ({
        value: recordType,
        label: captionId,
      }));

    const associations = [
      ...mappingProfile.parentProfiles,
      ...mappingProfile.childProfiles,
    ];

    const formConfig = formConfigSamples.find(cfg => cfg.name === formName);
    const record = cloneDeep(mappingProfile);
    const existingRecordType = get(record, ['existingRecordType'], null);

    const injectedProps = {
      'section-metadata': {
        metadata: mappingProfile.metadata,
        systemId: SYSTEM_USER_ID,
        systemUser: SYSTEM_USER_NAME,
      },
      'field-record-type-incoming': { dataOptions: getIncomingRecordTypesDataOptions() },
      'field-record-type-existing': { dataOptions: getExistingRecordTypesDataOptions() },
      'mapping-tags': {
        renderForbidden: !tagsEnabled,
        link: `data-import-profiles/mappingProfiles/${mappingProfile.id}`,
      },
      'section-mapping-details': { stateFieldValue: existingRecordType },
      'mappingProfile.actionsAssociator': {
        entityKey: ENTITY_KEYS.ACTION_PROFILES,
        namespaceKey: 'AAP',
        parentId: record.id,
        parentType: PROFILE_TYPES.MAPPING_PROFILE,
        masterType: PROFILE_TYPES.ACTION_PROFILE,
        detailType: PROFILE_TYPES.MAPPING_PROFILE,
        profileName: record.name,
        contentData: associations,
      },
    };

    return (
      <Pane
        id={paneId}
        defaultWidth="fill"
        fluidContentWidth
        renderHeader={this.renderPaneHeader}
      >
        <TitleManager record={mappingProfile.name} />
        <Headline
          data-test-headline
          size="xx-large"
          tag="h2"
        >
          {mappingProfile.name}
        </Headline>
        <FlexibleForm
          component="Fragment"
          config={formConfig}
          styles={styles}
          record={record}
          injectedProps={injectedProps}
        />
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
