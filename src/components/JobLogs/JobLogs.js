import React, { Component } from 'react';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import { MultiColumnList } from '@folio/stripes/components';

import { Preloader } from '../Preloader';
import { withJobLogsCellsFormatter } from './withJobLogsCellsFormatter';
import { withJobLogsSort } from './withJobLogsSort';
import { jobLogPropTypes } from './jobLogPropTypes';

@withJobLogsCellsFormatter
@withJobLogsSort
export class JobLogs extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    sortField: PropTypes.string.isRequired,
    sortDirection: PropTypes.string.isRequired,
    formatter: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    hasLoaded: PropTypes.bool,
    contentData: PropTypes.arrayOf(jobLogPropTypes),
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  };

  static defaultProps = {
    contentData: [],
    hasLoaded: false,
  };

  constructor(props) {
    super(props);

    const { intl: { formatMessage } } = this.props;

    this.columnMapping = {
      fileName: formatMessage({ id: 'ui-data-import.fileName' }),
      log: '',
      jobProfileName: formatMessage({ id: 'ui-data-import.jobProfileName' }),
      jobExecutionHrId: formatMessage({ id: 'ui-data-import.jobExecutionHrId' }),
      completedDate: formatMessage({ id: 'ui-data-import.jobCompletedDate' }),
      runBy: formatMessage({ id: 'ui-data-import.runBy' }),
    };

    this.visibleColumns = [
      'fileName',
      'log',
      'jobProfileName',
      'jobExecutionHrId',
      'completedDate',
      'runBy',
    ];

    this.columnWidths = { log: 80 };
  }

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
        columnWidths={this.columnWidths}
      />
    );
  }
}
