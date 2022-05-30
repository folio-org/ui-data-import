import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import {
  NoValue,
  MultiColumnList,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import { Preloader } from '@folio/stripes-data-transfer-components';

const summaryLabels = [
  <FormattedMessage id="ui-data-import.logLight.actionStatus.created" />,
  <FormattedMessage id="ui-data-import.logLight.actionStatus.updated" />,
  <FormattedMessage id="ui-data-import.logLight.actionStatus.discarded" />,
  <FormattedMessage id="ui-data-import.error" />,
];

const SummaryTableComponent = ({ resources: { jobSummary: { records: jobSummaryRecords } } }) => {
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
  const getResultsCellContent = (column, rowIndex) => {
    if (!column) {
      return <NoValue />;
    }

    const totalEntitiesKeys = ['totalCreatedEntities', 'totalUpdatedEntities', 'totalDiscardedEntities', 'totalErrors'];

    return column[totalEntitiesKeys[rowIndex]];
  };

  const resultsFormatter = {
    srsMarc: ({ rowIndex, sourceRecordSummary }) => getResultsCellContent(sourceRecordSummary, rowIndex),
    instance: ({ rowIndex, instanceSummary }) => getResultsCellContent(instanceSummary, rowIndex),
    holdings: ({ rowIndex, holdingSummary }) => getResultsCellContent(holdingSummary, rowIndex),
    item: ({ rowIndex, itemSummary }) => getResultsCellContent(itemSummary, rowIndex),
    authority: ({ rowIndex, authoritySummary }) => getResultsCellContent(authoritySummary, rowIndex),
    order: ({ rowIndex, orderSummary }) => getResultsCellContent(orderSummary, rowIndex),
    invoice: ({ rowIndex, invoiceSummary }) => getResultsCellContent(invoiceSummary, rowIndex),
    error: ({ rowIndex, totalErrors }) => {
      if (isLastRow(rowIndex)) {
        return totalErrors;
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
