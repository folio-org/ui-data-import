import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import {
  NoValue,
  MultiColumnList,
  TextLink,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  FOLIO_RECORD_TYPES,
  Preloader,
} from '@folio/stripes-data-transfer-components';
import { useLocation } from 'react-router-dom';

const summaryLabels = [
  <FormattedMessage id="ui-data-import.logLight.actionStatus.created" />,
  <FormattedMessage id="ui-data-import.logLight.actionStatus.updated" />,
  <FormattedMessage id="ui-data-import.logLight.actionStatus.discarded" />,
  <FormattedMessage id="ui-data-import.error" />,
];

const RECORD_TYPES = {
  SRS_MARC: 'SRS_MARC',
  INSTANCE: FOLIO_RECORD_TYPES.INSTANCE.type,
  HOLDINGS: FOLIO_RECORD_TYPES.HOLDINGS.type,
  ITEM: FOLIO_RECORD_TYPES.ITEM.type,
  AUTHORITY: FOLIO_RECORD_TYPES.AUTHORITY.type,
  ORDER: FOLIO_RECORD_TYPES.ORDER.type,
  INVOICE: FOLIO_RECORD_TYPES.INVOICE.type,
};

const SummaryTableComponent = ({
  resources: { jobSummary: { records: jobSummaryRecords } },
  jobExecutionId,
}) => {
  const { pathname, search } = useLocation();

  const contentData = new Array(4).fill({}).map((_, index) => ({
    summary: summaryLabels[index],
    ...jobSummaryRecords[0],
  }));
  const visibleColumns = [
    'summary',
    'srsMarc',
    'instance',
    'holdings',
    'item',
    'authority',
    'order',
    'invoice',
    'error',
  ];
  const columnMapping = {
    summary: <FormattedMessage id="ui-data-import.summary" />,
    srsMarc: <FormattedMessage id="ui-data-import.recordTypes.srsMarc" />,
    instance: <FormattedMessage id="ui-data-import.recordTypes.instance" />,
    holdings: <FormattedMessage id="ui-data-import.recordTypes.holdings" />,
    item: <FormattedMessage id="ui-data-import.recordTypes.item" />,
    authority: <FormattedMessage id="ui-data-import.recordTypes.authority" />,
    order: <FormattedMessage id="ui-data-import.recordTypes.order" />,
    invoice: <FormattedMessage id="ui-data-import.recordTypes.invoice" />,
    error: <FormattedMessage id="ui-data-import.error" />,
  };

  const isLastRow = rowIndex => rowIndex === 3;
  const getResultsCellContent = (column, rowIndex, entity) => {
    if (!column) {
      return <NoValue />;
    }

    const totalEntitiesKeys = ['totalCreatedEntities', 'totalUpdatedEntities', 'totalDiscardedEntities', 'totalErrors'];
    const cellContent = column[totalEntitiesKeys[rowIndex]];

    if (isLastRow(rowIndex) && cellContent > 0) {
      return (
        <TextLink
          to={{
            pathname: `/data-import/job-summary/${jobExecutionId}`,
            search: `?errorsOnly=true&entity=${entity}`,
            state: { from: `${pathname}${search}` }
          }}
        >
          {cellContent}
        </TextLink>
      );
    }

    return cellContent;
  };

  const resultsFormatter = {
    srsMarc: ({ rowIndex, sourceRecordSummary }) => getResultsCellContent(sourceRecordSummary, rowIndex, RECORD_TYPES.SRS_MARC),
    instance: ({ rowIndex, instanceSummary }) => getResultsCellContent(instanceSummary, rowIndex, RECORD_TYPES.INSTANCE),
    holdings: ({ rowIndex, holdingSummary }) => getResultsCellContent(holdingSummary, rowIndex, RECORD_TYPES.HOLDINGS),
    item: ({ rowIndex, itemSummary }) => getResultsCellContent(itemSummary, rowIndex, RECORD_TYPES.ITEM),
    authority: ({ rowIndex, authoritySummary }) => getResultsCellContent(authoritySummary, rowIndex, RECORD_TYPES.AUTHORITY),
    order: ({ rowIndex, orderSummary }) => getResultsCellContent(orderSummary, rowIndex, RECORD_TYPES.ORDER),
    invoice: ({ rowIndex, invoiceSummary }) => getResultsCellContent(invoiceSummary, rowIndex, RECORD_TYPES.INVOICE),
    error: ({ rowIndex, totalErrors }) => {
      if (isLastRow(rowIndex)) {
        return totalErrors > 0
          ? (
            <TextLink
              to={{
                pathname: `/data-import/job-summary/${jobExecutionId}`,
                search: '?errorsOnly=true',
                state: { from: `${pathname}${search}` }
              }}
            >
              {totalErrors}
            </TextLink>
          )
          : totalErrors;
      }

      return <NoValue />;
    },
  };

  return (
    isEmpty(jobSummaryRecords)
      ? <Preloader />
      : (
        <MultiColumnList
          id="job-summary-table"
          columnIdPrefix="job-summary-table"
          contentData={contentData}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          formatter={resultsFormatter}
          columnWidths={{ summary: '90px' }}
        />
      )
  );
};

SummaryTableComponent.propTypes = {
  resources: PropTypes.shape({
    jobSummary: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  jobExecutionId: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
};

SummaryTableComponent.manifest = Object.freeze({
  jobSummary: {
    type: 'okapi',
    path: 'metadata-provider/jobSummary/!{jobExecutionId}',
    throwErrors: false,
  },
});

export const SummaryTable = stripesConnect(SummaryTableComponent);
