import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import {
  flow,
  get
} from 'lodash';

import {
  AppIcon,
  TitleManager,
  stripesConnect,
  stripesShape,
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
import {
  EndOfItem,
  FOLIO_RECORD_TYPES,
} from '@folio/stripes-data-transfer-components';

import {
  DetailsKeyShortcutsWrapper,
  Spinner,
  ActionMenu,
  ProfileAssociator,
  RecordTypesSelect,
} from '../../../components';
import { ViewMatchCriterion } from '../../../components/MatchCriterion/view';

import {
  ENTITY_KEYS,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
  PROFILE_TYPES,
  getEntity,
  getEntityTags,
  showActionMenu,
  BASE_URLS,
  MATCH_INCOMING_RECORD_TYPES,
} from '../../../utils';

import sharedCss from '../../../shared.css';
import styles from '../MatchProfiles.css';

class ViewMatchProfileComponent extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    matchProfileView: {
      type: 'okapi',
      path: 'data-import-profiles/matchProfiles/:{id}',
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
    stripes: stripesShape.isRequired,
    resources: PropTypes.shape({
      matchProfileView: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }).isRequired }).isRequired,
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
    intl: PropTypes.object.isRequired,
    parentResources: PropTypes.object,
    ENTITY_KEY: PropTypes.string, // eslint-disable-line
    actionMenuItems: PropTypes.arrayOf(PropTypes.string), // eslint-disable-line
    accordionStatusRef: PropTypes.object,
  };

  static defaultProps = {
    ENTITY_KEY: ENTITY_KEYS.MATCH_PROFILES,
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

  get matchProfileData() {
    const { resources } = this.props;

    const matchProfile = resources.matchProfileView || {};
    const [record] = matchProfile.records || [];

    return {
      hasLoaded: matchProfile.hasLoaded,
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
    const { record } = this.matchProfileData;

    return (
      <ActionMenu
        entity={this}
        menu={menu}
        recordId={record?.id}
        baseUrl={BASE_URLS.MATCH_PROFILE}
      />
    );
  };

  renderPaneHeader = renderProps => {
    const {
      onClose,
      stripes,
    } = this.props;

    const { record: matchProfile } = this.matchProfileData;

    const paneTitle = (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="matchProfiles"
      >
        {matchProfile.name}
      </AppIcon>
    );

    return (
      <PaneHeader
        {...renderProps}
        paneTitle={paneTitle}
        paneSub={<FormattedMessage id="ui-data-import.matchProfileName" />}
        actionMenu={showActionMenu({
          renderer: this.renderActionMenu,
          stripes,
        })}
        dismissible
        onClose={onClose}
      />
    );
  };

  render() {
    const {
      tagsEnabled,
      parentResources,
      history,
      location,
      accordionStatusRef,
      intl,
    } = this.props;
    const { showDeleteConfirmation } = this.state;

    const {
      hasLoaded,
      record: matchProfile,
    } = this.matchProfileData;
    const associations = [...[], ...get(matchProfile, ['parentProfiles'], []), ...get(matchProfile, ['childProfiles'], [])];

    if (!matchProfile || !hasLoaded) {
      return (
        <Spinner
          data-test-pane-match-profile-details
          entity={this}
        />
      );
    }

    const tagsEntityLink = `data-import-profiles/matchProfiles/${matchProfile.id}`;
    const existingRecordLabel = FOLIO_RECORD_TYPES[matchProfile.existingRecordType]
      ? <FormattedMessage id={FOLIO_RECORD_TYPES[matchProfile.existingRecordType].captionId} />
      : '';
    const incomingRecordLabel = MATCH_INCOMING_RECORD_TYPES[matchProfile.incomingRecordType]
      ? <FormattedMessage id={MATCH_INCOMING_RECORD_TYPES[matchProfile.incomingRecordType].captionId} />
      : '';

    return (
      <DetailsKeyShortcutsWrapper
        history={history}
        location={location}
        recordId={matchProfile?.id}
        baseUrl={BASE_URLS.MATCH_PROFILE}
      >
        <Pane
          data-test-pane-match-profile-details
          renderHeader={this.renderPaneHeader}
          defaultWidth="620px"
          fluidContentWidth
          id="view-match-profile-pane"
        >
          <TitleManager
            prefix={`${intl.formatMessage({ id: 'ui-data-import.settings.dataImport.title' })} - `}
            page={intl.formatMessage({ id: 'ui-data-import.settings.matchProfiles.title' })}
            record={matchProfile.name}
          />
          <Headline
            className={sharedCss.headline}
            data-test-headline
            size="xx-large"
            tag="h2"
          >
            {matchProfile.name}
          </Headline>
          <AccordionStatus ref={accordionStatusRef}>
            <AccordionSet>
              <Accordion label={<FormattedMessage id="ui-data-import.summary" />}>
                <ViewMetaData
                  metadata={matchProfile.metadata}
                  systemId={SYSTEM_USER_ID}
                  systemUser={SYSTEM_USER_NAME}
                />
                <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
                  <div data-test-description>{matchProfile.description || <NoValue />}</div>
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
              <div className={styles.details}>
                <Accordion
                  id="view-match-profile-details"
                  label={<FormattedMessage id="ui-data-import.details" />}
                >
                  <RecordTypesSelect
                    id="panel-existing-view"
                    existingRecordType={matchProfile.existingRecordType}
                    incomingRecordType={matchProfile.incomingRecordType}
                    isEditable={false}
                  />
                  <Accordion
                    id="view-match-criteria"
                    label={<FormattedMessage id="ui-data-import.match.criteria" />}
                    separator={false}
                  >
                    {matchProfile.matchDetails.map((item, i) => (
                      <ViewMatchCriterion
                        key={i}
                        matchDetails={item}
                        incomingRecordLabel={incomingRecordLabel}
                        existingRecordLabel={existingRecordLabel}
                        resources={parentResources}
                      />
                    ))}
                  </Accordion>
                </Accordion>
              </div>
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
                  parentType={PROFILE_TYPES.MATCH_PROFILE}
                  masterType={PROFILE_TYPES.JOB_PROFILE}
                  detailType={PROFILE_TYPES.MATCH_PROFILE}
                  profileType={ENTITY_KEYS.MATCH_PROFILES}
                  contentData={associations}
                  hasLoaded={hasLoaded}
                  record={matchProfile}
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
            id="delete-match-profile-modal"
            open={showDeleteConfirmation}
            heading={(
              <FormattedMessage
                id="ui-data-import.modal.matchProfile.delete.header"
                values={{ name: matchProfile.name }}
              />
            )}
            message={<FormattedMessage id="ui-data-import.modal.matchProfile.delete.message" />}
            confirmLabel={<FormattedMessage id="ui-data-import.delete" />}
            cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
            onConfirm={() => this.handleDelete(matchProfile)}
            onCancel={this.hideDeleteConfirmation}
          />
        </Pane>
      </DetailsKeyShortcutsWrapper>
    );
  }
}

export const ViewMatchProfile = flow([
  () => injectIntl(ViewMatchProfileComponent),
  withTags,
  stripesConnect,
])();
