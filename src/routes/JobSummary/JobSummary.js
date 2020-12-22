import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';
import {
  SearchAndSortPane,
  SettingsLabel,
} from '@folio/stripes-data-transfer-components';

import { NoValue } from '@folio/stripes/components';

import {
  RECORD_ACTION_STATUS_LABEL_IDS,
  FIND_ALL_CQL,
} from '../../utils';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

const queryTemplate = '(sortby "%{query.query}")';
const sortMap = {
  recordNumber: 'sourceRecordOrder',
  title: 'sourceRecordTitle',
  srsMarcBibStatus: 'sourceRecordActionStatus',
  instanceStatus: 'instanceActionStatus',
  holdingsStatus: 'holdingsActionStatus',
  itemStatus: 'itemActionStatus',
  orderStatus: 'orderActionStatus',
  invoiceStatus: 'invoiceActionStatus',
  error: 'error',
};

const JobSummaryComponent = ({
  mutator,
  resources,
  resources: { jobExecutions: { records } },
}) => {
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
    recordNumber: ({ sourceRecordOrder }) => sourceRecordOrder + 1,
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
      iconKey="app"
      app="data-import"
    >
      <>{records[0]?.fileName}</>
    </SettingsLabel>
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
      searchResultsProps={{
        onRowClick: noop,
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
  jobLogEntries: {
    type: 'okapi',
    perRequest: RESULT_COUNT_INCREMENT,
    path: 'metadata-provider/jobLogEntries/:{id}',
    records: 'entries',
    clientGeneratePk: false,
    throwsErrors: false,
    GET: {
      params: {
        query: makeQueryFunction(
          FIND_ALL_CQL,
          queryTemplate,
          sortMap,
          [],
        ),
      },
      staticFallback: { params: {} },
    },
  },
  jobExecutions: {
    type: 'okapi',
    path: 'change-manager/jobExecutions/:{id}',
    throwsErrors: false,
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
        }),
      ).isRequired,
    }),
  }).isRequired,
};

export const JobSummary = stripesConnect(JobSummaryComponent);
