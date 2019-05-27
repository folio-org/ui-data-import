import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import {
  get,
  omit,
  noop,
} from 'lodash';

import {
  IntlConsumer,
  stripesConnect,
} from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';
import { Checkbox } from '@folio/stripes/components';

import {
  trimSearchTerm,
  withCheckboxList,
  checkboxListShape,
} from '../../utils';
import { ENTITY_CONFIGS } from '../../utils/constants';
import {
  ActionMenu,
  ACTION_MENU_CONTROLS,
  SearchAndSort,
  MatchProfilesForm,
  listTemplate,
} from '../../components';
import { ViewMatchProfile } from './ViewMatchProfile';
import { SettingPage } from '../SettingPage';

import sharedCss from '../../shared.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const findAllQueryParameter = 'cql.allRecords=1';
const queryTemplate = `(
  name="%{query.query}*" OR
  existingRecordType="%{query.query}*" OR
  field="%{query.query}*" OR
  fieldMarc="%{query.query}*" OR
  fieldNonMarc="%{query.query}*" OR
  existingStaticValueType="%{query.query}*" OR
  tags.tagList="%{query.query}*"
)`;

const mapStateToProps = state => {
  const {
    hasLoaded = false,
    records: [record = {}] = [],
  } = get(state, 'folio_data_import_match_profile', {});
  const selectedMatchProfile = {
    hasLoaded,
    record: omit(record, 'metadata', 'userInfo'),
  };

  return { selectedMatchProfile };
};

@withCheckboxList
@stripesConnect
@connect(mapStateToProps)
export class MatchProfiles extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    matchProfiles: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: 'matchProfiles',
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/matchProfiles',
      clientGeneratePk: false,
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            findAllQueryParameter,
            queryTemplate,
            {
              name: 'name',
              match: 'existingRecordType field fieldMarc fieldNonMarc existingStaticValueType',
              tags: 'tags.tagList',
              updated: 'metadata.updatedDate',
              updatedBy: 'userInfo.firstName userInfo.lastName userInfo.userName',
            },
            [],
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      matchProfiles: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    label: PropTypes.node.isRequired,
    selectedMatchProfile: PropTypes.object.isRequired,
    checkboxList: checkboxListShape.isRequired,
    setList: PropTypes.func.isRequired,
    showSingleResult: PropTypes.bool,
  };

  static defaultProps = { showSingleResult: true };

  componentDidMount() {
    this.setList();
  }

  componentDidUpdate(prevProps) {
    const { resources } = this.props;

    if (prevProps.resources !== resources) {
      this.setList();
    }
  }

  setList() {
    const { setList } = this.props;

    setList(this.matchProfiles);
  }

  visibleColumns = [
    'selected',
    'name',
    'match',
    'tags',
    'updated',
    'updatedBy',
  ];

  columnWidths = {
    selected: 40,
    name: 200,
    match: 350,
    tags: 150,
    updated: 150,
    updatedBy: 250,
  };

  defaultNewRecordInitialValues = {
    name: '',
    description: '',
    /* TODO: these values are hardcoded now and will need to be changed in future (https://issues.folio.org/browse/UIDATIMP-175) */
    incomingRecordType: 'MARC',
    existingRecordType: 'HOLDINGS',
    incomingDataValueType: 'STATIC_VALUE',
  };

  renderActionMenu = menu => {
    const {
      location,
      checkboxList: { selectedRecords: { size: selectedRecordsSize } },
    } = this.props;

    const config = {
      items: [{
        control: ACTION_MENU_CONTROLS.ADD_NEW,
        caption: 'ui-data-import.settings.matchProfiles.newProfile',
        menu,
        location,
      }, {
        control: ACTION_MENU_CONTROLS.EXPORT_SELECTED,
        menu,
        selectedCount: selectedRecordsSize,
      }, {
        control: ACTION_MENU_CONTROLS.DEFAULT,
        caption: 'ui-data-import.selectAll',
        icon: 'check-circle',
        onClick: () => this.handleSelectAllButton(menu),
        dataAttributes: { 'data-test-select-all-items-menu-button': '' },
      }, {
        control: ACTION_MENU_CONTROLS.DEFAULT,
        caption: 'ui-data-import.deselectAll',
        icon: 'times-circle',
        onClick: () => this.handleDeselectAllButton(menu),
        dataAttributes: { 'data-test-deselect-all-items-menu-button': '' },
      }],
    };

    return <ActionMenu config={config} />;
  };

  handleSelectAllButton = menu => {
    const { checkboxList: { selectAll } } = this.props;

    menu.onToggle();
    selectAll();
  };

  handleDeselectAllButton = menu => {
    const { checkboxList: { deselectAll } } = this.props;

    menu.onToggle();
    deselectAll();
  };

  get matchProfiles() {
    return get(this.props.resources, ['matchProfiles', 'records'], []);
  }

  getRecordName(record) {
    return record.name;
  }

  render() {
    const {
      resources,
      mutator,
      location: { search },
      label,
      location,
      history,
      match,
      showSingleResult,
      selectedMatchProfile,
      checkboxList: {
        selectedRecords,
        isAllSelected,
        selectRecord,
        deselectAll,
        handleSelectAllCheckbox,
      },
    } = this.props;

    const urlQuery = queryString.parse(search);
    const searchTerm = trimSearchTerm(urlQuery.query);
    const { ENTITY_KEY } = ENTITY_CONFIGS.MATCH_PROFILES;

    return (
      <IntlConsumer>
        {intl => (
          <SettingPage
            finishedResourceName="matchProfiles"
            parentMutator={mutator}
            location={location}
            history={history}
            match={match}
            getRecordName={this.getRecordName}
            getDeleteRecordSuccessfulMessage={noop}
            getDeleteRecordErrorMessage={noop}
            onDelete={({ id }) => selectRecord(id)}
          >
            {props => (
              <SearchAndSort
                objectName="match-profiles"
                parentResources={resources}
                parentMutator={mutator}
                initialResultCount={INITIAL_RESULT_COUNT}
                resultCountIncrement={RESULT_COUNT_INCREMENT}
                searchLabelKey="ui-data-import.settings.matchProfiles.title"
                resultCountMessageKey="ui-data-import.settings.matchProfiles.count"
                resultsLabel={label}
                defaultSort="name"
                actionMenu={this.renderActionMenu}
                resultsFormatter={listTemplate(ENTITY_KEY, searchTerm, selectRecord, selectedRecords)}
                visibleColumns={this.visibleColumns}
                columnMapping={{
                  selected: (
                    <div // eslint-disable-line jsx-a11y/click-events-have-key-events
                      role="button"
                      tabIndex="0"
                      className={sharedCss.selectableCellButton}
                      data-test-select-all-checkbox
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
                  match: intl.formatMessage({ id: 'ui-data-import.match' }),
                  tags: intl.formatMessage({ id: 'ui-data-import.tags' }),
                  updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                  updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                }}
                columnWidths={this.columnWidths}
                ViewRecordComponent={ViewMatchProfile}
                EditRecordComponent={MatchProfilesForm}
                newRecordInitialValues={this.defaultNewRecordInitialValues}
                editRecordInitialValues={selectedMatchProfile.record}
                editRecordInitialValuesAreLoaded={selectedMatchProfile.hasLoaded}
                showSingleResult={showSingleResult}
                onSubmitSearch={deselectAll}
                {...props}
              />
            )}
          </SettingPage>
        )}
      </IntlConsumer>
    );
  }
}
