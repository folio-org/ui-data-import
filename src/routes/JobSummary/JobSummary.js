import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  createUrl,
  SearchAndSortPane,
  SettingsLabel,
} from '@folio/stripes-data-transfer-components';
import {
  NoValue,
  PaneMenu,
  PaneCloseLink,
} from '@folio/stripes/components';

import { FOLIO_RECORD_TYPES } from '../../components';

import {
  DATA_TYPES,
  RECORD_ACTION_STATUS_LABEL_IDS,
} from '../../utils';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

const SORT_TYPE = {
  DESCENDING: 'desc',
  ASCENDING: 'asc',
};

const sortMap = {
  recordNumber: 'source_record_order',
  title: 'title',
  srsMarcBibStatus: 'source_record_action_status',
  instanceStatus: 'instance_action_status',
  holdingsStatus: 'holdings_action_status',
  itemStatus: 'item_action_status',
  orderStatus: 'order_action_status',
  invoiceStatus: 'invoice_action_status',
  error: 'error',
};

const JobSummaryComponent = ({
  mutator,
  resources,
  resources: { jobExecutions: { records } },
  history,
}) => {
  const dataType = records[0]?.jobProfileInfo.dataType;
  const isEdifactType = dataType === DATA_TYPES[1];
  const getRecordActionStatusLabel = recordType => {
    if (!recordType) return <NoValue />;

    const labelId = RECORD_ACTION_STATUS_LABEL_IDS[recordType];

    return <FormattedMessage id={labelId} />;
  };

  const visibleColumns = [
    'recordNumber',
    'title',
    'srsMarcBibStatus',
    'instanceStatus',
    'holdingsStatus',
    'itemStatus',
    'orderStatus',
    'invoiceStatus',
    'error',
  ];
  const columnMapping = {
    recordNumber: <FormattedMessage id="ui-data-import.record" />,
    title: <FormattedMessage id="ui-data-import.title" />,
    srsMarcBibStatus: <FormattedMessage id="ui-data-import.recordTypes.srsMarcBib" />,
    instanceStatus: <FormattedMessage id="ui-data-import.recordTypes.instance" />,
    holdingsStatus: <FormattedMessage id="ui-data-import.recordTypes.holdings" />,
    itemStatus: <FormattedMessage id="ui-data-import.recordTypes.item" />,
    orderStatus: <FormattedMessage id="ui-data-import.recordTypes.order" />,
    invoiceStatus: <FormattedMessage id="ui-data-import.recordTypes.invoice" />,
    error: <FormattedMessage id="ui-data-import.error" />,
  };
  const resultsFormatter = {
    recordNumber: ({ sourceRecordOrder }) => {
      if (isEdifactType) return sourceRecordOrder;

      return parseInt(sourceRecordOrder, 10) + 1;
    },
    title: ({ sourceRecordTitle }) => sourceRecordTitle,
    srsMarcBibStatus: ({ sourceRecordActionStatus }) => getRecordActionStatusLabel(sourceRecordActionStatus),
    instanceStatus: ({ instanceActionStatus }) => getRecordActionStatusLabel(instanceActionStatus),
    holdingsStatus: ({ holdingsActionStatus }) => getRecordActionStatusLabel(holdingsActionStatus),
    itemStatus: ({ itemActionStatus }) => getRecordActionStatusLabel(itemActionStatus),
    orderStatus: ({ orderActionStatus }) => getRecordActionStatusLabel(orderActionStatus),
    invoiceStatus: ({ invoiceActionStatus }) => getRecordActionStatusLabel(invoiceActionStatus),
    error: ({ error }) => (error ? <FormattedMessage id="ui-data-import.error" /> : ''),
  };
  const label = (
    <SettingsLabel
      iconKey={isEdifactType ? FOLIO_RECORD_TYPES.INVOICE.iconKey : 'app'}
      app="data-import"
    >
      <>{records[0]?.fileName}</>
    </SettingsLabel>
  );
  const firstMenu = (
    <PaneMenu>
      <PaneCloseLink to="/data-import" />
    </PaneMenu>
  );

  const handleRowClick = (e, row) => {
    const queryParams = isEdifactType ? { instanceLineId: row.invoiceLineJournalRecordId } : {};
    const path = createUrl(`/data-import/log/${row.jobExecutionId}/${row.sourceRecordId}`, queryParams);

    const jobLogWindow = window.open(path, '_blank');

    jobLogWindow.focus();
  };

  return (
    <SearchAndSortPane
      label={label}
      resultCountMessageId="stripes-smart-components.searchResultsCountHeader"
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      resultsFormatter={resultsFormatter}
      resourceName="jobLogEntries"
      initialResultCount={INITIAL_RESULT_COUNT}
      resultCountIncrement={RESULT_COUNT_INCREMENT}
      hasSearchForm={false}
      defaultSort="recordNumber"
      parentMutator={mutator}
      parentResources={resources}
      lastMenu={<></>}
      firstMenu={firstMenu}
      searchResultsProps={{
        onRowClick: handleRowClick,
        pagingType: 'click',
        pageAmount: RESULT_COUNT_INCREMENT,
        columnWidths: { title: '30%' },
      }}
    />
  );
};

JobSummaryComponent.manifest = Object.freeze({
  initializedFilterConfig: { initialValue: false },
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  jobLogEntries: {
    type: 'okapi',
    records: 'entries',
    resultOffset: '%{resultOffset}',
    perRequest: RESULT_COUNT_INCREMENT,
    path: 'metadata-provider/jobLogEntries/:{id}',
    clientGeneratePk: false,
    throwErrors: false,
    GET: {
      params: {
        sortBy: queryParams => {
          const { sort: sortsFromQuery } = queryParams;

          const sorts = sortsFromQuery ? sortsFromQuery.split(',') : [];
          const mainSort = sorts[0] || '';
          const sort = mainSort.replace(/^-/, '');

          return sortMap[sort];
        },
        order: queryParams => {
          const { sort: sortsFromQuery } = queryParams;

          const sorts = sortsFromQuery ? sortsFromQuery.split(',') : [];
          const mainSort = sorts[0] || '';

          return mainSort.startsWith('-') ? SORT_TYPE.DESCENDING : SORT_TYPE.ASCENDING;
        },
      },
      staticFallback: { params: {} },
    },
  },
  jobExecutions: {
    type: 'okapi',
    path: 'change-manager/jobExecutions/:{id}',
    throwErrors: false,
  },
});

JobSummaryComponent.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.shape({
    jobExecutions: PropTypes.shape({
      records: PropTypes.arrayOf(
        PropTypes.shape({
          fileName: PropTypes.string.isRequired,
          progress: PropTypes.shape({ total: PropTypes.number.isRequired }).isRequired,
          jobProfileInfo: PropTypes.shape({ dataType: PropTypes.string.isRequired }).isRequired,
        }),
      ).isRequired,
    }),
  }).isRequired,
  history: PropTypes.shape({ go: PropTypes.func.isRequired }).isRequired,
};

export const JobSummary = stripesConnect(JobSummaryComponent);
