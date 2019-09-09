import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { MultiColumnList } from '@folio/stripes/components';

import { Preloader } from '../Preloader';
import { withJobLogsSort } from './withJobLogsSort';
import { withJobLogsCellsFormatter } from './withJobLogsCellsFormatter';
import { jobLogPropTypes } from './jobLogPropTypes';

@withJobLogsCellsFormatter
@withJobLogsSort
export class JobLogs extends Component {
  static propTypes = {
    formatter: PropTypes.object.isRequired,
    sortField: PropTypes.string.isRequired,
    sortDirection: PropTypes.string.isRequired,
    onSort: PropTypes.func.isRequired,
    hasLoaded: PropTypes.bool,
    contentData: PropTypes.arrayOf(jobLogPropTypes),
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  };

  static defaultProps = {
    contentData: [],
    hasLoaded: false,
  };

  columnMapping = {
    fileName: <FormattedMessage id="ui-data-import.fileName" />,
    jobProfileName: <FormattedMessage id="ui-data-import.jobProfileName" />,
    jobExecutionHrId: <FormattedMessage id="ui-data-import.jobExecutionHrId" />,
    completedDate: <FormattedMessage id="ui-data-import.jobCompletedDate" />,
    runBy: <FormattedMessage id="ui-data-import.runBy" />,
  };

  visibleColumns = [
    'fileName',
    'jobProfileName',
    'jobExecutionHrId',
    'completedDate',
    'runBy',
  ];

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
        formatter={formatter}
        sortOrder={sortField}
        sortDirection={sortDirection}
        autosize
        onHeaderClick={onSort}
      />
    );
  }
}
