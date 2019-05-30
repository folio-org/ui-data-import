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
} from '@folio/stripes/components';
import {
  ViewMetaData,
  SearchAndSortQuery,
} from '@folio/stripes/smart-components';

import {
  createUrl,
  sortStrings,
  createLayerURL,
  withCheckboxList,
  checkboxListShape,
} from '../../utils';
import {
  LAYER_TYPES,
  ENTITY_CONFIGS,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
} from '../../utils/constants';
import {
  Spinner,
  EndOfItem,
  ActionMenu,
  listTemplate,
} from '../../components';
import { LastMenu } from '../../components/ActionMenu/ItemTemplates/LastMenu';

import searchAndSortCss from '../../components/SearchAndSort/SearchAndSort.css';
import sharedCss from '../../shared.css';

@withCheckboxList
@stripesConnect
export class ViewMatchProfile extends Component {
  static manifest = Object.freeze({
    matchProfile: {
      type: 'okapi',
      path: 'data-import-profiles/matchProfiles/:{id}',
      throwErrors: false,
    },
    associatedJobProfiles: {
      type: 'okapi',
      path: createUrl('data-import-profiles/profileAssociations/:{id}/masters', { detailType: 'MATCH_PROFILE' }, false),
      throwErrors: false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      matchProfile: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }).isRequired }).isRequired,
    checkboxList: checkboxListShape.isRequired,
    setList: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.props = {
      ...props,
      paneId: 'pane-match-profile-details',
    };
  }

  componentDidMount() {
    this.setList();
  }

  componentDidUpdate(prevProps) {
    const { resources } = this.props;

    if (prevProps.resources !== resources) {
      this.setList();
    }
  }

  entityKey = ENTITY_CONFIGS.MATCH_PROFILES.ENTITY_KEY;

  actionMenuItems = [
    'edit',
    'duplicate',
    'delete',
  ];

  visibleColumns = [
    'selected',
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

  get matchProfileData() {
    const { resources } = this.props;

    const matchProfile = resources.matchProfile || {};
    const [record] = matchProfile.records || [];

    return {
      hasLoaded: matchProfile.hasLoaded,
      record,
    };
  }

  /** TODO: apply required changes after MODDICONV-55 (https://issues.folio.org/browse/MODDICONV-55) will be done */
  get associatedJobProfilesData() {
    const { resources } = this.props;

    const associatedJobProfileResource = resources.associatedJobProfiles || {};
    const [{ childSnapshotWrappers = [] } = {}] = associatedJobProfileResource.records || [];

    const associatedJobProfiles = childSnapshotWrappers
      .filter(({ contentType }) => contentType === 'JOB_PROFILE')
      .map(({ content }) => content)
      .sort((a, b) => sortStrings(a.name, b.name));

    return {
      hasLoaded: associatedJobProfileResource.hasLoaded,
      associatedJobProfiles,
    };
  }

  setList() {
    const { setList } = this.props;

    const { associatedJobProfiles } = this.associatedJobProfilesData;

    setList(associatedJobProfiles);
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
      dataAttributes={{ 'data-test-edit-match-profile-button': '' }}
    />
  );

  createFormatter(searchTerm) {
    const {
      checkboxList: {
        selectRecord,
        selectedRecords,
      },
    } = this.props;

    const { ENTITY_KEY: JOB_PROFILE_ENTITY_KEY } = ENTITY_CONFIGS.JOB_PROFILES;
    const formatter = listTemplate({
      entityKey: JOB_PROFILE_ENTITY_KEY,
      searchTerm,
      selectRecord,
      selectedRecords,
    });

    return {
      ...formatter,
      name: record => (
        <Button
          data-test-job-profile-link
          buttonStyle="link"
          marginBottom0
          to={`/settings/data-import/job-profiles/view/${record.id}`}
          buttonClass={sharedCss.cellLink}
        >
          {formatter.name(record)}
        </Button>
      ),
    };
  }

  render() {
    const {
      onClose,
      checkboxList: {
        isAllSelected,
        handleSelectAllCheckbox,
      },
    } = this.props;

    const {
      hasLoaded,
      record: matchProfile,
    } = this.matchProfileData;

    const {
      hasLoaded: associatedJobProfilesDataHasLoaded,
      associatedJobProfiles,
    } = this.associatedJobProfilesData;

    if (!matchProfile || !hasLoaded) {
      return <Spinner entity={this} />;
    }

    const paneTitle = (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="matchProfiles"
      >
        {matchProfile.name}
      </AppIcon>
    );

    // start
    // MatchProfiles sample data does not contain user Ids because of back-end limitations
    // and therefore it is required to add it manually on UI side
    // TODO: use real IDs when sample data will be removed (remove code from start to end)
    const userId = get(this.props, ['stripes', 'okapi', 'currentUser', 'id'], '');

    matchProfile.metadata = {
      ...matchProfile.metadata,
      createdByUserId: matchProfile.metadata.createdByUserId || userId,
      updatedByUserId: matchProfile.metadata.updatedByUserId || userId,
    };
    // end

    return (
      <Pane
        id="pane-match-profile-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={paneTitle}
        paneSub={<FormattedMessage id="ui-data-import.matchProfileName" />}
        actionMenu={this.renderActionMenu}
        lastMenu={this.renderLastMenu(matchProfile)}
        dismissible
        onClose={onClose}
      >
        <TitleManager record={matchProfile.name} />
        <Headline
          data-test-headline
          size="xx-large"
          tag="h2"
        >
          {matchProfile.name}
        </Headline>
        <AccordionSet>
          <Accordion label={<FormattedMessage id="ui-data-import.summary" />}>
            <ViewMetaData
              metadata={matchProfile.metadata}
              systemId={SYSTEM_USER_ID}
              systemUser={SYSTEM_USER_NAME}
            />
            <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
              <div data-test-description>{matchProfile.description || '-'}</div>
            </KeyValue>
          </Accordion>
          <Accordion label={<FormattedMessage id="ui-data-import.details" />}>
            <div style={{ height: 60 }}>{/* will be implemented in future stories */}</div>
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-data-import.settings.matchProfiles.associatedJobProfiles" />}
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
                          visibleColumns={this.visibleColumns}
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
                          formatter={this.createFormatter(searchValue.query)}
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
      </Pane>
    );
  }
}
