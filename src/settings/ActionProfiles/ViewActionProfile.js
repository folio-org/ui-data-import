import React, {
  Component,
  Fragment,
} from 'react';
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
  Button,
  Checkbox,
  Headline,
  KeyValue,
  Accordion,
  SearchField,
  AccordionSet,
  MultiColumnList,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  ViewMetaData,
  SearchAndSortQuery,
} from '@folio/stripes/smart-components';

import {
  createUrl,
  createLayerURL,
  withCheckboxList,
  checkboxListShape,
} from '../../utils';
import {
  LAYER_TYPES,
  ENTITY_KEYS,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
} from '../../utils/constants';
import {
  Spinner,
  EndOfItem,
  ActionMenu,
  listTemplate,
  createAssociatedJobProfilesFormatter,
} from '../../components';
import { LastMenu } from '../../components/ActionMenu/ItemTemplates/LastMenu';

import searchAndSortCss from '../../components/SearchAndSort/SearchAndSort.css';
import sharedCss from '../../shared.css';

@withCheckboxList
@stripesConnect
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
          detailType: 'MAPPING_PROFILE',
          masterType: 'ACTION_PROFILE',
          limit: 1,
        },
        false,
      ),
      throwErrors: false,
    },
    associatedJobProfiles: {
      type: 'okapi',
      path: createUrl(
        'data-import-profiles/profileAssociations/:{id}/masters',
        {
          detailType: 'ACTION_PROFILE',
          masterType: 'JOB_PROFILE',
          query: 'cql.allRecords=1 sortBy name/ascending',
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
    checkboxList: checkboxListShape.isRequired,
    setList: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    paneId: PropTypes.string,
  };

  static defaultProps = { paneId: 'pane-action-profile-details' };

  state = {
    deletionInProgress: false,
    showDeleteConfirmation: false,
  };

  componentDidMount() {
    this.setList();
  }

  componentDidUpdate(prevProps) {
    const { resources } = this.props;

    if (prevProps.resources !== resources) {
      this.setList();
    }
  }

  entityKey = ENTITY_KEYS.ACTION_PROFILES;

  actionMenuItems = [
    'edit',
    'duplicate',
    'delete',
  ];

  associatedJobProfilesVisibleColumns = [
    'selected',
    'name',
    'tags',
    'updated',
    'updatedBy',
  ];

  associatedMappingProfileVisibleColumns = [
    'name',
    'tags',
    'updated',
    'updatedBy',
  ];

  columnWidths = {
    selected: 40,
    name: 200,
    tags: 150,
    updated: 150,
    updatedBy: 250,
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

  get associatedMappingProfileData() {
    const associatedMappingProfile = get(
      this.props,
      ['resources', 'associatedMappingProfile', 'records', 0, 'childSnapshotWrappers'],
      []
    ).map(({ content }) => content);

    return { associatedMappingProfile };
  }

  get associatedJobProfilesData() {
    const { resources } = this.props;

    const associatedJobProfilesResource = resources.associatedJobProfiles || {};

    const associatedJobProfiles = get(
      associatedJobProfilesResource,
      ['records', 0, 'childSnapshotWrappers'],
      []
    ).map(({ content }) => content);

    return {
      hasLoaded: associatedJobProfilesResource.hasLoaded,
      associatedJobProfiles,
    };
  }

  setList() {
    const { setList } = this.props;

    const { associatedJobProfiles } = this.associatedJobProfilesData;

    setList(associatedJobProfiles);
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
      checkboxList: {
        isAllSelected,
        handleSelectAllCheckbox,
        selectRecord,
        selectedRecords,
      },
    } = this.props;
    const { showDeleteConfirmation } = this.state;

    const {
      hasLoaded,
      record: actionProfile,
    } = this.actionProfileData;

    const {
      hasLoaded: associatedJobProfilesDataHasLoaded,
      associatedJobProfiles,
    } = this.associatedJobProfilesData;

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
          <Accordion label={<FormattedMessage id="ui-data-import.details" />}>
            <div style={{ height: 60 }}>{/* will be implemented in future stories */}</div>
          </Accordion>
          <Accordion label={<FormattedMessage id="ui-data-import.settings.associatedMappingProfile" />}>
            <div data-test-associated-mapping-profile>
              <IntlConsumer>
                {intl => (
                  <MultiColumnList
                    id="associated-mapping-profile"
                    visibleColumns={this.associatedMappingProfileVisibleColumns}
                    contentData={associatedMappingProfile}
                    columnMapping={{
                      name: intl.formatMessage({ id: 'ui-data-import.name' }),
                      tags: intl.formatMessage({ id: 'ui-data-import.tags' }),
                      updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                      updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                    }}
                    columnWidths={this.columnWidths}
                    isEmptyMessage={<FormattedMessage id="ui-data-import.none" />}
                    formatter={listTemplate({ entityKey: ENTITY_KEYS.MAPPING_PROFILES })}
                  />
                )}
              </IntlConsumer>
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
            <div data-test-associated-job-profiles>
              <SearchAndSortQuery initialSearchState={{ query: '' }}>
                {({ searchValue }) => (
                  <Fragment>
                    <form onSubmit={e => e.preventDefault()}>
                      <div className={searchAndSortCss.searchWrap}>
                        <div className={searchAndSortCss.searchFiledWrap}>
                          <SearchField
                            id="input-associated-job-profiles-search"
                            clearSearchId="input-associated-job-profiles-clear-search-button"
                            loading={!associatedJobProfilesDataHasLoaded}
                            value=""
                            marginBottom0
                          />
                        </div>
                        <div className={searchAndSortCss.searchButtonWrap}>
                          <Button
                            data-test-search-and-sort-submit
                            type="submit"
                            buttonStyle="primary"
                            fullWidth
                            marginBottom0
                          >
                            <FormattedMessage id="stripes-smart-components.search" />
                          </Button>
                        </div>
                      </div>
                    </form>
                    <IntlConsumer>
                      {intl => (
                        <MultiColumnList
                          id="associated-job-profiles-list"
                          visibleColumns={this.associatedJobProfilesVisibleColumns}
                          contentData={associatedJobProfiles}
                          columnMapping={{
                            selected: (
                              <div // eslint-disable-line jsx-a11y/click-events-have-key-events
                                role="button"
                                tabIndex="0"
                                className={sharedCss.selectableCellButton}
                                data-test-select-all-associated-job-profiles-checkbox
                                onClick={e => e.stopPropagation()}
                              >
                                <Checkbox
                                  name="selected-all"
                                  checked={isAllSelected}
                                  onChange={handleSelectAllCheckbox}
                                />
                              </div>
                            ),
                            name: intl.formatMessage({ id: 'ui-data-import.name' }),
                            tags: intl.formatMessage({ id: 'ui-data-import.tags' }),
                            updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                            updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                          }}
                          columnWidths={this.columnWidths}
                          formatter={createAssociatedJobProfilesFormatter({
                            searchTerm: searchValue.query,
                            selectRecord,
                            selectedRecords,
                          })}
                        />
                      )}
                    </IntlConsumer>
                  </Fragment>
                )}
              </SearchAndSortQuery>
            </div>
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
