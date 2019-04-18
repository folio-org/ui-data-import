import React, {
  Component,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { noop } from 'lodash';

import {
  IntlConsumer,
  stripesConnect,
} from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';
import { Checkbox } from '@folio/stripes/components';

import {
  JobProfilesForm,
  SearchAndSort,
} from '../../components';
import { ViewJobProfile } from './ViewJobProfile';
import { SettingPage } from '../SettingPage';
import { resultsFormatter } from './resultsFormatter';

import sharedCss from '../../shared.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

@stripesConnect
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
    showSingleResult: PropTypes.bool,
  };

  static defaultProps = { showSingleResult: true };

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

  getRecordName(record) {
    return record.name;
  }

  render() {
    const {
      resources,
      mutator,
      location: { search },
      label,
      showSingleResult,
      location,
      history,
      match,
    } = this.props;

    const urlQuery = queryString.parse(search);
    const searchTerm = (urlQuery.query || '').trim();
    const newRecordInitialValues = {};

    return (
      <IntlConsumer>
        {intl => (
          <Fragment>
            <SettingPage
              finishedResourceName="jobProfiles"
              parentMutator={mutator}
              location={location}
              history={history}
              match={match}
              getRecordName={this.getRecordName}
              getDeleteRecordSuccessfulMessage={noop}
              getDeleteRecordErrorMessage={noop}
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
                  resultsFormatter={resultsFormatter(searchTerm)}
                  visibleColumns={this.visibleColumns}
                  columnMapping={{
                    selected: (
                      <div // eslint-disable-line jsx-a11y/click-events-have-key-events
                        role="button"
                        tabIndex="0"
                        className={sharedCss.selectableCellButton}
                        data-test-select-all
                        onClick={e => e.stopPropagation()}
                      >
                        <Checkbox name="selected-all" />
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
                  showSingleResult={showSingleResult}
                  newRecordInitialValues={newRecordInitialValues}
                  {...props}
                />
              )}
            </SettingPage>
          </Fragment>
        )}
      </IntlConsumer>
    );
  }
}
