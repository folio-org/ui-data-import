import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  buildSortOrder,
  createUrl,
  SORT_TYPES,
} from '@folio/stripes-data-transfer-components/lib/utils';
import { SearchResults } from '@folio/stripes-data-transfer-components/lib/SearchResults';
import {
  buildUrl,
  getNsKey,
  mapNsKeys,
} from '@folio/stripes/smart-components';
import {
  Button,
  NoValue,
} from '@folio/stripes/components';
import { pagingTypes } from '@folio/stripes-components/lib/MultiColumnList';

import { FOLIO_RECORD_TYPES } from '../../../components';

import {
  RECORD_ACTION_STATUS,
  RECORD_ACTION_STATUS_LABEL_IDS,
} from '../../../utils';

import sharedCss from '../../../shared.css';

const getRecordActionStatusLabel = recordType => {
  if (!recordType) return <NoValue />;

  const labelId = RECORD_ACTION_STATUS_LABEL_IDS[recordType];

  return <FormattedMessage id={labelId} />;
};

export const RecordsTable = ({
  mutator,
  nsParams,
  location,
  history,
  resources,
  resources: { jobLog: { records: jobLogRecords } },
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
    recordNumber: ({ sourceRecordOrder }) => {
      if (isEdifactType) return sourceRecordOrder;

      return parseInt(sourceRecordOrder, 10) + 1;
    },
    title: ({
      sourceRecordTitle,
      sourceRecordId,
      sourceRecordType,
      sourceRecordActionStatus,
      holdingsActionStatus,
      invoiceLineJournalRecordId,
    }) => {
      const jobExecutionId = filteredJobLogEntriesRecords[0]?.jobExecutionId;
      const path = createUrl(`/data-import/log/${jobExecutionId}/${sourceRecordId}`,
        isEdifactType ? { instanceLineId: invoiceLineJournalRecordId } : {});

      const isHoldingsRecordImportFailed = sourceRecordType === FOLIO_RECORD_TYPES.MARC_HOLDINGS.type
        && (sourceRecordActionStatus === RECORD_ACTION_STATUS.DISCARDED
          || holdingsActionStatus === RECORD_ACTION_STATUS.DISCARDED);

      const title = isHoldingsRecordImportFailed
        ? 'Holdings'
        : sourceRecordTitle;

      return (
        <Button
          buttonStyle="link"
          target="_blank"
          marginBottom0
          to={path}
          buttonClass={sharedCss.cellLink}
        >
          {title}
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
    authorityStatus: ({
      authorityActionStatus,
      sourceRecordId,
    }) => {
      const entityLabel = getRecordActionStatusLabel(authorityActionStatus);
      const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
      const authorityId = sourceRecord?.relatedAuthorityInfo.idList[0];
      const path = `/marc-authorities/authorities/${authorityId}`;

      const isPathCorrect = !!authorityId;
      const isHotlink = isPathCorrect && (authorityActionStatus === RECORD_ACTION_STATUS.CREATED
        || authorityActionStatus === RECORD_ACTION_STATUS.UPDATED);

      return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'authority');
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
      pagingType={pagingTypes.PREV_NEXT}
      virtualize={false}
      pageAmount={pageAmount}
      columnWidths={{
        recordNumber: '90px',
        title: '30%',
      }}
    />
  );
};

RecordsTable.propTypes = {
  resources: PropTypes.shape({
    jobLogEntries: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }),
    jobLog: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }),
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
