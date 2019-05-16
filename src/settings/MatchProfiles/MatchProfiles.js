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

import { trimSearchTerm } from '../../utils';
import {
  ActionMenu,
  SearchAndSort,
} from '../../components';
import { ViewMatchProfile } from './ViewMatchProfile';
import { SettingPage } from '../SettingPage';
import { resultsFormatter } from './resultsFormatter';

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
    showSingleResult: PropTypes.bool,
  };

  static defaultProps = { showSingleResult: true };

  state = { selectedRecords: new Set() };

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
  };

  renderActionMenu = menu => {
    const { location } = this.props;
    const { selectedRecords: { size: selectedRecordsSize } } = this.state;

    const config = {
      items: [{
        control: 'AddNew',
        caption: 'ui-data-import.settings.matchProfiles.newProfile',
        menu,
        location,
      }, {
        control: 'ExportSelected',
        menu,
        selectedCount: selectedRecordsSize,
      }, {
        control: 'Default',
        caption: 'ui-data-import.selectAll',
        icon: 'check-circle',
        onClick: () => this.handleSelectAllButton(menu),
        dataAttributes: { 'data-test-select-all-items-menu-button': '' },
      }, {
        control: 'Default',
        caption: 'ui-data-import.deselectAll',
        icon: 'times-circle',
        onClick: () => this.handleDeselectAllButton(menu),
        dataAttributes: { 'data-test-deselect-all-items-menu-button': '' },
      }],
    };

    return (<ActionMenu config={config} />);
  };

  selectRecord = recordId => {
    this.setState(state => {
      const isRecordSelected = state.selectedRecords.has(recordId);

      if (isRecordSelected) {
        state.selectedRecords.delete(recordId);
      } else {
        state.selectedRecords.add(recordId);
      }

      return { selectedRecords: state.selectedRecords };
    });
  };

  handleSelectAllButton = menu => {
    menu.onToggle();
    this.selectAllRecords();
  };

  handleDeselectAllButton = menu => {
    menu.onToggle();
    this.deselectAllRecords();
  };

  selectAllRecords = () => {
    const selectedRecords = new Set(this.matchProfiles.map(({ id }) => id));

    this.setState({ selectedRecords });
  };

  deselectAllRecords = () => this.setState({ selectedRecords: new Set() });

  handleSelectAllCheckbox = e => {
    if (e.target.checked) {
      this.selectAllRecords();
    } else {
      this.deselectAllRecords();
    }
  };

  get matchProfiles() {
    return get(this.props.resources, ['matchProfiles', 'records'], []);
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
    } = this.props;

    const { selectedRecords } = this.state;

    const urlQuery = queryString.parse(search);
    const searchTerm = trimSearchTerm(urlQuery.query);
    const isSelectAllChecked = selectedRecords.size === this.matchProfiles.length;

    return (
      <IntlConsumer>
        {intl => (
          <SettingPage
            finishedResourceName="matchProfiles"
            parentMutator={mutator}
            location={location}
            history={history}
            match={match}
            getRecordName={noop}
            getDeleteRecordSuccessfulMessage={this.getDeleteRecordSuccessfulMessage}
            getDeleteRecordErrorMessage={this.getDeleteRecordErrorMessage}
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
                resultsFormatter={resultsFormatter(searchTerm, this.selectRecord, selectedRecords)}
                visibleColumns={this.visibleColumns}
                columnMapping={{
                  selected: (
                    <div // eslint-disable-line jsx-a11y/click-events-have-key-events
                      role="button"
                      tabIndex="0"
                      className={sharedCss.selectableCellButton}
                      data-test-select-all-checkbox
                      onChange={this.handleSelectAllCheckbox}
                    >
                      <Checkbox
                        name="selected-all"
                        checked={isSelectAllChecked}
                        onChange={this.handleSelectAllCheckbox}
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
                newRecordInitialValues={this.defaultNewRecordInitialValues}
                editRecordInitialValues={selectedMatchProfile.record}
                editRecordInitialValuesAreLoaded={selectedMatchProfile.hasLoaded}
                showSingleResult={showSingleResult}
                {...props}
              />
            )}
          </SettingPage>
        )}
      </IntlConsumer>
    );
  }
}
