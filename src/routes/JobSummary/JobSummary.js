import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  createUrl,
  SearchAndSortPane,
  SettingsLabel,
} from '@folio/stripes-data-transfer-components';
import {
  Button,
  NoValue,
  PaneMenu,
  PaneCloseLink,
} from '@folio/stripes/components';

import { FOLIO_RECORD_TYPES } from '../../components';

import {
  DATA_TYPES,
  RECORD_ACTION_STATUS,
  RECORD_ACTION_STATUS_LABEL_IDS,
} from '../../utils';

import sharedCss from '../../shared.css';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

const SORT_TYPE = {
  DESCENDING: 'desc',
  ASCENDING: 'asc',
};

const sortMap = {
  recordNumber: 'source_record_order',
  title: 'title',
  srsMarcStatus: 'source_record_action_status',
  instanceStatus: 'instance_action_status',
  holdingsStatus: 'holdings_action_status',
  itemStatus: 'item_action_status',
  orderStatus: 'order_action_status',
  invoiceStatus: 'invoice_action_status',
  error: 'error',
};

const getRecordActionStatusLabel = recordType => {
  if (!recordType) return <NoValue />;

  const labelId = RECORD_ACTION_STATUS_LABEL_IDS[recordType];

  return <FormattedMessage id={labelId} />;
};

