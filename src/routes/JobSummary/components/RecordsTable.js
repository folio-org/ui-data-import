import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  get,
  isEmpty,
} from 'lodash';

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
import {
  BaseLineCell,
  groupAndSortDataForRender,
  isGeneralItemsError,
} from './utils';
import { RECORD_ACTION_STATUS } from '../../../utils';

export const RecordsTable = ({
  mutator,
  nsParams,
  location,
  history,
  resources,
  resources: { locations },
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
      relatedHoldingsInfo,
      invoiceLineJournalRecordId,
    }) => (
      <TitleCell
        isEdifactType={isEdifactType}
        sourceRecordId={sourceRecordId}
        sourceRecordType={sourceRecordType}
        sourceRecordTitle={sourceRecordTitle}
        holdingsActionStatus={relatedHoldingsInfo?.actionStatus}
        sourceRecordActionStatus={sourceRecordActionStatus}
        invoiceLineJournalRecordId={invoiceLineJournalRecordId}
        jobLogEntriesRecords={filteredJobLogEntriesRecords}
      />
    ),
    srsMarcStatus: ({ sourceRecordActionStatus }) => <SRSMarcCell sourceRecordActionStatus={sourceRecordActionStatus} />,
    instanceStatus: ({ relatedInstanceInfo = {} }) => (
      <InstanceCell relatedInstanceInfo={relatedInstanceInfo} />
    ),
    holdingsStatus: ({
      relatedInstanceInfo = {},
      relatedHoldingsInfo = [],
      relatedItemInfo = [],
    }) => {
      if (isEmpty(relatedHoldingsInfo)) {
        return (
          <BaseLineCell>
            <NoValue />
          </BaseLineCell>
        );
      }

      const itemInfo = !isEmpty(relatedItemInfo) ? [...relatedItemInfo] : [{}];
      const instanceId = relatedInstanceInfo.idList[0];

      relatedHoldingsInfo.forEach(holdings => {
        const isDiscarded = holdings.actionStatus === RECORD_ACTION_STATUS.DISCARDED;
        const holdingsId = holdings.id;

        if (isDiscarded && !itemInfo.find(item => item.holdingsId === holdingsId)) {
          itemInfo.push({ holdingsId, error: true });
        }
      });

      return (
        <HoldingsCell
          instanceId={instanceId}
          relatedHoldingsInfo={relatedHoldingsInfo}
          relatedItemInfo={itemInfo}
          locations={locations.records}
        />
      );
    },
    itemStatus: ({
      relatedInstanceInfo = {},
      relatedHoldingsInfo = [],
      relatedItemInfo = [],
    }) => {
      const instanceId = relatedInstanceInfo.idList[0];
      const isGeneralItemError = isGeneralItemsError(relatedItemInfo);

      if (isGeneralItemError) {
        return (
          <BaseLineCell>
            <FormattedMessage id="ui-data-import.logLight.actionStatus.noAction" />
          </BaseLineCell>
        );
      }

      if (isEmpty(relatedItemInfo) && isEmpty(relatedHoldingsInfo)) {
        return (
          <BaseLineCell>
            <NoValue />
          </BaseLineCell>
        );
      }

      if (isEmpty(relatedItemInfo)) {
        const emptyValues = relatedHoldingsInfo?.map((_, index) => (
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

      if (isEmpty(relatedHoldingsInfo)) {
        return (
          <ItemCell
            sortedItemData={[relatedItemInfo]}
            instanceId={instanceId}
          />
        );
      }

      const itemInfo = relatedItemInfo ? [...relatedItemInfo] : [{}];

      relatedHoldingsInfo?.forEach(holdings => {
        const isDiscarded = holdings.actionStatus === RECORD_ACTION_STATUS.DISCARDED;
        const holdingsId = holdings.id;

        if (isDiscarded && !itemInfo.find(item => item.holdingsId === holdingsId)) {
          itemInfo.push({ holdingsId, error: true });
        }
      });

      const sortedItemData = groupAndSortDataForRender(relatedItemInfo, relatedHoldingsInfo);

      return (
        <ItemCell
          sortedItemData={sortedItemData}
          instanceId={instanceId}
        />
      );
    },
    authorityStatus: ({
      relatedHoldingsInfo = [],
      relatedItemInfo = [],
      relatedAuthorityInfo = {},
    }) => {
      const sortedItemData = groupAndSortDataForRender(relatedItemInfo, relatedHoldingsInfo);

      return (
        <AuthorityCell
          relatedAuthorityInfo={relatedAuthorityInfo}
          sortedItemData={sortedItemData}
        />
      );
    },
    orderStatus: ({
      relatedHoldingsInfo = [],
      relatedItemInfo = [],
      relatedPoLineInfo = {},
    }) => {
      const sortedItemData = groupAndSortDataForRender(relatedItemInfo, relatedHoldingsInfo);

      return (
        <OrderCell
          relatedPoLineInfo={relatedPoLineInfo}
          sortedItemData={sortedItemData}
        />
      );
    },
    invoiceStatus: ({
      relatedHoldingsInfo = [],
      relatedItemInfo = [],
      relatedInvoiceInfo = {},
      relatedInvoiceLineInfo = {},
    }) => {
      const sortedItemData = groupAndSortDataForRender(relatedItemInfo, relatedHoldingsInfo);

      return (
        <InvoiceCell
          relatedInvoiceInfo={relatedInvoiceInfo}
          relatedInvoiceLineInfo={relatedInvoiceLineInfo}
          sortedItemData={sortedItemData}
        />
      );
    },
    error: ({
      error,
      relatedInstanceInfo = {},
      relatedHoldingsInfo = [],
      relatedItemInfo = [],
      relatedAuthorityInfo = {},
      relatedPoLineInfo = {},
      relatedInvoiceLineInfo = {},
    }) => {
      const isGeneralItemError = isGeneralItemsError(relatedItemInfo);
      const isGeneralError = relatedInstanceInfo.error || relatedAuthorityInfo.error
        || relatedPoLineInfo.error || relatedInvoiceLineInfo.error;

      if (isGeneralItemError || isGeneralError) {
        return (
          <BaseLineCell>
            <FormattedMessage id="ui-data-import.error" />
          </BaseLineCell>
        );
      }

      if (isEmpty(relatedItemInfo) && relatedHoldingsInfo?.some(item => item.error)) {
        return (
          <ErrorCell
            error={error}
            sortedItemData={relatedHoldingsInfo?.map(item => [item])}
          />
        );
      }

      const sortedItemData = groupAndSortDataForRender(relatedItemInfo, relatedHoldingsInfo, true);

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
