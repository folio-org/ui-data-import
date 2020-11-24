import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  SearchAndSortPane,
  SettingsLabel,
} from '@folio/stripes-data-transfer-components';
import { NoValue } from '@folio/stripes/components';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

// TODO: Remove when the endpoint job summary is ready and retrieve it from props instead
const resourcesMock = {
  jobLog: {
    hasLoaded: true,
    isPending: false,
    failed: false,
    records: [{}],
    other: { totalRecords: 1 },
  },
  resultCount: INITIAL_RESULT_COUNT,
};

const JobSummaryComponent = ({
  mutator,
  resources: { jobExecutions: { records } },
}) => {
  const visibleColumns = [
    'recordNumber',
    'title',
    'srsMarcBib',
    'instance',
    'holdings',
    'item',
    'order',
    'invoice',
    'error',
  ];
  const columnMapping = {
    recordNumber: <FormattedMessage id="ui-data-import.record" />,
    title: <FormattedMessage id="ui-data-import.title" />,
    srsMarcBib: <FormattedMessage id="ui-data-import.recordTypes.srsMarcBib" />,
    instance: <FormattedMessage id="ui-data-import.recordTypes.instance" />,
    holdings: <FormattedMessage id="ui-data-import.recordTypes.holdings" />,
    item: <FormattedMessage id="ui-data-import.recordTypes.item" />,
    order: <FormattedMessage id="ui-data-import.recordTypes.order" />,
    invoice: <FormattedMessage id="ui-data-import.recordTypes.invoice" />,
    error: <FormattedMessage id="ui-data-import.error" />,
  };
  // TODO: Refactor the formatter for the real data when the endpoint for job summary is ready
  const resultsFormatter = {
    recordNumber: x => x.rowIndex + 1,
    srsMarcBib: () => <NoValue />,
    instance: () => <NoValue />,
    holdings: () => <NoValue />,
    item: () => <NoValue />,
    order: () => <NoValue />,
    invoice: () => <NoValue />,
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
      resourceName="jobLog"
      initialResultCount={INITIAL_RESULT_COUNT}
      resultCountIncrement={RESULT_COUNT_INCREMENT}
      hasSearchForm={false}
      defaultSort="recordNumber"
      parentMutator={mutator}
      parentResources={resourcesMock}
      lastMenu={<></>}
    />
  );
};

// TODO: Refactor the manifest when the endpoint for job summary is ready.
// For now it makes call to the `metadata-provider/jobExecutions` to get
// the file name to display it in the pane header
JobSummaryComponent.manifest = Object.freeze({
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  jobExecutions: {
    type: 'okapi',
    path: 'metadata-provider/jobExecutions',
    records: 'jobExecutions',
    throwsErrors: false,
    params: { query: 'progress.jobExecutionId==":{id}"' },
  },
});

JobSummaryComponent.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.shape({
    jobExecutions: PropTypes.shape({
      records: PropTypes.arrayOf(
        PropTypes.shape({ fileName: PropTypes.string.isRequired }),
      ).isRequired,
    }),
  }).isRequired,
};

export const JobSummary = stripesConnect(JobSummaryComponent);