const JobSummaryComponent = ({
  mutator,
  resources,
  resources: {
    jobExecutions: { records: jobExecutionsRecords },
    jobLogEntries: { records: jobLogEntriesRecords },
    jobLog: { records: jobLogRecords },
  },
}) => {
  const dataType = jobExecutionsRecords[0]?.jobProfileInfo.dataType;
  const isEdifactType = dataType === DATA_TYPES[1];
  const jobExecutionsId = jobExecutionsRecords[0]?.id;

  useEffect(() => {
    if (jobExecutionsId) {
      jobLogEntriesRecords.map(entry => {
        const recordId = isEdifactType ? entry.invoiceLineJournalRecordId : entry.sourceRecordId;

        return mutator.jobLog.GET({ path: `metadata-provider/jobLogEntries/${jobExecutionsId}/records/${recordId}` });
      });
    }
  }, [jobExecutionsId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getHotlinkCellFormatter = (isHotlink, entityLabel, path, entity) => {
    if (isHotlink) {
      return (
        <Button
          data-test-entity-name={entity}
          buttonStyle="link"
          to={path}
          marginBottom0
          buttonClass={sharedCss.cellLink}
        >
          {entityLabel}
        </Button>
      );
    }

    return entityLabel;
  };

  const visibleColumns = [
    'recordNumber',
    'title',
    'srsMarcStatus',
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
    srsMarcStatus: <FormattedMessage id="ui-data-import.recordTypes.srsMarc" />,
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
    title: ({
      sourceRecordTitle,
      sourceRecordId,
      invoiceLineJournalRecordId,
    }) => {
      const jobExecutionId = resources.jobLogEntries.records[0].jobExecutionId;
      const path = createUrl(`/data-import/log/${jobExecutionId}/${sourceRecordId}`,
        isEdifactType ? { instanceLineId: invoiceLineJournalRecordId } : {});

      return (
        <Button
          buttonStyle="link"
          target="_blank"
          marginBottom0
          to={path}
          buttonClass={sharedCss.cellLink}
        >
          {sourceRecordTitle}
        </Button>
      );
    },
    srsMarcStatus: ({ sourceRecordActionStatus }) => getRecordActionStatusLabel(sourceRecordActionStatus),
    instanceStatus: ({
      instanceActionStatus,
      sourceRecordId,
    }) => {
      const entityLabel = getRecordActionStatusLabel(instanceActionStatus);
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const entityId = sourceRecord?.relatedInstanceInfo.idList[0];
      const path = `/inventory/view/${entityId}`;

      const isPathCorrect = !!entityId;
      const isHotlink = isPathCorrect && (instanceActionStatus === RECORD_ACTION_STATUS.CREATED
        || instanceActionStatus === RECORD_ACTION_STATUS.UPDATED);

      return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'instance');
    },
    holdingsStatus: ({
      holdingsActionStatus,
      sourceRecordId,
    }) => {
      const entityLabel = getRecordActionStatusLabel(holdingsActionStatus);
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const instanceId = sourceRecord?.relatedInstanceInfo.idList[0];
      const holdingsId = sourceRecord?.relatedHoldingsInfo.idList[0];
      const path = `/inventory/view/${instanceId}/${holdingsId}`;

      const isPathCorrect = !!(instanceId && holdingsId);
      const isHotlink = isPathCorrect && (holdingsActionStatus === RECORD_ACTION_STATUS.CREATED
        || holdingsActionStatus === RECORD_ACTION_STATUS.UPDATED);

      return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'holdings');
    },
    itemStatus: ({
      itemActionStatus,
      sourceRecordId,
    }) => {
      const entityLabel = getRecordActionStatusLabel(itemActionStatus);
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const instanceId = sourceRecord?.relatedInstanceInfo.idList[0];
      const holdingsId = sourceRecord?.relatedHoldingsInfo.idList[0];
      const itemId = sourceRecord?.relatedItemInfo.idList[0];
      const path = `/inventory/view/${instanceId}/${holdingsId}/${itemId}`;

      const isPathCorrect = !!(instanceId && holdingsId && itemId);
      const isHotlink = isPathCorrect && (itemActionStatus === RECORD_ACTION_STATUS.CREATED
        || itemActionStatus === RECORD_ACTION_STATUS.UPDATED);

      return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'item');
    },
    orderStatus: ({ orderActionStatus }) => getRecordActionStatusLabel(orderActionStatus),
    invoiceStatus: ({
      invoiceActionStatus,
      sourceRecordId,
      sourceRecordOrder,
    }) => {
      const entityLabel = getRecordActionStatusLabel(invoiceActionStatus);
      const sourceRecord = jobLogRecords.find(item => {
        const isIdEqual = item.sourceRecordId === sourceRecordId;
        const isOrderEqual = item.relatedInvoiceLineInfo?.fullInvoiceLineNumber === sourceRecordOrder;

        return isIdEqual && isOrderEqual;
      });
      const invoiceId = sourceRecord?.relatedInvoiceInfo.idList[0];
      const invoiceLineId = sourceRecord?.relatedInvoiceLineInfo.id;
      const path = `/invoice/view/${invoiceId}/line/${invoiceLineId}/view`;

      const isPathCorrect = !!(invoiceId && invoiceLineId);
      const isHotlink = isPathCorrect && (invoiceActionStatus === RECORD_ACTION_STATUS.CREATED);

      return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'invoice');
    },
    error: ({ error }) => (error ? <FormattedMessage id="ui-data-import.error" /> : ''),
  };
  const label = (
    <SettingsLabel
      iconKey={isEdifactType ? FOLIO_RECORD_TYPES.INVOICE.iconKey : 'app'}
      app="data-import"
    >
      <>{jobExecutionsRecords[0]?.fileName}</>
    </SettingsLabel>
  );
  const firstMenu = (
    <PaneMenu>
      <PaneCloseLink to="/data-import" />
    </PaneMenu>
  );

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
        pagingType: 'click',
        pageAmount: RESULT_COUNT_INCREMENT,
        columnWidths: { title: '30%' },
        rowProps: {},
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
  jobLog: {
    type: 'okapi',
    path: 'metadata-provider/jobLogEntries/:{id}/records/:{recordId}',
    throwErrors: false,
    accumulate: true,
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
    jobLogEntries: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }),
    jobLog: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }),
  }).isRequired,
};

export const JobSummary = stripesConnect(JobSummaryComponent);
