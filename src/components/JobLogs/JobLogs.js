import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { MultiColumnList } from '@folio/stripes/components';

import { Preloader } from '../Preloader';
import { withJobLogsSort } from './withJobLogsSort';
import { withJobLogsCellsFormatter } from './withJobLogsCellsFormatter';
import { jobExecutionPropTypes } from '../Jobs/components/Job/jobExecutionPropTypes';

@withJobLogsCellsFormatter
@withJobLogsSort
export class JobLogs extends Component {
  static propTypes = {
    formatter: PropTypes.object.isRequired,
    sortField: PropTypes.string.isRequired,
    sortDirection: PropTypes.string.isRequired,
    onSort: PropTypes.func.isRequired,
    hasLoaded: PropTypes.bool,
    contentData: PropTypes.arrayOf(jobExecutionPropTypes),
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  };

  static defaultProps = {
    contentData: [],
    hasLoaded: false,
  };

  columnMapping = {
    fileName: <FormattedMessage id="ui-data-import.fileName" />,
    status: <FormattedMessage id="ui-data-import.status" />,
    hrId: <FormattedMessage id="ui-data-import.jobExecutionHrId" />,
    jobProfileName: <FormattedMessage id="ui-data-import.jobProfileName" />,
    totalRecords: <FormattedMessage id="ui-data-import.records" />,
    completedDate: <FormattedMessage id="ui-data-import.jobCompletedDate" />,
    runBy: <FormattedMessage id="ui-data-import.runBy" />,
  };

  visibleColumns = [
    'fileName',
    'status',
    'totalRecords',
    'jobProfileName',
    'completedDate',
    'runBy',
    'hrId',
  ];

  columnWidths = {
    hrId: '60px',
    totalRecords: '80px',
  };

  render() {
    const {
      formatter,
      contentData,
      hasLoaded,
      sortDirection,
      sortField,
      onSort,
    } = this.props;

    if (!hasLoaded) {
      return <Preloader />;
    }

    return (
      <MultiColumnList
        id="job-logs-list"
        totalCount={contentData.length}
        contentData={contentData}
        columnMapping={this.columnMapping}
        visibleColumns={this.visibleColumns}
        columnWidths={this.columnWidths}
        formatter={formatter}
        sortOrder={sortField}
        sortDirection={sortDirection}
        autosize
        onHeaderClick={onSort}
      />
    );
  }
}
