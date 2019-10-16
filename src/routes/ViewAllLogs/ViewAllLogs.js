import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  FormattedMessage,
  FormattedTime,
  injectIntl,
} from 'react-intl';

import {
  makeQueryFunction,
  SearchAndSort,
} from '@folio/stripes-smart-components';
import {
  changeSearchIndex,
  getActiveFilters,
  handleFilterChange,
} from '@folio/stripes-acq-components';

import packageInfo from '@folio/data-import/package';
import { stripesConnect } from '@folio/stripes-core';
import { Button } from '@folio/stripes-components';
import { FILE_STATUSES } from '../../utils/constants';
import { Job } from '../../components/Jobs/components/Job';
import { filterConfig } from './ViewAllLogsFilterConfig';
import { logsSearchTemplate } from './ViewAllLogsSearchConfig';
import sharedCss from '../../shared.css';

const {
  COMMITTED,
  ERROR,
} = FILE_STATUSES;

const columnMapping = {
  fileName: <FormattedMessage id="ui-data-import.fileName" />,
  hrId: <FormattedMessage id="ui-data-import.jobExecutionHrId" />,
  jobProfileName: <FormattedMessage id="ui-data-import.jobProfileName" />,
  totalRecords: <FormattedMessage id="ui-data-import.records" />,
  completedDate: <FormattedMessage id="ui-data-import.jobCompletedDate" />,
  runBy: <FormattedMessage id="ui-data-import.runBy" />,
};

const visibleColumns = [
  'fileName',
  'hrId',
  'jobProfileName',
  'totalRecords',
  'completedDate',
  'runBy',
];

const INITIAL_RESULT_COUNT = 25;
const RESULT_COUNT_INCREMENT = 25;

@withRouter
@stripesConnect
class ViewAllLogs extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.object,
    disableRecordCreation: PropTypes.bool,
    showSingleResult: PropTypes.bool,
    browseOnly: PropTypes.bool,
    packageInfo: PropTypes.object,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }),
  };

  static defaultProps = {
    showSingleResult: true,
    browseOnly: false,
  };

  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: '-completedDate',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      clear: true,
      records: 'jobExecutions',
      recordsRequired: '%{resultCount}',
      path: 'metadata-provider/jobExecutions',
      perRequest: RESULT_COUNT_INCREMENT,
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            `(status any "${COMMITTED} ${ERROR}")`,
            logsSearchTemplate,
            {
              fileName: 'fileName',
              hrId: 'hrId',
              jobProfileName: 'jobProfileInfo.name',
              totalRecords: 'progress.total',
              completedDate: 'completedDate',
              runBy: 'runBy.firstName runBy.lastName',
            },
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  constructor(props) {
    super(props);
    this.getActiveFilters = getActiveFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
    this.changeSearchIndex = changeSearchIndex.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick(e, meta) {
    const path = `/data-import/log/${meta.id}`;

    window.open(path, '_blank').focus();
  }

  render() {
    const {
      browseOnly,
      disableRecordCreation,
      mutator,
      resources,
      showSingleResult,
      stripes,
    } = this.props;

    const resultsFormatter = {
      fileName: record => (
        <Button
          buttonStyle="link"
          marginBottom0
          buttonClass={sharedCss.cellLink}
          target="_blank"
        >
          {record.fileName}
        </Button>
      ),
      runBy: record => {
        const {
          runBy: {
            firstName,
            lastName,
          },
        } = record;

        return `${firstName} ${lastName}`;
      },
      completedDate: record => {
        const { completedDate } = record;

        return (
          <FormattedTime
            value={completedDate}
            day="numeric"
            month="numeric"
            year="numeric"
          />
        );
      },
      jobProfileName: record => {
        const { jobProfileInfo: { name } } = record;

        return name;
      },
      totalRecords: record => {
        const { progress: { total } } = record;

        return total;
      },
    };

    return (
      <div data-test-logs-list>
        <SearchAndSort
          packageInfo={this.props.packageInfo || packageInfo}
          objectName="job-logs"
          baseRoute={packageInfo.stripes.route}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          resultsFormatter={resultsFormatter}
          viewRecordComponent={Job}
          onSelectRow={this.onRowClick}
          viewRecordPerms="metadata-provider.jobexecutions.get"
          parentResources={resources}
          parentMutator={mutator}
          stripes={stripes}
          disableRecordCreation={disableRecordCreation}
          browseOnly={browseOnly}
          showSingleResult={showSingleResult}
          renderFilters={this.renderFilters}
          filterConfig={filterConfig}
          onFilterChange={this.handleFilterChange}
          onChangeIndex={this.changeSearchIndex}
          title={<FormattedMessage id="ui-data-import.logsPaneTitle" />}
        />
      </div>
    );
  }
}

export default injectIntl(ViewAllLogs);
