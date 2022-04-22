import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import {
  get,
  isEqual,
  noop,
} from 'lodash';

import { stripesConnect, withNamespace } from '@folio/stripes/core';
import { SearchAndSort } from '@folio/stripes/smart-components';
import {
  FILTER_SEPARATOR,
  FILTER_GROUP_SEPARATOR,
  Button,
  ConfirmationModal,
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
import {
  ActionMenu,
  listTemplate,
} from '../../components';
import packageInfo from '../../../package';
import {
  checkboxListShape,
  DEFAULT_JOB_LOG_COLUMNS,
  DEFAULT_JOB_LOG_COLUMNS_WIDTHS,
  FILE_STATUSES,
  withCheckboxList,
  getJobLogsListColumnMapping,
} from '../../utils';
import {
  FILTERS,
  SORT_MAP,
} from './constants';

import sharedCss from '../../shared.css';

const {
  COMMITTED,
  ERROR,
} = FILE_STATUSES;

const INITIAL_RESULT_COUNT = 10;
const RESULT_COUNT_INCREMENT = 10;

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

                filtersObj[groupIndex] = [...filtersObj[groupIndex], ...obj[0].cql];
              }
            });
          }
        }
      }
    }

    return filtersObj;
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
    sortIndex = sortIndex.split(' ').map(v => `${v},desc`);
  } else {
    sortIndex = sortIndex.split(' ').map(v => `${v},asc`);
  }

  return { sortBy: sortIndex };
};
const entityKey = 'jobLogs';

@withCheckboxList
@stripesConnect
class ViewAllLogs extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    checkboxList: checkboxListShape.isRequired,
    setList: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    stripes: PropTypes.object,
    disableRecordCreation: PropTypes.bool,
    browseOnly: PropTypes.bool,
    packageInfo: PropTypes.object,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }),
    // eslint-disable-next-line react/no-unused-prop-types
    actionMenuItems: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    browseOnly: false,
    actionMenuItems: ['deleteSelectedLogs'],
  };

  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        filters: '',
        sort: '-completedDate',
      },
    },
    resultCount: { initialValue: 10 },
    resultOffset: { initialValue: 0 },
    records: {
      type: 'okapi',
      clear: true,
      resultDensity: 'dense',
      resultOffset: '%{resultOffset}',
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
          filtersValues[FILTERS.ERRORS] = [COMMITTED, ERROR];
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
    this.renderActionMenu = this.renderActionMenu.bind(this);
    this.setLogsList();
  }

  state = { showDeleteConfirmation: false };

  componentDidUpdate(prevProps) {
    const { resources: { records: { records: prevRecords } } } = prevProps;
    const { resources: { records: { records } } } = this.props;
    /* console.log('------------');
    console.log('prevRecords', prevRecords);
    console.log('records', records);
    console.log('------------'); */
    if (!isEqual(prevRecords, records)) {
      this.setLogsList();
    }
  }

  setLogsList() {
    const {
      resources: { records: { records } },
      setList,
    } = this.props;
    setList(records);
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

  renderActionMenu(menu) {
    return (
      <ActionMenu
        entity={this}
        menu={menu}
      />
    );
  }

  showDeleteConfirmation() {
    this.setState({ showDeleteConfirmation: true });
  }

  hideDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: false });
  };

  deleteLogs() {
    // TODO: replace this on logs deleting once API is ready
    this.props.checkboxList.deselectAll();
    this.hideDeleteConfirmation();
  }

  isDeleteAllLogsDisabled() {
    const { checkboxList: { selectedRecords } } = this.props;

    return selectedRecords.size === 0;
  }

  getResultsFormatter() {
    const {
      intl: { formatMessage },
      checkboxList: {
        selectedRecords,
        selectRecord,
      },
    } = this.props;

    const fileNameCellFormatter = record => (
      <Button
        buttonStyle="link"
        marginBottom0
        to={`/data-import/job-summary/${record.id}`}
        buttonClass={sharedCss.cellLink}
        onClick={e => e.stopPropagation()}
      >
        {record.fileName || formatMessage({ id: 'ui-data-import.noFileName' }) }
      </Button>
    );
    const statusCellFormatter = record => {
      const {
        status,
        progress,
      } = record;

      if (status === FILE_STATUSES.ERROR) {
        if (progress && progress.current > 0) {
          return formatMessage({ id: 'ui-data-import.completedWithErrors' });
        }

        return formatMessage({ id: 'ui-data-import.failed' });
      }

      return formatMessage({ id: 'ui-data-import.completed' });
    };

    return {
      ...listTemplate({
        entityKey,
        selectRecord,
        selectedRecords,
      }),
      fileName: fileNameCellFormatter,
      status: statusCellFormatter,
    };
  }

  onMarkPosition = (position) => {
    sessionStorage.setItem('@folio/data-import.position', JSON.stringify(position));
  }

  resetMarkedPosition = () => {
    sessionStorage.setItem('@folio/data-import.position', null);
  }

  render() {
    const {
      checkboxList: {
        isAllSelected,
        handleSelectAllCheckbox,
        selectedRecords,
      },
      browseOnly,
      disableRecordCreation,
      mutator,
      resources,
      stripes,
    } = this.props;
    const logsNumber = selectedRecords.size;
    const hasLogsSelected = logsNumber > 0;

    const resultsFormatter = this.getResultsFormatter();
    const columnMapping = getJobLogsListColumnMapping({ isAllSelected, handleSelectAllCheckbox });
    const itemToView = sessionStorage.getItem('job-logs.position');
    console.log('resources', resources);
    return (
      <div data-test-logs-list>
        <SearchAndSort
          packageInfo={this.props.packageInfo || packageInfo}
          objectName="job-logs"
          baseRoute={packageInfo.stripes.route}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          visibleColumns={DEFAULT_JOB_LOG_COLUMNS}
          columnMapping={columnMapping}
          resultsFormatter={resultsFormatter}
          columnWidths={DEFAULT_JOB_LOG_COLUMNS_WIDTHS}
          actionMenu={this.renderActionMenu}
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
          pagingType="prev-next"
          pageAmount={RESULT_COUNT_INCREMENT}
          title={<FormattedMessage id="ui-data-import.logsPaneTitle" />}
          resultCountMessageKey="ui-data-import.logsPaneSubtitle"
          customPaneSub={hasLogsSelected
            ? (
              <FormattedMessage
                id="ui-data-import.logsSelected"
                values={{ logsNumber }}
              />
            )
            : null
          }
          resultsVirtualize={false}
          resultsOnMarkPosition={this.onMarkPosition}
          resultsOnResetMarkedPosition={this.resetMarkedPosition}
          resultsCachedPosition={itemToView}
          // paginationBoundaries
        />
        <ConfirmationModal
          id="delete-selected-logs-modal"
          open={this.state.showDeleteConfirmation}
          heading={<FormattedMessage id="ui-data-import.modal.landing.delete.header" />}
          message={(
            <FormattedMessage
              id="ui-data-import.modal.landing.delete.message"
              values={{ logsNumber }}
            />
          )}
          bodyTag="div"
          confirmLabel={<FormattedMessage id="ui-data-import.modal.landing.delete" />}
          cancelLabel={<FormattedMessage id="ui-data-import.modal.landing.cancel" />}
          onConfirm={() => this.deleteLogs()}
          onCancel={() => {
            this.props.checkboxList.deselectAll();
            this.hideDeleteConfirmation();
          }}
        />
      </div>
    );
  }
}

export default withNamespace(injectIntl(ViewAllLogs));
