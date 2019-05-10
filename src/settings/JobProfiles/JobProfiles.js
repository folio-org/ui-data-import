import React, {
  Component,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {
  get,
  omit,
} from 'lodash';

import {
  IntlConsumer,
  stripesConnect,
} from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';
import {
  Icon,
  Button,
  Checkbox,
} from '@folio/stripes/components';

import {
  JobProfilesForm,
  SearchAndSort,
} from '../../components';
import { ViewJobProfile } from './ViewJobProfile';
import { SettingPage } from '../SettingPage';
import { resultsFormatter } from './resultsFormatter';
import { LAYER_TYPES } from '../../utils/constants';
import { createLayerURL } from '../../utils';

import sharedCss from '../../shared.css';

// big numbers to get rid of infinite scroll
const INITIAL_RESULT_COUNT = 5000;
const RESULT_COUNT_INCREMENT = 5000;

const mapStateToProps = state => {
  const {
    hasLoaded = false,
    records: [record = {}] = [],
  } = get(state, 'folio_data_import_job_profile', {});
  const selectedJobProfile = {
    hasLoaded,
    record: omit(record, 'metadata', 'userInfo'),
  };

  return { selectedJobProfile };
};

@stripesConnect
@connect(mapStateToProps)
export class JobProfiles extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    jobProfiles: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: 'jobProfiles',
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/jobProfiles',
      clientGeneratePk: false,
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(name="%{query.query}*" OR tags.tagList="%{query.query}*")',
            {
              name: 'name',
              updated: 'metadata.updatedDate',
              tags: 'tags.tagList',
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
      jobProfiles: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.node.isRequired,
    selectedJobProfile: PropTypes.object.isRequired,
    showSingleResult: PropTypes.bool,
  };

  static defaultProps = { showSingleResult: true };

  state = { selectedRecords: new Set() };

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

  defaultNewRecordInitialValues = {
    name: '',
    description: '',
    dataType: '',
  };

  getDeleteRecordSuccessfulMessage(record) {
    return (
      <FormattedMessage
        id="ui-data-import.settings.jobProfiles.action.success"
        values={{
          name: record.name,
          action: (
            <strong>
              <FormattedMessage id="ui-data-import.deleted" />
            </strong>
          ),
        }}
      />
    );
  }

  getDeleteRecordErrorMessage(record) {
    return (
      <FormattedMessage
        id="ui-data-import.settings.jobProfiles.action.error"
        values={{
          name: record.name,
          action: (
            <strong>
              <FormattedMessage id="ui-data-import.deleted" />
            </strong>
          ),
        }}
      />
    );
  }

  renderActionMenu = menu => {
    const { location } = this.props;
    const { selectedRecords: { size: selectedRecordsSize } } = this.state;

    return (
      <Fragment>
        <Button
          data-test-new-job-profile-menu-button
          to={createLayerURL(location, LAYER_TYPES.CREATE)}
          buttonStyle="dropdownItem"
          buttonClass={sharedCss.linkButton}
          onClick={menu.onToggle}
        >
          <Icon icon="plus-sign">
            <FormattedMessage id="ui-data-import.settings.jobProfiles.newJob" />
          </Icon>
        </Button>
        <Button
          data-test-export-selected-job-profiles-menu-button
          buttonStyle="dropdownItem"
          disabled={!selectedRecordsSize}
          onClick={menu.onToggle}
        >
          <Icon icon="arrow-down">
            <FormattedMessage id="ui-data-import.exportSelected" />
            {!!selectedRecordsSize && (
            <Fragment>
              {' '}
              <FormattedMessage
                id="ui-data-import.itemsCount"
                values={{ count: selectedRecordsSize }}
              />
            </Fragment>
            )}
          </Icon>
        </Button>
        <Button
          data-test-select-all-job-profiles-menu-button
          buttonStyle="dropdownItem"
          onClick={() => this.handleSelectAllButton(menu)}
        >
          <Icon icon="select-all">
            <FormattedMessage id="ui-data-import.selectAll" />
          </Icon>
        </Button>
        <Button
          data-test-deselect-all-job-profiles-menu-button
          buttonStyle="dropdownItem"
          onClick={() => this.handleDeselectAllButton(menu)}
        >
          <Icon icon="deselect-all">
            <FormattedMessage id="ui-data-import.deselectAll" />
          </Icon>
        </Button>
      </Fragment>
    );
  };

  getRecordName(record) {
    return record.name;
  }

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
    const selectedRecords = new Set(this.jobProfiles.map(({ id }) => id));

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

  get jobProfiles() {
    const { resources } = this.props;

    return get(resources, ['jobProfiles', 'records'], []);
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
      selectedJobProfile,
    } = this.props;
    const { selectedRecords } = this.state;

    const urlQuery = queryString.parse(search);
    const searchTerm = (urlQuery.query || '').trim();
    const isSelectAllChecked = selectedRecords.size === this.jobProfiles.length;

    return (
      <IntlConsumer>
        {intl => (
          <SettingPage
            finishedResourceName="jobProfiles"
            parentMutator={mutator}
            location={location}
            history={history}
            match={match}
            getRecordName={this.getRecordName}
            getDeleteRecordSuccessfulMessage={this.getDeleteRecordSuccessfulMessage}
            getDeleteRecordErrorMessage={this.getDeleteRecordErrorMessage}
          >
            {props => (
              <SearchAndSort
                objectName="job-profiles"
                parentResources={resources}
                parentMutator={mutator}
                initialResultCount={INITIAL_RESULT_COUNT}
                resultCountIncrement={RESULT_COUNT_INCREMENT}
                searchLabelKey="ui-data-import.settings.jobProfiles.title"
                resultCountMessageKey="ui-data-import.settings.jobProfiles.count"
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
                      onClick={e => e.stopPropagation()}
                    >
                      <Checkbox
                        name="selected-all"
                        checked={isSelectAllChecked}
                        onChange={this.handleSelectAllCheckbox}
                      />
                    </div>
                  ),
                  name: intl.formatMessage({ id: 'ui-data-import.name' }),
                  tags: intl.formatMessage({ id: 'ui-data-import.tags' }),
                  updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                  updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                }}
                columnWidths={this.columnWidths}
                ViewRecordComponent={ViewJobProfile}
                EditRecordComponent={JobProfilesForm}
                newRecordInitialValues={this.defaultNewRecordInitialValues}
                editRecordInitialValues={selectedJobProfile.record}
                editRecordInitialValuesAreLoaded={selectedJobProfile.hasLoaded}
                showSingleResult={showSingleResult}
                onSubmitSearch={this.deselectAllRecords}
                {...props}
              />
            )}
          </SettingPage>
        )}
      </IntlConsumer>
    );
  }
}
