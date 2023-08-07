import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get, isEmpty, groupBy } from 'lodash';

import {
  buildSortOrder,
  SORT_TYPES,
} from '@folio/stripes-data-transfer-components/lib/utils';
import { SearchResults } from '@folio/stripes-data-transfer-components/lib/SearchResults';
import {
  buildUrl,
  getNsKey,
  mapNsKeys,
} from '@folio/stripes/smart-components';
import {
  NoValue,
  MCLPagingTypes,
} from '@folio/stripes/components';

import {
  RecordNumberCell,
  TitleCell,
  SRSMarcCell,
  InstanceCell,
  HoldingsCell,
  ItemCell,
  AuthorityCell,
  OrderCell,
  InvoiceCell,
  ErrorCell,
} from '.';
import { BaseLineCell, isGeneralItemsError } from './utils';
import { RECORD_ACTION_STATUS } from '../../../utils';

export const RecordsTable = ({
  mutator,
  nsParams,
  location,
  history,
  resources,
  resources: {
    jobLog: { records: jobLogRecords },
    locations,
  },
  source,
  maxSortKeys,
  defaultSort,
  resultCountIncrement,
  pageAmount,
  isEdifactType,
}) => {
  const { resultOffset } = mutator;

  // remove empty slots from sparse array
  const filteredJobLogEntriesRecords = resources.jobLogEntries?.records?.filter(record => !!record);

  const transitionToParams = values => {
    const nsValues = mapNsKeys(values, nsParams);
    const url = buildUrl(location, nsValues);

    history.push(url);
  };

  const queryParam = name => {
    const { query } = resources;

    const nsKey = getNsKey(name, nsParams);

    return get(query, nsKey);
  };

  const handleSort = (_e, meta) => {
    const sort = buildSortOrder(queryParam('sort') || defaultSort, meta.name, defaultSort, maxSortKeys);

    transitionToParams({ sort });
  };

  const sortOrderQuery = queryParam('sort') || defaultSort;
  const sortDirection = sortOrderQuery.startsWith('-') ? SORT_TYPES.DESCENDING : SORT_TYPES.ASCENDING;
  const sortOrder = sortOrderQuery.replace(/^-/, '').replace(/,.*/, '');

  const visibleColumns = [
    'recordNumber',
    'title',
    'srsMarcStatus',
    'instanceStatus',
    'holdingsStatus',
    'itemStatus',
    'authorityStatus',
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
    authorityStatus: <FormattedMessage id="ui-data-import.recordTypes.authority" />,
    orderStatus: <FormattedMessage id="ui-data-import.recordTypes.order" />,
    invoiceStatus: <FormattedMessage id="ui-data-import.recordTypes.invoice" />,
    error: <FormattedMessage id="ui-data-import.error" />,
  };

  const resultsFormatter = {
    recordNumber: ({ sourceRecordOrder }) => (
      <RecordNumberCell
        isEdifactType={isEdifactType}
        sourceRecordOrder={sourceRecordOrder}
      />
    ),
    title: ({
      sourceRecordTitle,
      sourceRecordId,
      sourceRecordType,
      sourceRecordActionStatus,
      holdingsActionStatus,
      invoiceLineJournalRecordId,
    }) => (
      <TitleCell
        isEdifactType={isEdifactType}
        sourceRecordId={sourceRecordId}
        sourceRecordType={sourceRecordType}
        sourceRecordTitle={sourceRecordTitle}
        holdingsActionStatus={holdingsActionStatus}
        sourceRecordActionStatus={sourceRecordActionStatus}
        invoiceLineJournalRecordId={invoiceLineJournalRecordId}
        jobLogEntriesRecords={filteredJobLogEntriesRecords}
      />
    ),
    srsMarcStatus: ({ sourceRecordActionStatus }) => <SRSMarcCell sourceRecordActionStatus={sourceRecordActionStatus} />,
    instanceStatus: ({
      instanceActionStatus,
      sourceRecordId,
    }) => (
      <InstanceCell
        instanceActionStatus={instanceActionStatus}
        sourceRecordId={sourceRecordId}
        jobLogRecords={jobLogRecords}
      />
    ),
    holdingsStatus: ({ sourceRecordId }) => {
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const holdingsInfo = sourceRecord?.relatedHoldingsInfo;

      if (isEmpty(holdingsInfo)) return <BaseLineCell><NoValue /></BaseLineCell>;

      const itemInfo = sourceRecord?.relatedItemInfo ? [...sourceRecord?.relatedItemInfo] : [{}];
      const instanceId = sourceRecord?.relatedInstanceInfo.idList[0];

      holdingsInfo?.forEach(holdings => {
        const isDiscarded = holdings.actionStatus === RECORD_ACTION_STATUS.DISCARDED;
        const holdingsId = holdings.id;

        if (isDiscarded && !itemInfo.find(item => item.holdingsId === holdingsId)) {
          itemInfo.push({ holdingsId, error: true });
        }
      });

      return (
        <HoldingsCell
          instanceId={instanceId}
          sourceRecord={sourceRecord}
          holdingsInfo={holdingsInfo}
          itemInfo={itemInfo}
          locations={locations.records}
        />
      );
    },
    itemStatus: ({
      sourceRecordId,
      itemActionStatus,
    }) => {
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const holdingsData = sourceRecord?.relatedHoldingsInfo;
      const itemData = sourceRecord?.relatedItemInfo || [];
      const instanceId = sourceRecord?.relatedInstanceInfo.idList[0];

      const isGeneralItemError = isGeneralItemsError(itemData, itemActionStatus);

      if (isGeneralItemError) {
        return (
          <BaseLineCell>
            <FormattedMessage id="ui-data-import.error" />
          </BaseLineCell>
        );
      }

      if (isEmpty(itemData) && isEmpty(holdingsData)) {
        return (
          <BaseLineCell>
            <NoValue />
          </BaseLineCell>
        );
      }

      if (isEmpty(itemData)) {
        const emptyValues = holdingsData?.map((_, index) => (
          <div key={index} style={{ paddingBottom: '7px' }}>
            <NoValue />
          </div>
        ));

        return (
          <BaseLineCell>
            {emptyValues}
          </BaseLineCell>
        );
      }

      const itemInfo = sourceRecord?.relatedItemInfo ? [...sourceRecord?.relatedItemInfo] : [{}];

      holdingsData.forEach(holdings => {
        const isDiscarded = holdings.actionStatus === RECORD_ACTION_STATUS.DISCARDED;
        const holdingsId = holdings.id;

        if (isDiscarded && !itemInfo.find(item => item.holdingsId === holdingsId)) {
          itemInfo.push({ holdingsId, error: true });
        }
      });

      const groupedItemData = groupBy(itemInfo, 'holdingsId');
      const sortedItemData = holdingsData?.map(holdings => groupedItemData[holdings.id]);

      return (
        <ItemCell
          sortedItemData={sortedItemData}
          instanceId={instanceId}
        />
      );
    },
    authorityStatus: ({
      authorityActionStatus,
      sourceRecordId,
    }) => {
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const holdingsData = sourceRecord?.relatedHoldingsInfo;
      const itemData = sourceRecord?.relatedItemInfo;

      const groupedItemData = groupBy(itemData, 'holdingsId');

      const sortedItemData = holdingsData?.map(holdings => groupedItemData[holdings.id])
        .map(element => (!element ? [{}] : element));

      return (
        <AuthorityCell
          authorityActionStatus={authorityActionStatus}
          sourceRecordId={sourceRecordId}
          jobLogRecords={jobLogRecords}
          sortedItemData={sortedItemData}
        />
      );
    },
    orderStatus: ({
      poLineActionStatus,
      sourceRecordId,
    }) => {
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const holdingsData = sourceRecord?.relatedHoldingsInfo;
      const itemData = sourceRecord?.relatedItemInfo;

      const groupedItemData = groupBy(itemData, 'holdingsId');

      const sortedItemData = holdingsData?.map(holdings => groupedItemData[holdings.id])
        .map(element => (element || [{}]));

      return (
        <OrderCell
          poLineActionStatus={poLineActionStatus}
          sourceRecordId={sourceRecordId}
          jobLogRecords={jobLogRecords}
          sortedItemData={sortedItemData}
        />
      );
    },
    invoiceStatus: ({
      invoiceActionStatus,
      sourceRecordId,
      sourceRecordOrder,
    }) => {
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const holdingsData = sourceRecord?.relatedHoldingsInfo;
      const itemData = sourceRecord?.relatedItemInfo;

      const groupedItemData = groupBy(itemData, 'holdingsId');

      const sortedItemData = holdingsData?.map(holdings => groupedItemData[holdings.id])
        .map(element => (element || [{}]));

      return (
        <InvoiceCell
          invoiceActionStatus={invoiceActionStatus}
          sourceRecordId={sourceRecordId}
          jobLogRecords={jobLogRecords}
          sortedItemData={sortedItemData}
          sourceRecordOrder={sourceRecordOrder}
        />
      );
    },
    error: ({
      error,
      sourceRecordId,
      itemActionStatus,
    }) => {
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const holdingsData = sourceRecord?.relatedHoldingsInfo;
      const itemData = sourceRecord?.relatedItemInfo;

      const isGeneralItemError = isGeneralItemsError(itemData, itemActionStatus);

      if (isGeneralItemError) {
        return (
          <BaseLineCell>
            <FormattedMessage id="ui-data-import.error" />
          </BaseLineCell>
        );
      }

      if (isEmpty(itemData) && holdingsData?.some(item => item.error)) {
        return (
          <ErrorCell
            error={error}
            sortedItemData={holdingsData?.map(item => [item])}
          />
        );
      }

      const groupedItemData = groupBy(itemData, 'holdingsId');

      const sortedItemData = holdingsData?.map(holdings => groupedItemData[holdings.id])
        .map(element => (element || [{ error: true }]));

      return (
        <ErrorCell
          error={error}
          sortedItemData={sortedItemData}
        />
      );
    },
  };

  return (
    <SearchResults
      source={source}
      columnMapping={columnMapping}
      visibleColumns={visibleColumns}
      formatter={resultsFormatter}
      resultCountIncrement={resultCountIncrement}
      sortOrder={sortOrder}
      sortDirection={sortDirection}
      resultOffset={resultOffset}
      onHeaderClick={handleSort}
      pagingType={MCLPagingTypes.PREV_NEXT}
      virtualize={false}
      pageAmount={pageAmount}
      columnWidths={{
        recordNumber: '90px',
        title: '30%',
        holdingsStatus: '180px',
        itemStatus: '190px',
      }}
    />
  );
};

RecordsTable.propTypes = {
  resources: PropTypes.shape({
    jobLogEntries: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }),
    jobLog: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }),
    locations: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }),
    query: PropTypes.object,
  }).isRequired,
  mutator: PropTypes.object.isRequired,
  location: PropTypes.oneOfType([
    PropTypes.shape({
      search: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.string.isRequired,
  ]).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  source: PropTypes.shape({
    records: PropTypes.func.isRequired,
    pending: PropTypes.func.isRequired,
    totalCount: PropTypes.func.isRequired,
    fetchMore: PropTypes.func.isRequired,
    fetchOffset: PropTypes.func.isRequired,
  }).isRequired,
  resultCountIncrement: PropTypes.number,
  pageAmount: PropTypes.number,
  nsParams: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  isEdifactType: PropTypes.bool,
  defaultSort: PropTypes.string,
  maxSortKeys: PropTypes.number,
};
RecordsTable.defaultProps = {
  defaultSort: '',
  maxSortKeys: 2,
};
