import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import {
  get,
  noop,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { SearchAndSort } from '@folio/stripes/smart-components';
import {
  FILTER_SEPARATOR,
  FILTER_GROUP_SEPARATOR,
  Button,
} from '@folio/stripes/components';
import {
  changeSearchIndex,
  getActiveFilters,
  handleFilterChange,
} from '@folio/stripes-acq-components';

import { filterConfig } from './ViewAllLogsFilterConfig';
import ViewAllLogsFilters from './ViewAllLogsFilters';
import {
  logsSearchTemplate,
  searchableIndexes,
} from './ViewAllLogsSearchConfig';
import { listTemplate } from '../../components';
import packageInfo from '../../../package';
import { FILE_STATUSES } from '../../utils';
import {
  FILTERS,
  SORT_MAP,
} from './constants';

import sharedCss from '../../shared.css';

const {
  COMMITTED,
  ERROR,
} = FILE_STATUSES;

const columnMapping = {
  fileName: <FormattedMessage id="ui-data-import.fileName" />,
  status: <FormattedMessage id="ui-data-import.status" />,
  hrId: <FormattedMessage id="ui-data-import.jobExecutionHrId" />,
  jobProfileName: <FormattedMessage id="ui-data-import.jobProfileName" />,
  totalRecords: <FormattedMessage id="ui-data-import.records" />,
  completedDate: <FormattedMessage id="ui-data-import.jobCompletedDate" />,
  runBy: <FormattedMessage id="ui-data-import.runBy" />,
};

const visibleColumns = [
  'fileName',
  'status',
  'totalRecords',
  'jobProfileName',
  'completedDate',
  'runBy',
  'hrId',
];

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

const getQuery = (query, qindex) => {
  if (query && qindex) {
    return { [qindex]: logsSearchTemplate(query)[qindex] };
  }

  if (query) {
    return logsSearchTemplate(query);
  }

  return {};
};
const getFilters = filters => {
  const splitFiltersByGroups = () => {
    const groups = {};

    const fullNames = filters.split(FILTER_SEPARATOR);

    for (const fullName of fullNames) {
      if (fullName) {
        const [groupName, fieldName] = fullName.split(FILTER_GROUP_SEPARATOR);

        if (groups[groupName] === undefined) groups[groupName] = [];
        groups[groupName].push(fieldName);
      }
    }

    return groups;
  };
  const getMappedValues = (values, group) => {
    return values.map(value => {
      const obj = group.values.filter(f => typeof f === 'object' && f.name === value);

      return (obj.length > 0) ? obj[0].cql : value;
    });
  };
  const convertFiltersToQuery = filtersObj => {
    const filterQueries = {};

    for (const query of Object.keys(filtersObj)) {
      filterQueries[query] = filtersObj[query].join(`&${query}=`);
    }

    return filterQueries;
  };

  if (filters) {
    const groups = splitFiltersByGroups();
    const filtersObj = {};

    for (const groupName of Object.keys(groups)) {
      const group = filterConfig.filter(g => g.name === groupName)[0];

      if (group && group.cql) {
        const cqlIndex = group.cql;

        // values contains the selected filters
        const values = groups[groupName];

        const mappedValues = getMappedValues(values, group);

        if (group.isRange) {
          const { rangeSeparator = ':' } = group;
          const [start, end] = mappedValues[0].split(rangeSeparator);

          filtersObj.completedAfter = [start];
          filtersObj.completedBefore = [end];
        } else {
          const {
            noIndex,
            values: groupValues,
          } = group;

          // fill in filters object
          if (!noIndex) {
            if (filtersObj[cqlIndex] === undefined) filtersObj[cqlIndex] = [];

            filtersObj[cqlIndex] = [...filtersObj[cqlIndex], ...values];
          } else {
            values.forEach(value => {
              const obj = groupValues.filter(f => typeof f === 'object' && f.name === value);

              if (obj.length > 0) {
                const groupIndex = obj[0].indexName;

                if (filtersObj[groupIndex] === undefined) filtersObj[groupIndex] = [];

                filtersObj[groupIndex] = [...filtersObj[groupIndex], obj[0].cql];
              }
            });
          }
        }
      }
    }

    return convertFiltersToQuery(filtersObj);
  }

  return {};
};
const getSort = sort => {
  const firstSortIndex = sort?.split(',')[0] || '';

  if (!firstSortIndex) return {};

  let reverse = false;
  let sortValue = firstSortIndex;

  if (firstSortIndex.startsWith('-')) {
    sortValue = firstSortIndex.substr(1);
    reverse = true;
  }

  let sortIndex = SORT_MAP[sortValue] || sortValue;

  if (reverse) {
    sortIndex = `${sortIndex.replace(' ', ',desc sortBy=')},desc`;
  } else {
    sortIndex = `${sortIndex.replace(' ', ',asc sortBy=')},asc`;
  }

  return { sortBy: sortIndex };
};

@stripesConnect
class ViewAllLogs extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.object,
    disableRecordCreation: PropTypes.bool,
    browseOnly: PropTypes.bool,
    packageInfo: PropTypes.object,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }),
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = { browseOnly: false };

  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
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
      params: (queryParams, pathComponents, resourceData) => {
        const {
          qindex,
          filters,
          query,
          sort,
        } = resourceData.query || {};

        const queryValue = getQuery(query, qindex);
        const filtersValues = getFilters(filters);
        const sortValue = getSort(sort);

        if (!filtersValues[FILTERS.ERRORS]) {
          filtersValues[FILTERS.ERRORS] = `${COMMITTED}&${FILTERS.ERRORS}=${ERROR}`;
        }

        return {
          ...queryValue,
          ...filtersValues,
          ...sortValue,
        };
      },
      perRequest: RESULT_COUNT_INCREMENT,
      throwErrors: false,
    },
  });

  constructor(props) {
    super(props);
    this.getActiveFilters = getActiveFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
    this.changeSearchIndex = changeSearchIndex.bind(this);
  }

  getSearchableIndexes() {
    const { intl: { formatMessage } } = this.props;

    return searchableIndexes.map(index => {
      const label = formatMessage({ id: `ui-data-import.${index.label}` });
      const placeholder = index?.placeholder ? formatMessage({ id: `ui-data-import.placeholder.${index.placeholder}` }) : '';

      return {
        ...index,
        label,
        placeholder,
      };
    });
  }

  renderFilters = onChange => {
    const { resources } = this.props;

    const jobProfiles = get(resources, ['records', 'records'], [])
      .map(item => item.jobProfileInfo)
      .sort((jobProfileA, jobProfileB) => jobProfileA.name.localeCompare(jobProfileB.name));

    const users = get(resources, ['records', 'records'], [])
      .map(item => ({
        userId: item.userId,
        firstName: item.runBy.firstName,
        lastName: item.runBy.lastName,
      }))
      .sort((userA, userB) => {
        const nameA = userA.firstName || userA.lastName;
        const nameB = userB.firstName || userB.lastName;

        if (userA.firstName?.localeCompare(userB.firstName) === 0) {
          return userA.lastName.localeCompare(userB.lastName);
        }

        return nameA.localeCompare(nameB);
      });

    return resources.query
      ? (
        <ViewAllLogsFilters
          activeFilters={this.getActiveFilters()}
          onChange={onChange}
          queryMutator={this.props.mutator.query}
          jobProfiles={jobProfiles}
          users={users}
        />
      )
      : null;
  };

  render() {
    const {
      browseOnly,
      disableRecordCreation,
      mutator,
      resources,
      stripes,
      intl,
    } = this.props;

    const resultsFormatter = {
      fileName: record => (
        <Button
          buttonStyle="link"
          marginBottom0
          buttonClass={sharedCss.cellLink}
          to={`/data-import/job-summary/${record.id}`}
          onClick={e => e.stopPropagation()}
        >
          {record.fileName || <FormattedMessage id="ui-data-import.noFileName" />}
        </Button>
      ),
      status: listTemplate({ intl }).status,
      runBy: listTemplate({ intl }).runBy,
      completedDate: listTemplate({ intl }).completedDate,
      jobProfileName: listTemplate({ intl }).jobProfileName,
      totalRecords: listTemplate({ intl }).totalRecords,
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
          viewRecordComponent={noop}
          onSelectRow={noop}
          viewRecordPerms="metadata-provider.jobexecutions.get"
          parentResources={resources}
          parentMutator={mutator}
          stripes={stripes}
          disableRecordCreation={disableRecordCreation}
          browseOnly={browseOnly}
          showSingleResult={false}
          searchableIndexes={this.getSearchableIndexes()}
          selectedIndex={get(resources.query, 'qindex')}
          renderFilters={this.renderFilters}
          onFilterChange={this.handleFilterChange}
          onChangeIndex={this.changeSearchIndex}
          pagingType="click"
          pageAmount={RESULT_COUNT_INCREMENT}
          title={<FormattedMessage id="ui-data-import.logsPaneTitle" />}
        />
      </div>
    );
  }
}

export default injectIntl(ViewAllLogs);
