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
  ConfirmationModal,
  Button,
  PaneHeader,
} from '@folio/stripes/components';
import {
  ViewMetaData,
  withTags,
  TagsAccordion,
} from '@folio/stripes/smart-components';
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
  INCOMING_RECORD_TYPES,
  ProfileAssociator,
  FOLIO_RECORD_TYPES,
  FlexibleForm,
} from '../../components';
import {
  getViewHoldingsDetails,
  getViewHoldingsProps,
} from './details';

import sharedCss from '../../shared.css';
import styles from './MappingProfiles.css';

import { formConfigSamples } from '../../../test/bigtest/mocks';

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

    const formConfig = formConfigSamples.find(cfg => cfg.name === formName);
    const tagsEntityLink = `data-import-profiles/mappingProfiles/${mappingProfile.id}`;
    const associations = [...[], ...mappingProfile.parentProfiles, ...mappingProfile.childProfiles];

    const getComponentsProps = () => {
      switch (mappingProfile.existingRecordType) {
        case FOLIO_RECORD_TYPES.HOLDINGS.type:
          return getViewHoldingsProps(mappingProfile?.mappingDetails?.mappingFields);
        default:
          return {};
      }
    };

    const getRecordData = () => {
      switch (mappingProfile.existingRecordType) {
        case FOLIO_RECORD_TYPES.HOLDINGS.type:
          return getViewHoldingsDetails(mappingProfile?.mappingDetails?.mappingFields);
        default:
          return getViewHoldingsDetails(mappingProfile?.mappingDetails?.mappingFields);
      }
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
                <FormattedMessage id={FOLIO_RECORD_TYPES[mappingProfile.existingRecordType].captionId} />
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
            <div>
              <FlexibleForm
                component="Fragment"
                config={formConfig}
                styles={styles}
                record={getRecordData()}
                componentsProps={getComponentsProps()}
              />
            </div>
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-data-import.settings.associatedActionProfiles" />}
            displayWhenOpen={(
              <Button>
                <FormattedMessage id="ui-data-import.options" />
              </Button>
            )}
          >
            <ProfileAssociator
              entityKey={ENTITY_KEYS.ACTION_PROFILES}
              namespaceKey="AAP"
              parentType={PROFILE_TYPES.MAPPING_PROFILE}
              masterType={PROFILE_TYPES.ACTION_PROFILE}
              detailType={PROFILE_TYPES.MAPPING_PROFILE}
              contentData={associations}
              hasLoaded={hasLoaded}
              record={mappingProfile}
              isMultiSelect
              isMultiLink
            />
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
