import React, { Component } from 'react';
import {
  intlShape,
  injectIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import { MultiColumnList } from '@folio/stripes/components';

import { Preloader } from '../Preloader';
import { withJobLogsSort } from './withJobLogsSort';
import { withJobLogsCellsFormatter } from './withJobLogsCellsFormatter';
import { jobLogPropTypes } from './jobLogPropTypes';

@withJobLogsCellsFormatter
@withJobLogsSort
@injectIntl
export class JobLogs extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
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

  constructor(props) {
    super(props);

    const { intl: { formatMessage } } = this.props;

    this.columnMapping = {
      fileName: formatMessage({ id: 'ui-data-import.fileName' }),
      jobProfileName: formatMessage({ id: 'ui-data-import.jobProfileName' }),
      jobExecutionHrId: formatMessage({ id: 'ui-data-import.jobExecutionHrId' }),
      completedDate: formatMessage({ id: 'ui-data-import.jobCompletedDate' }),
      runBy: formatMessage({ id: 'ui-data-import.runBy' }),
    };

    this.visibleColumns = [
      'fileName',
      'jobProfileName',
      'jobExecutionHrId',
      'completedDate',
      'runBy',
    ];

    this.columnWidths = { fileName: 230 };
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
