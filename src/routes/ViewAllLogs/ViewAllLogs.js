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

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import { SearchAndSort } from '@folio/stripes/smart-components';
import {
  TextLink,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  changeSearchIndex,
  getActiveFilters,
  handleFilterChange,
} from '@folio/stripes-acq-components';

import ViewAllLogsFilters from './ViewAllLogsFilters';
import { searchableIndexes } from './ViewAllLogsSearchConfig';
import {
  ActionMenu,
  listTemplate,
} from '../../components';
import packageInfo from '../../../package';
import {
  checkboxListShape,
  DEFAULT_JOB_LOG_COLUMNS_WIDTHS,
  FILE_STATUSES,
  withCheckboxList,
  getJobLogsListColumnMapping,
  statusCellFormatter,
  showActionMenu,
  permissions,
  setVisibleColumns,
} from '../../utils';
import {
  FILTERS,
  DATA_IMPORT_POSITION,
} from './constants';
import {
  getQuery,
  getFilters,
  getSort
} from './ViewAllLogsUtils';

const {
  COMMITTED,
  ERROR,
  CANCELLED,
} = FILE_STATUSES;

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

const entityKey = 'jobLogs';

export const ViewAllLogsManifest = Object.freeze({
  initializedFilterConfig: { initialValue: false },
  query: {
    initialValue: {
      filters: '',
      sort: '-completedDate',
    },
  },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  records: {
    type: 'okapi',
    clear: true,
    resultDensity: 'sparse',
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
        filtersValues[FILTERS.ERRORS] = [COMMITTED, ERROR, CANCELLED];
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
  users: {
    type: 'okapi',
    records: 'jobExecutionUsersInfo',
    path: 'metadata-provider/jobExecutions/users',
    throwErrors: false,
  },
  jobProfiles: {
    type: 'okapi',
    records: 'jobProfilesInfo',
    path: 'metadata-provider/jobExecutions/jobProfiles',
    throwErrors: false,
  },
});

@withCheckboxList
@stripesConnect
@injectIntl
class ViewAllLogs extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    checkboxList: checkboxListShape.isRequired,
    setList: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    stripes: stripesShape.isRequired,
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

  static manifest = ViewAllLogsManifest;

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

    const jobProfiles = get(resources, ['jobProfiles', 'records'], [])
      .sort((jobProfileA, jobProfileB) => jobProfileA.name.localeCompare(jobProfileB.name));

    const users = get(resources, ['users', 'records'], [])
      .map(item => {
        return {
          userId: item.userId,
          firstName: item.jobUserFirstName,
          lastName: item.jobUserLastName,
        };
      }).sort((userA, userB) => {
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
      <TextLink
        to={`/data-import/job-summary/${record.id}`}
      >
        {record.fileName || formatMessage({ id: 'ui-data-import.noFileName' }) }
      </TextLink>
    );

    return {
      ...listTemplate({
        entityKey,
        selectRecord,
        selectedRecords,
      }),
      fileName: fileNameCellFormatter,
      status: statusCellFormatter(formatMessage),
    };
  }

  onMarkPosition = (position) => {
    sessionStorage.setItem(DATA_IMPORT_POSITION, JSON.stringify(position));
  }

  resetMarkedPosition = () => {
    sessionStorage.setItem(DATA_IMPORT_POSITION, null);
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
    const { DELETE_LOGS } = permissions;
    const logsNumber = selectedRecords.size;
    const hasLogsSelected = logsNumber > 0;

    const resultsFormatter = this.getResultsFormatter();
    const columnMapping = getJobLogsListColumnMapping({ isAllSelected, handleSelectAllCheckbox });
    const itemToView = JSON.parse(sessionStorage.getItem(DATA_IMPORT_POSITION));

    return (
      <div data-test-logs-list>
        <SearchAndSort
          packageInfo={this.props.packageInfo || packageInfo}
          objectName="job-logs"
          baseRoute={packageInfo.stripes.route}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          visibleColumns={setVisibleColumns(stripes)}
          columnMapping={columnMapping}
          resultsFormatter={resultsFormatter}
          columnWidths={DEFAULT_JOB_LOG_COLUMNS_WIDTHS}
          actionMenu={showActionMenu({
            renderer: this.renderActionMenu,
            stripes,
            perm: DELETE_LOGS,
          })}
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

export default ViewAllLogs;
