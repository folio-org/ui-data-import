import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  AppIcon,
  TitleManager,
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import {
  Headline,
  ConfirmationModal,
  PaneHeader,
  AccordionSet,
  Accordion,
  KeyValue,
  NoValue,
  AccordionStatus,
  Row,
  Col,
  ExpandAllButton,
} from '@folio/stripes/components';
import {
  ViewMetaData,
  withTags,
  TagsAccordion,
} from '@folio/stripes/smart-components';
import {
  EndOfItem,
  FullScreenView,
  FOLIO_RECORD_TYPES
} from '@folio/stripes-data-transfer-components';

import {
  DetailsKeyShortcutsWrapper,
  Spinner,
  ActionMenu,
  ProfileAssociator,
  MappedHeader,
} from '../../../components';
import {
  MappingInstanceDetails,
  MappingItemDetails,
  MappingHoldingsDetails,
  MappingMARCBibDetails,
  MappingInvoiceDetails,
  MappingMARCAuthorityDetails,
  MappingOrderDetails,
} from '../detailsSections/view';

import {
  ENTITY_KEYS,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
  PROFILE_TYPES,
  MAPPING_DETAILS_HEADLINE,
  getEntity,
  getEntityTags,
  FIELD_MAPPINGS_FOR_MARC_OPTIONS,
  marcFieldProtectionSettingsShape,
  showActionMenu,
  isMARCType,
  BASE_URLS,
  INCOMING_RECORD_TYPES,
} from '../../../utils';

import sharedCss from '../../../shared.css';

