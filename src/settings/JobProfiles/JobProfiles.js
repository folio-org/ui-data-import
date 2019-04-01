import React, {
  Component,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';

import { IntlConsumer } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';
import { Checkbox } from '@folio/stripes/components';

import { SearchAndSort } from '../../components';
import { ViewJobProfile } from './ViewJobProfile';
import { resultsFormatter } from './resultsFormatter';

import sharedCss from '../../shared.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

export class JobProfiles extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {},
    },
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
            '(name="%{query.query}*")',
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
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    label: PropTypes.node.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
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

  createFullWidthContainerRef = ref => { this.fullWidthContainer = ref; };

  render() {
    const {
      resources,
      mutator,
      label,
      showSingleResult,
    } = this.props;

    return (
      <IntlConsumer>
        {intl => (
          <Fragment>
            <div
              className={sharedCss.container}
              data-test-job-profiles
            >
              <SearchAndSort
                objectName="job-profiles"
                finishedResourceName="jobProfiles"
                parentResources={resources}
                parentMutator={mutator}
                initialResultCount={INITIAL_RESULT_COUNT}
                resultCountIncrement={RESULT_COUNT_INCREMENT}
                searchLabelKey="ui-data-import.settings.jobProfiles.title"
                resultCountMessageKey="ui-data-import.settings.jobProfiles.count"
                resultsLabel={label}
                defaultSort="name"
                resultsFormatter={resultsFormatter}
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
                fullWidthContainer={this.fullWidthContainer}
                showSingleResult={showSingleResult}
              />
            </div>
            <div
              className={sharedCss.fullWidthAndHeightContainer}
              ref={this.createFullWidthContainerRef}
            />
          </Fragment>
        )}
      </IntlConsumer>
    );
  }
}
