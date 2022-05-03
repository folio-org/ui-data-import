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
  const resultsFormatter = {
    summary: ({ rowIndex }) => summaryRows[rowIndex],
    srsMarc: () => <NoValue />,
    instance: () => <NoValue />,
    holdings: () => <NoValue />,
    item: () => <NoValue />,
    order: () => <NoValue />,
    authority: () => <NoValue />,
    invoice: () => <NoValue />,
    error: () => <NoValue />,
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