@injectIntl
@stripesConnect
@withTags
export class ViewMappingProfile extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    mappingProfileView: {
      type: 'okapi',
      path: 'data-import-profiles/mappingProfiles/:{id}',
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
      mappingProfileView: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    parentResources: PropTypes.shape({ marcFieldProtectionSettings: PropTypes.shape({ records: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired }).isRequired }).isRequired,
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
    ENTITY_KEY: PropTypes.string, // eslint-disable-line
    actionMenuItems: PropTypes.arrayOf(PropTypes.string), // eslint-disable-line
    accordionStatusRef: PropTypes.object,
  };

  static defaultProps = {
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
    const {
      resources,
      parentResources,
    } = this.props;

    const mappingProfile = resources.mappingProfileView || {};
    const marcFieldProtectionFields = parentResources.marcFieldProtectionSettings.records || [];
    const [record] = mappingProfile.records || [];

    return {
      hasLoaded: mappingProfile.hasLoaded,
      record,
      marcFieldProtectionFields,
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
    const { record } = this.mappingProfileData;

    return (
      <ActionMenu
        entity={this}
        menu={menu}
        recordId={record?.id}
        baseUrl={BASE_URLS.MAPPING_PROFILE}
      />
    );
  };

  renderPaneHeader = renderProps => {
    const {
      onClose,
      stripes,
    } = this.props;

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
      history,
      location,
      accordionStatusRef,
      intl,
    } = this.props;
    const { showDeleteConfirmation } = this.state;

    const {
      hasLoaded,
      marcFieldProtectionFields,
      record: mappingProfile,
    } = this.mappingProfileData;

    if (!mappingProfile || !hasLoaded) {
      return (
        <Spinner
          data-test-mapping-profile-details
          entity={this}
          style={{ position: 'absolute' }}
        />
      );
    }

    const {
      id,
      name,
      incomingRecordType,
      existingRecordType,
      mappingDetails,
      mappingDetails: { marcMappingOption = '' } = {},
      marcFieldProtectionSettings: mappingMarcFieldProtectionFields,
    } = mappingProfile;

    const associations = [
      ...mappingProfile.parentProfiles,
      ...mappingProfile.childProfiles,
    ];

    const isMARCRecord = isMARCType(existingRecordType);

    const marcMappingOptionLabel = FIELD_MAPPINGS_FOR_MARC_OPTIONS.find(option => option.value === marcMappingOption)?.label;

    const MARCBibDetailsProps = {
      marcMappingDetails: mappingDetails?.marcMappingDetails || [],
      marcMappingOption,
      marcFieldProtectionFields,
      mappingMarcFieldProtectionFields,
      folioRecordType: existingRecordType,
    };

    const mappingFields = mappingDetails?.mappingFields || [];

    const renderDetails = {
      INSTANCE: <MappingInstanceDetails mappingDetails={mappingFields} />,
      HOLDINGS: <MappingHoldingsDetails mappingDetails={mappingFields} />,
      ITEM: <MappingItemDetails mappingDetails={mappingFields} />,
      INVOICE: <MappingInvoiceDetails mappingDetails={mappingFields} />,
      MARC_BIBLIOGRAPHIC: <MappingMARCBibDetails {...MARCBibDetailsProps} />,
      MARC_AUTHORITY: <MappingMARCAuthorityDetails {...MARCBibDetailsProps} />,
      ORDER: <MappingOrderDetails mappingDetails={mappingFields} />,
    };

    return (
      <DetailsKeyShortcutsWrapper
        history={history}
        location={location}
        recordId={id}
        baseUrl={BASE_URLS.MAPPING_PROFILE}
      >
        <FullScreenView
          data-test-mapping-profile-details
          contentLabel="Mapping profile details"
          renderHeader={this.renderPaneHeader}
          centerContent={false}
        >
          <TitleManager
            prefix={`${intl.formatMessage({ id: 'ui-data-import.settings.dataImport.title' })} - `}
            page={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfiles.title' })}
            record={name}
          />
          <Headline
            className={sharedCss.headline}
            data-test-headline
            size="xx-large"
            tag="h2"
          >
            {name}
          </Headline>
          <AccordionStatus ref={accordionStatusRef}>
            <AccordionSet>
              <Accordion
                id="view-summary"
                label={<FormattedMessage id="ui-data-import.summary" />}
              >
                <ViewMetaData
                  metadata={mappingProfile.metadata}
                  systemId={SYSTEM_USER_ID}
                  systemUser={SYSTEM_USER_NAME}
                />
                <div data-test-name-field>
                  <KeyValue
                    value={name}
                    label={<FormattedMessage id="ui-data-import.name" />}
                  />
                </div>
                <KeyValue label={<FormattedMessage id="ui-data-import.incomingRecordType" />}>
                  <div data-test-incoming-record-type>
                    <FormattedMessage id={INCOMING_RECORD_TYPES[incomingRecordType].captionId} />
                  </div>
                </KeyValue>
                <KeyValue label={<FormattedMessage id="ui-data-import.folioRecordType" />}>
                  <div data-test-folio-record-type>
                    <FormattedMessage id={FOLIO_RECORD_TYPES[existingRecordType].captionId} />
                  </div>
                </KeyValue>
                {isMARCRecord && (
                  <KeyValue label={<FormattedMessage id="ui-data-import.fieldMappingsForMarc" />}>
                    <div data-test-field-mapping-for-marc-field>
                      {marcMappingOptionLabel
                        ? <FormattedMessage id={marcMappingOptionLabel} />
                        : <NoValue />}
                    </div>
                  </KeyValue>
                )}
                <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
                  <div data-test-description>{mappingProfile.description || <NoValue />}</div>
                </KeyValue>
              </Accordion>
              {tagsEnabled && (
                <div data-test-tags-accordion>
                  <TagsAccordion
                    link={`data-import-profiles/mappingProfiles/${id}`}
                    getEntity={getEntity}
                    getEntityTags={getEntityTags}
                    entityTagsPath="profile.tags"
                    renderForbidden={!tagsEnabled}
                  />
                </div>
              )}
              <Accordion
                id="view-mapping-profile-details"
                label={<FormattedMessage id="ui-data-import.details" />}
                separator={false}
              >
                {existingRecordType && (
                  <AccordionStatus>
                    <Row
                      between="xs"
                      style={{ margin: 0 }}
                    >
                      {!isMARCRecord && (
                        <>
                          <Col>
                            <MappedHeader
                              headersToSeparate={[
                                'ui-data-import.settings.profiles.select.mappingProfiles',
                                MAPPING_DETAILS_HEADLINE[existingRecordType]?.labelId,
                                marcMappingOptionLabel,
                              ]}
                              headlineProps={{ margin: 'small' }}
                            />
                          </Col>
                          <Col>
                            <div data-test-expand-all-button>
                              <ExpandAllButton />
                            </div>
                          </Col>
                        </>
                      )}
                    </Row>
                    {renderDetails[existingRecordType]}
                  </AccordionStatus>
                )}
              </Accordion>
              <Accordion
                id="view-mappingProfileFormAssociatedActionProfileAccordion"
                label={<FormattedMessage id="ui-data-import.settings.associatedActionProfiles" />}
              >
                <ProfileAssociator
                  entityKey={ENTITY_KEYS.ACTION_PROFILES}
                  namespaceKey="AAP"
                  parentId={id}
                  parentType={PROFILE_TYPES.MAPPING_PROFILE}
                  masterType={PROFILE_TYPES.ACTION_PROFILE}
                  detailType={PROFILE_TYPES.MAPPING_PROFILE}
                  profileType={ENTITY_KEYS.MAPPING_PROFILES}
                  profileName={name}
                  contentData={associations}
                  hasLoaded={hasLoaded}
                  record={mappingProfile}
                  isMultiSelect
                  isMultiLink={false}
                />
              </Accordion>
            </AccordionSet>
          </AccordionStatus>
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
                values={{ name }}
              />
              )}
            message={<FormattedMessage id="ui-data-import.modal.mappingProfile.delete.message" />}
            confirmLabel={<FormattedMessage id="ui-data-import.delete" />}
            cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
            onConfirm={() => this.handleDelete(mappingProfile)}
            onCancel={this.hideDeleteConfirmation}
          />
        </FullScreenView>
      </DetailsKeyShortcutsWrapper>
    );
  }
}
