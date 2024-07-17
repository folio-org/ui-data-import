import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
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
  ConfirmationModal,
  DefaultMCLRowFormatter,
  Callout,
} from '@folio/stripes/components';
import { listTemplate } from '@folio/stripes-data-transfer-components';

import ViewAllLogsFilters from './ViewAllLogsFilters';
import { searchableIndexes } from './ViewAllLogsSearchConfig';
import {
  ActionMenu,
  UploadingJobsContext,
} from '../../components';
import packageInfo from '../../../package';
import {
  DEFAULT_JOB_LOG_COLUMNS_WIDTHS,
  DEFAULT_JOB_LOG_COLUMNS,
  FILE_STATUSES,
  getJobLogsListColumnMapping,
  statusCellFormatter,
  showActionMenu,
  permissions,
  PAGE_KEYS,
  storage,
  deleteJobExecutions,
  fieldsConfig,
  fileNameCellFormatter,
  jobProfileNameCellFormatter,
  useCheckboxList,
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
import { requestConfiguration } from '../../utils/multipartUpload';

const {
  COMMITTED,
  ERROR,
  CANCELLED,
} = FILE_STATUSES;

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;
const USERS_LIMIT_PER_REQUEST = 500;
const JOB_PROFILES_LIMIT_PER_REQUEST = 1000;

const entityKey = 'jobLogs';

const INITIAL_QUERY = {
  filters: '',
  sort: '-completedDate',
  query: '',
  qindex: '',
};

export const getLogsPath = (_q, _p, _r, _l, props) => {
  return props.resources.splitStatus?.hasLoaded ? 'metadata-provider/jobExecutions' : undefined;
};

export const getLogsQuery = (_q, _p, resourceData, _l, props) => {
  const {
    qindex,
    filters,
    query,
    sort,
  } = resourceData.query || {};

  const { resources : { splitStatus } } = props;

  const queryValue = getQuery(query, qindex);
  const filtersValues = getFilters(filters);
  const sortValue = getSort(sort);

  if (!filtersValues[FILTERS.ERRORS]) {
    filtersValues[FILTERS.ERRORS] = [COMMITTED, ERROR, CANCELLED];
  }

  let adjustedQueryValue = { ...queryValue };
  if (splitStatus?.hasLoaded) {
    if (splitStatus.records[0].splitStatus) {
      adjustedQueryValue = { ...adjustedQueryValue, subordinationTypeNotAny: ['COMPOSITE_PARENT'] };
    }
  } else {
    return {};
  }

  return {
    ...adjustedQueryValue,
    ...filtersValues,
    ...sortValue,
  };
};

const ViewAllLogs = props => {
  const {
    packageInfo: packageInfoFormProps,
    refreshRemote,
    browseOnly = false,
    disableRecordCreation,
    mutator,
    location,
    resources,
    resources: {
      resultOffset,
      records: { records },
    },
    stripes,
    stripes: {
      okapi,
    },
  } = props;
  const [list, setList] = useState([]);
  const [isLogsDeletionInProgress, setIsLogsDeletionInProgress] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedLogsNumber, setSelectedLogsNumber] = useState(0);

  const context = useContext(UploadingJobsContext);
  const calloutRef = useRef();
  const {
    formatMessage,
    formatNumber,
  } = useIntl();
  const initialSelectedRecords = new Set(storage.getItem(PAGE_KEYS.VIEW_ALL) || []);

  const {
    isAllSelected,
    handleSelectAllCheckbox,
    selectedRecords,
    selectRecord,
    deselectAll,
  } = useCheckboxList(list, initialSelectedRecords);

  const setLogsList = () => {
    setList(records?.filter(Boolean));
  };

  // reset checkboxes state when component is unmounted
  useEffect(() => () => storage.setItem(PAGE_KEYS.VIEW_ALL, []), []);

  useEffect(() => {
    mutator.usersList?.GET();
    mutator.jobProfilesList?.GET();
    setLogsList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLogsList();

    if (isLogsDeletionInProgress) {
      setIsLogsDeletionInProgress(false);
    }
  }, [records]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedRecords.size !== selectedLogsNumber) {
      storage.setItem(PAGE_KEYS.VIEW_ALL, [...selectedRecords]);

      setSelectedLogsNumber(selectedRecords.size);
    }
  }, [selectedLogsNumber, selectedRecords]);

  const getActiveFilters = () => {
    const { query } = resources;

    if (!query || !query.filters) return {};

    return query.filters
      .split(',')
      .reduce((filterMap, currentFilter) => {
        const [name, value] = currentFilter.split('.');

        if (!Array.isArray(filterMap[name])) {
          filterMap[name] = [];
        }

        filterMap[name].push(value);

        return filterMap;
      }, {});
  };

  const handleFilterChange = ({ name, values }) => {
    const newFilters = {
      ...getActiveFilters(),
      [name]: values,
    };

    const filters = Object.keys(newFilters)
      .map((filterName) => {
        return newFilters[filterName]
          .map((filterValue) => `${filterName}.${filterValue}`)
          .join(',');
      })
      .filter(filter => filter)
      .join(',');

    mutator.query.update({ filters });
  };

  const changeSearchIndex = (e) => {
    const qindex = e.target.value;

    mutator.query.update({ qindex });
  };

  const getVisibleColumns = () => {
    const { uploadConfiguration } = context;
    const hasDeletePermission = stripes.hasPerm(permissions.DELETE_LOGS);
    const baseColumns = [...DEFAULT_JOB_LOG_COLUMNS];
    if (uploadConfiguration?.canUseObjectStorage) {
      baseColumns.splice(3, 0, 'jobParts');
    }
    return hasDeletePermission ? ['selected', ...baseColumns] : baseColumns;
  };

  const getResultsFormatter = () => {
    return {
      ...listTemplate({
        entityKey,
        selectRecord,
        selectedRecords,
        checkboxDisabled: isLogsDeletionInProgress,
        fieldsConfig,
        formatNumber,
      }),
      fileName: record => fileNameCellFormatter(record, location),
      status: statusCellFormatter(formatMessage),
      jobProfileName: jobProfileNameCellFormatter,
      jobParts: record => formatMessage({ id: 'ui-data-import.logViewer.partOfTotal' }, { number: record.jobPartNumber, total: record.totalJobParts }),
    };
  };

  const isDeleteAllLogsDisabled = () => selectedRecords.size === 0;

  const renderActionMenu = menu => {
    return (
      <ActionMenu
        entity={{
          props: {
            ...props,
            actionMenuItems: ['deleteSelectedLogs'],
          },
          showDeleteConfirmation: () => setShowDeleteConfirmation(true),
          isDeleteAllLogsDisabled,
        }}
        menu={menu}
        baseUrl="/data-import/job-logs"
      />
    );
  };

  const getSearchableIndexes = () => {
    return searchableIndexes.map(index => {
      const label = formatMessage({ id: `ui-data-import.${index.label}` });
      const placeholder = index?.placeholder ? formatMessage({ id: `ui-data-import.placeholder.${index.placeholder}` }) : '';

      return {
        ...index,
        label,
        placeholder,
      };
    });
  };

  const renderFilters = onChange => {
    const jobProfiles = get(resources, ['jobProfilesList', 'records'], [])
      .sort((jobProfileA, jobProfileB) => jobProfileA.name.localeCompare(jobProfileB.name));

    const users = get(resources, ['usersList', 'records'], [])
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
          activeFilters={getActiveFilters()}
          onChange={onChange}
          queryMutator={mutator.query}
          jobProfiles={jobProfiles}
          users={users}
        />
      )
      : null;
  };

  const hideDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const showDeleteLogsSuccessfulMessage = logsNumber => {
    calloutRef.current.sendCallout({
      type: 'success',
      message: (
        <FormattedMessage
          id="ui-data-import.landing.callout.success"
          values={{ logsNumber }}
        />
      ),
    });
  };

  const showDeleteLogsErrorMessage = () => {
    calloutRef.current.sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-data-import.communicationProblem" />,
    });
  };

  const deleteLogs = () => {
    const onSuccess = result => {
      const { jobExecutionDetails } = result;
      // force shouldRefresh method
      refreshRemote(props);
      deselectAll();
      hideDeleteConfirmation();
      showDeleteLogsSuccessfulMessage(jobExecutionDetails.length);

      if (resultOffset !== 0) {
        mutator.resultOffset.replace(resultOffset - RESULT_COUNT_INCREMENT);
        setTimeout(() => mutator.resultOffset.replace(resultOffset));
      }

      mutator.usersList.reset();
      mutator.jobProfilesList.reset();

      mutator.usersList.GET();
      mutator.jobProfilesList.GET();
    };

    // disable all checkboxes while deletion in progress
    setIsLogsDeletionInProgress(true);

    deleteJobExecutions(selectedRecords, okapi)
      .then(onSuccess)
      .catch(() => showDeleteLogsErrorMessage());
  };

  const onMarkPosition = position => {
    sessionStorage.setItem(DATA_IMPORT_POSITION, JSON.stringify(position));
  };

  const resetMarkedPosition = () => {
    sessionStorage.setItem(DATA_IMPORT_POSITION, null);
  };

  const handleResetAll = () => {
    const { query: { update } } = mutator;

    update(INITIAL_QUERY);
  };

  let isAllSelectedByValues = isAllSelected;
  if (isAllSelected) {
    const nonEmptyRecords = records.map(record => record.id).filter(Boolean);
    isAllSelectedByValues = isEqual(Array.from(selectedRecords), nonEmptyRecords);
  }

  const { DELETE_LOGS } = permissions;
  const logsNumber = selectedRecords.size;
  const hasLogsSelected = logsNumber > 0;

  const resultsFormatter = getResultsFormatter();
  const columnMapping = getJobLogsListColumnMapping({
    isAllSelected: isAllSelectedByValues,
    handleSelectAllCheckbox,
    checkboxDisabled: isLogsDeletionInProgress,
  });
  const itemToView = JSON.parse(sessionStorage.getItem(DATA_IMPORT_POSITION));

  return (
    <div>
      <SearchAndSort
        packageInfo={packageInfoFormProps || packageInfo}
        objectName="job-logs"
        baseRoute={packageInfo.stripes.route}
        initialResultCount={INITIAL_RESULT_COUNT}
        resultCountIncrement={RESULT_COUNT_INCREMENT}
        visibleColumns={getVisibleColumns()}
        columnMapping={columnMapping}
        resultsFormatter={resultsFormatter}
        resultRowFormatter={DefaultMCLRowFormatter}
        columnWidths={DEFAULT_JOB_LOG_COLUMNS_WIDTHS}
        actionMenu={showActionMenu({
          renderer: renderActionMenu,
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
        searchableIndexes={getSearchableIndexes()}
        selectedIndex={get(resources.query, 'qindex')}
        renderFilters={renderFilters}
        onFilterChange={handleFilterChange}
        onChangeIndex={changeSearchIndex}
        onResetAll={handleResetAll}
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
        resultsOnMarkPosition={onMarkPosition}
        resultsOnResetMarkedPosition={resetMarkedPosition}
        resultsCachedPosition={itemToView}
        nonInteractiveHeaders={['selected', 'jobParts']}
      />
      <ConfirmationModal
        id="delete-selected-logs-modal"
        open={showDeleteConfirmation}
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
        onConfirm={() => deleteLogs()}
        onCancel={() => {
          deselectAll();
          hideDeleteConfirmation();
        }}
      />
      <Callout ref={calloutRef} />
    </div>
  );
};

export const ViewAllLogsManifest = Object.freeze({
  initializedFilterConfig: { initialValue: false },
  query: {
    initialValue: INITIAL_QUERY,
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
    path: getLogsPath,
    params: getLogsQuery,
    perRequest: RESULT_COUNT_INCREMENT,
    throwErrors: false,
    shouldRefresh: () => true,
    resourceShouldRefresh: true,
  },
  usersList: {
    type: 'okapi',
    records: 'jobExecutionUsersInfo',
    path: 'metadata-provider/jobExecutions/users',
    throwErrors: false,
    accumulate: true,
    perRequest: USERS_LIMIT_PER_REQUEST,
  },
  jobProfilesList: {
    type: 'okapi',
    records: 'jobProfilesInfo',
    path: 'metadata-provider/jobExecutions/jobProfiles',
    throwErrors: false,
    accumulate: true,
    perRequest: JOB_PROFILES_LIMIT_PER_REQUEST,
  },
  splitStatus: {
    type: 'okapi',
    path: requestConfiguration,
    throwErrors: false,
  }
});

ViewAllLogs.manifest = ViewAllLogsManifest;

ViewAllLogs.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  disableRecordCreation: PropTypes.bool,
  browseOnly: PropTypes.bool,
  packageInfo: PropTypes.object,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }),
  refreshRemote: PropTypes.func,
};

export default stripesConnect(ViewAllLogs);
