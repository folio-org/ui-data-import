import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  NoValue,
  MultiColumnList,
} from '@folio/stripes/components';

export const SummaryTable = () => {
  const contentData = new Array(4).fill({});
  const visibleColumns = [
    'summary',
    'srsMarc',
    'instance',
    'holdings',
    'item',
    'order',
    'authority',
    'invoice',
    'error',
  ];
  const columnMapping = {
    summary: <FormattedMessage id="ui-data-import.summary" />,
    srsMarc: <FormattedMessage id="ui-data-import.recordTypes.srsMarc" />,
    instance: <FormattedMessage id="ui-data-import.recordTypes.instance" />,
    holdings: <FormattedMessage id="ui-data-import.recordTypes.holdings" />,
    item: <FormattedMessage id="ui-data-import.recordTypes.item" />,
    order: <FormattedMessage id="ui-data-import.recordTypes.order" />,
    authority: <FormattedMessage id="ui-data-import.recordTypes.authority" />,
    invoice: <FormattedMessage id="ui-data-import.recordTypes.invoice" />,
    error: <FormattedMessage id="ui-data-import.error" />,
  };
  const summaryRows = [
    <FormattedMessage id="ui-data-import.logLight.actionStatus.created" />,
    <FormattedMessage id="ui-data-import.logLight.actionStatus.updated" />,
    <FormattedMessage id="ui-data-import.logLight.actionStatus.discarded" />,
    <FormattedMessage id="ui-data-import.error" />,
  ];
  const checkLastRow = rowIndex => (rowIndex !== 3 ? <NoValue /> : null);

  const resultsFormatter = {
    summary: ({ rowIndex }) => summaryRows[rowIndex],
    srsMarc: ({ rowIndex }) => checkLastRow(rowIndex),
    instance: ({ rowIndex }) => checkLastRow(rowIndex),
    holdings: ({ rowIndex }) => checkLastRow(rowIndex),
    item: ({ rowIndex }) => checkLastRow(rowIndex),
    order: ({ rowIndex }) => checkLastRow(rowIndex),
    authority: ({ rowIndex }) => checkLastRow(rowIndex),
    invoice: ({ rowIndex }) => checkLastRow(rowIndex),
    error: () => null,
  };

  return (
    <MultiColumnList
      id="job-summary-table"
      contentData={contentData}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      formatter={resultsFormatter}
      columnWidths={{ summary: '90px' }}
    />
  );
};
