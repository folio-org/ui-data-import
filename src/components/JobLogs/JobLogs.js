import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import Preloader from '../Preloader';
import withJobLogsCellsFormatter from './withJobLogsCellsFormatter';
import withJobLogsSort from './withJobLogsSort';
import compose from '../../utils/compose';

class JobLogs extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    sortField: PropTypes.string.isRequired,
    sortDirection: PropTypes.string.isRequired,
    formatter: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    hasLoaded: PropTypes.bool.isRequired,
    contentData: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        jobProfileName: PropTypes.string,
        jobExecutionHrId: PropTypes.string,
        completedDate: PropTypes.string,
        runBy: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
        }),
      }),
    ),
  };

  static defaultProps = {
    contentData: [],
  };

  constructor(props) {
    super(props);

    const { intl: { formatMessage } } = this.props;

    this.columnMapping = {
      fileName: formatMessage({ id: 'ui-data-import.jobFileName' }),
      jobProfileName: formatMessage({ id: 'ui-data-import.jobProfileName' }),
      jobExecutionHrId: formatMessage({ id: 'ui-data-import.jobExecutionHrId' }),
      completedDate: formatMessage({ id: 'ui-data-import.jobCompletedDate' }),
      runBy: formatMessage({ id: 'ui-data-import.jobRunBy' }),
    };

    this.visibleColumns = [
      'fileName',
      'jobProfileName',
      'jobExecutionHrId',
      'completedDate',
      'runBy',
    ];
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

    if (hasLoaded) {
      return (
        <MultiColumnList
          contentData={contentData}
          columnMapping={this.columnMapping}
          visibleColumns={this.visibleColumns}
          formatter={formatter}
          sortOrder={this.columnMapping[sortField]}
          sortDirection={sortDirection}
          autosize
          onHeaderClick={onSort}
        />
      );
    }

    return <Preloader />;
  }
}

export default compose(
  withJobLogsCellsFormatter,
  withJobLogsSort,
)(JobLogs);
