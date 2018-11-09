import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import qs from 'qs';
import get from 'lodash/get';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import {
  MultiColumnList,
  Icon,
} from '@folio/stripes/components';

import {
  sortNums,
  sortDates,
  sortStrings,
} from '../../utils/sort';

class JobLogs extends Component {
  static propTypes = {
    intl: intlShape,
    formatter: PropTypes.func,
    resource: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape({
        logs: PropTypes.arrayOf(PropTypes.shape({
          fileName: PropTypes.string,
          jobProfileName: PropTypes.string,
          jobExecutionHrId: PropTypes.string,
          completedDate: PropTypes.string,
          runBy: PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string,
          }),
        })),
      })),
      isPending: PropTypes.bool,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      sort: 'completedDate',
      direction: 'ascending',
    };

    const {
      formatter,
      intl: { formatMessage },
    } = props;

    this.visibleColumns = [
      'fileName',
      'jobProfileName',
      'jobExecutionHrId',
      'completedDate',
      'runBy',
    ];

    this.columnMapping = {
      fileName: formatMessage({ id: 'ui-data-import.jobFileName' }),
      jobProfileName: formatMessage({ id: 'ui-data-import.jobProfileName' }),
      jobExecutionHrId: formatMessage({ id: 'ui-data-import.jobExecutionHrId' }),
      completedDate: formatMessage({ id: 'ui-data-import.jobCompletedDate' }),
      runBy: formatMessage({ id: 'ui-data-import.jobRunBy' }),
    };

    this.sortColumns = {
      fileName: {
        sortFn: sortStrings,
        useFormatterFn: true,
      },
      jobProfileName: {
        sortFn: sortStrings,
        useFormatterFn: false,
      },
      jobExecutionHrId: {
        sortFn: sortNums,
        useFormatterFn: false,
      },
      runBy: {
        sortFn: sortStrings,
        useFormatterFn: true,
      },
      completedDate: {
        sortFn: sortDates,
        useFormatterFn: false,
      },
    };

    this.cellFormatters = {
      ...formatter,
      runBy: this.formatUser,
      completedDate: this.formatEndedRunningDate,
    };
  }

  componentDidMount() {
    this.setLogsSort();
  }

  setLogsSort() {
    const {
      sort = 'completedDate',
      direction = 'ascending',
    } = qs.parse(this.props.location.search.slice(1));

    this.setState({
      sort,
      direction,
    });
  }

  formatUser({
    runBy: {
      firstName,
      lastName,
    },
  }) {
    return `${firstName} ${lastName}`;
  }

  formatEndedRunningDate = ({ completedDate }) => {
    const {
      formatDate,
      formatTime,
    } = this.props.intl;

    return `${formatDate(completedDate)} ${formatTime(completedDate)}`;
  };

  prepareLogsData(logs) {
    const {
      sort,
      direction,
    } = this.state;

    return logs.sort((a, b) => {
      const cellFormatter = this.cellFormatters[sort];
      const sortDir = direction === 'ascending' ? -1 : 1;
      const {
        useFormatterFn,
        sortFn,
      } = this.sortColumns[sort];

      return sortDir * (useFormatterFn && cellFormatter ?
        sortFn(cellFormatter(a), cellFormatter(b)) :
        sortFn(a[sort], b[sort]));
    });
  }

  onSort = (e, { name: fieldName }) => {
    const {
      sort,
      direction,
    } = this.state;
    const {
      history,
      location,
    } = this.props;

    const isSameField = sort === fieldName;
    let sortDir = 'ascending';

    if (isSameField) {
      sortDir = direction === sortDir ? 'descending' : sortDir;
    }

    const sortState = {
      sort: fieldName,
      direction: sortDir,
    };

    this.setState(() => sortState);

    history.push({
      pathname: location.pathname,
      search: `?${qs.stringify(sortState)}`,
    });
  };

  render() {
    const { resource } = this.props;
    const {
      records = [],
      isPending = true,
    } = (resource || {});

    const logs = get(records, '0.logs') || [];
    const contentData = this.prepareLogsData(logs);

    if (isPending) {
      return (
        <Icon
          icon="spinner-ellipsis"
          size="small"
        />
      );
    }

    return (
      <MultiColumnList
        contentData={contentData}
        columnMapping={this.columnMapping}
        visibleColumns={this.visibleColumns}
        formatter={this.cellFormatters}
        sortOrder={this.columnMapping[this.state.sort]}
        sortDirection={this.state.direction}
        onHeaderClick={this.onSort}
      />
    );
  }
}

export default withRouter(injectIntl(JobLogs));
