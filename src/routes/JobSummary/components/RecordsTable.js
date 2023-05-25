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

export const RecordsTable = ({
  mutator,
  nsParams,
  location,
  history,
  resources,
  resources: {
    // jobLog: { records: jobLogRecords },
    locations,
  },
  // source,
  maxSortKeys,
  defaultSort,
  resultCountIncrement,
  pageAmount,
  isEdifactType,
}) => {
  const jobLogRecords = [{
    jobExecutionId : '467d7627-c0db-4fb7-b333-4b4983dbf781',
    sourceRecordId : '59138d56-bc81-4f66-9f72-f57f53621111',
    sourceRecordOrder : 0,
    sourceRecordTitle : 'The Journal of ecclesiastical history.',
    sourceRecordActionStatus : 'CREATED',
    instanceActionStatus: 'CREATED',
    error : '',
    relatedInstanceInfo : {
      actionStatus : 'CREATED',
      idList : ['720031b9-a792-4936-963c-a7b63fb96574'],
      hridList : ['in00000000014'],
      error : ''
    },
    relatedHoldingsInfo : [],
    relatedItemInfo : [],
    relatedAuthorityInfo: {
      idList : [],
      hridList : []
    },
    relatedPoLineInfo: {
      idList: [],
      hridList : []
    },
    relatedInvoiceInfo : {
      idList : [],
      hridList : []
    },
    relatedInvoiceLineInfo : { }
  }, {
    jobExecutionId : '467d7627-c0db-4fb7-b333-4b4983dbf781',
    sourceRecordId : '59138d56-bc81-4f66-9f72-f57f53622222',
    sourceRecordOrder : 1,
    sourceRecordTitle : 'The Journal of ecclesiastical history.',
    sourceRecordActionStatus : 'CREATED',
    instanceActionStatus: 'CREATED',
    authorityActionStatus: 'CREATED',
    error : '',
    relatedInstanceInfo : {
      actionStatus : 'CREATED',
      idList : ['720031b9-a792-4936-963c-a7b63fb96574'],
      hridList : ['in00000000014'],
      error : ''
    },
    relatedHoldingsInfo : [{
      actionStatus : 'CREATED',
      id : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      permanentLocationId: '53cf956f-c1df-410b-8bea-27f712cca7c0',
      hrid : 'ho00000000017',
      error : ''
    }],
    relatedItemInfo : [{
      actionStatus : 'CREATED',
      id : '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
      hrid : 'it00000000015',
      holdingsId : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      error : ''
    }],
    relatedAuthorityInfo: {
      idList : ['testAuthId'],
      hridList : []
    },
    relatedPoLineInfo: {
      idList: [],
      hridList : []
    },
    relatedInvoiceInfo : {
      idList : [],
      hridList : []
    },
    relatedInvoiceLineInfo : { }
  }, {
    jobExecutionId : '467d7627-c0db-4fb7-b333-4b4983dbf781',
    sourceRecordId : '59138d56-bc81-4f66-9f72-f57f53623333',
    sourceRecordOrder : 2,
    sourceRecordTitle : 'The Journal of ecclesiastical history.',
    sourceRecordActionStatus : 'CREATED',
    instanceActionStatus: 'CREATED',
    error : '',
    relatedInstanceInfo : {
      actionStatus : 'CREATED',
      idList : ['720031b9-a792-4936-963c-a7b63fb96574'],
      hridList : ['in00000000014'],
      error : ''
    },
    relatedHoldingsInfo : [{
      actionStatus : 'CREATED',
      id : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      permanentLocationId: '53cf956f-c1df-410b-8bea-27f712cca7c0',
      hrid : 'ho00000000017',
      error : ''
    }],
    relatedItemInfo : [{
      actionStatus : 'DISCARDED',
      id : '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
      hrid : 'it00000000015',
      holdingsId : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      error : 'test error'
    }],
    relatedAuthorityInfo: {
      idList : [],
      hridList : []
    },
    relatedPoLineInfo: {
      idList: [],
      hridList : []
    },
    relatedInvoiceInfo : {
      idList : [],
      hridList : []
    },
    relatedInvoiceLineInfo : { }
  }, {
    jobExecutionId : '467d7627-c0db-4fb7-b333-4b4983dbf781',
    sourceRecordId : '59138d56-bc81-4f66-9f72-f57f53624444',
    sourceRecordOrder : 3,
    sourceRecordTitle : 'The Journal of ecclesiastical history.',
    sourceRecordActionStatus : 'CREATED',
    instanceActionStatus: 'DISCARDED',
    error : '',
    relatedInstanceInfo : {
      actionStatus : 'CREATED',
      idList : ['720031b9-a792-4936-963c-a7b63fb96574'],
      hridList : ['in00000000014'],
      error : ''
    },
    relatedHoldingsInfo : [{
      actionStatus : 'DISCARDED',
      id : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      permanentLocationId: '53cf956f-c1df-410b-8bea-27f712cca7c0',
      hrid : 'ho00000000017',
      error : 'error'
    }],
    relatedItemInfo : [],
    relatedAuthorityInfo: {
      idList : [],
      hridList : []
    },
    relatedPoLineInfo: {
      idList: [],
      hridList : []
    },
    relatedInvoiceInfo : {
      idList : [],
      hridList : []
    },
    relatedInvoiceLineInfo : { }
  }, {
    jobExecutionId : '467d7627-c0db-4fb7-b333-4b4983dbf781',
    sourceRecordId : '59138d56-bc81-4f66-9f72-f57f53629646',
    sourceRecordOrder : 4,
    sourceRecordTitle : 'The Journal of ecclesiastical history22222.',
    sourceRecordActionStatus : 'CREATED',
    instanceActionStatus: 'CREATED',
    error : '',
    relatedInstanceInfo : {
      actionStatus : 'CREATED',
      idList : ['720031b9-a792-4936-963c-a7b63fb96574'],
      hridList : ['in00000000014'],
      error : ''
    },
    relatedHoldingsInfo : [{
      actionStatus : 'CREATED',
      id : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      permanentLocationId: '53cf956f-c1df-410b-8bea-27f712cca7c0',
      hrid : 'ho00000000017',
      error : ''
    }, {
      actionStatus: 'MULTIPLE',
      id : '5cadf17f-eb72-475c-a2e0-7e56f54f0000',
      permanentLocationId: '758258bc-ecc1-41b8-abca-f7b610822ffd',
      hrid : 'ho00000000018',
      error : ''
    }, {
      actionStatus : 'CREATED',
      id : '5cadf17f-eb72-475c-a2e0-7e56f54fd3b4',
      permanentLocationId: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
      hrid : 'ho00000000014',
      error : ''
    }],
    relatedItemInfo : [{
      actionStatus : 'CREATED',
      id : '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
      hrid : 'it00000000015',
      holdingsId : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      error : ''
    }, {
      actionStatus : 'CREATED',
      id : '10dfe33d-948f-46a8-819a-64d5b1eee839',
      hrid : 'it00000000017',
      holdingsId : '5cadf17f-eb72-475c-a2e0-7e56f54fd3b4',
      error : ''
    }, {
      actionStatus : 'DISCARDED',
      id : 'ccd19bf0-add1-46bb-899b-c457fd448b51',
      hrid : 'it00000000016',
      holdingsId : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      error : 'test error'
    }, {
      actionStatus : 'CREATED',
      id : 'ccd19bf0-add1-46bb-899b-c457fd441111',
      hrid : 'it00000000019',
      holdingsId : '5cadf17f-eb72-475c-a2e0-7e56f54f0000',
      error : ''
    }, {
      actionStatus : 'CREATED',
      id : '3bcfe427-a747-405f-b3f3-1d842ffb2222',
      hrid : 'it00000000018',
      holdingsId : '5cadf17f-eb72-475c-a2e0-7e56f54f0000',
      error : ''
    }, {
      actionStatus : 'CREATED',
      id : '3bcfe427-a747-405f-b3f3-1d842ffb49c6',
      hrid : 'it00000000014',
      holdingsId : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      error : ''
    }],
    relatedAuthorityInfo: {
      idList : [],
      hridList : []
    },
    relatedPoLineInfo: {
      idList: [],
      hridList : []
    },
    relatedInvoiceInfo : {
      idList : [],
      hridList : []
    },
    relatedInvoiceLineInfo : { }
  }, {
    jobExecutionId : '467d7627-c0db-4fb7-b333-4b4983dbf781',
    sourceRecordId : '59138d56-bc81-4f66-9f72-f57f53620000',
    sourceRecordOrder : 5,
    sourceRecordTitle : 'The Journal of ecclesiastical history.',
    sourceRecordActionStatus : 'CREATED',
    instanceActionStatus: 'UPDATED',
    error : '',
    relatedInstanceInfo : {
      actionStatus : 'CREATED',
      idList : ['720031b9-a792-4936-963c-a7b63fb96574'],
      hridList : ['in00000000014'],
      error : ''
    },
    relatedHoldingsInfo : [{
      actionStatus : 'UPDATED',
      id : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      permanentLocationId: '53cf956f-c1df-410b-8bea-27f712cca7c0',
      hrid : 'ho00000000017',
      error : ''
    }, {
      actionStatus: 'DISCARDED',
      id : '5cadf17f-eb72-475c-a2e0-7e56f54f0000',
      permanentLocationId: '758258bc-ecc1-41b8-abca-f7b610822ffd',
      hrid : 'ho00000000018',
      error : ''
    }, {
      actionStatus : 'CREATED',
      id : '5cadf17f-eb72-475c-a2e0-7e56f54fd3b4',
      permanentLocationId: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
      hrid : 'ho00000000014',
      error : ''
    }],
    relatedItemInfo : [{
      actionStatus : 'CREATED',
      id : '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
      hrid : 'it00000000015',
      holdingsId : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      error : ''
    }, {
      actionStatus : 'CREATED',
      id : '10dfe33d-948f-46a8-819a-64d5b1eee839',
      hrid : 'it00000000017',
      holdingsId : '5cadf17f-eb72-475c-a2e0-7e56f54fd3b4',
      error : ''
    }, {
      actionStatus : 'DISCARDED',
      id : 'ccd19bf0-add1-46bb-899b-c457fd448b51',
      hrid : 'it00000000016',
      holdingsId : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      error : 'Test error'
    }, {
      actionStatus : 'CREATED',
      id : '3bcfe427-a747-405f-b3f3-1d842ffb49c6',
      hrid : 'it00000000014',
      holdingsId : 'f648c370-d9d6-432c-a502-b8eb718f867c',
      error : ''
    }],
    relatedAuthorityInfo: {
      idList : [],
      hridList : []
    },
    relatedPoLineInfo: {
      idList: [],
      hridList : []
    },
    relatedInvoiceInfo : {
      idList : [],
      hridList : []
    },
    relatedInvoiceLineInfo : { }
  }];
  const source = {
    records: () => jobLogRecords,
    pending: () => false,
    totalCount: () => 1,
    fetchMore: () => {},
    fetchOffset: () => {},
  };
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
      const itemInfo = sourceRecord?.relatedItemInfo;
      const instanceId = sourceRecord?.relatedInstanceInfo.idList[0];

      if (isEmpty(holdingsInfo)) return <NoValue />;

      holdingsInfo.forEach(holdings => {
        const isDiscarded = holdings.actionStatus === 'DISCARDED';
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
    itemStatus: ({ sourceRecordId }) => {
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const holdingsData = sourceRecord?.relatedHoldingsInfo;
      const itemData = sourceRecord?.relatedItemInfo;
      const instanceId = sourceRecord?.relatedInstanceInfo.idList[0];

      if (isEmpty(itemData)) return <NoValue />;

      const groupedItemData = groupBy(itemData, 'holdingsId');
      const sortedItemData = holdingsData.map(holdings => groupedItemData[holdings.id]);

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
      const sortedItemData = holdingsData.map(holdings => groupedItemData[holdings.id]);

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
      const sortedItemData = holdingsData.map(holdings => groupedItemData[holdings.id]);

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
      const sortedItemData = holdingsData.map(holdings => groupedItemData[holdings.id]);

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
    }) => {
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const holdingsData = sourceRecord?.relatedHoldingsInfo;
      const itemData = sourceRecord?.relatedItemInfo;

      const groupedItemData = groupBy(itemData, 'holdingsId');
      const sortedItemData = holdingsData.map(holdings => groupedItemData[holdings.id]);

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
        itemStatus: '180px',
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
