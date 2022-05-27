import React, {
  useEffect,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import { makeConnectedSource } from '@folio/stripes/smart-components';
import { SettingsLabel } from '@folio/stripes-data-transfer-components';
import {
  PaneMenu,
  PaneCloseLink,
  Pane,
  PaneHeader,
  Paneset,
} from '@folio/stripes/components';
import css from '@folio/stripes-data-transfer-components/lib/SearchAndSortPane/SearchAndSortPane.css';
import sharedCss from '../../shared.css';

import {
  SummaryTable,
  RecordsTable,
} from './components';
import { FOLIO_RECORD_TYPES } from '../../components';

import { DATA_TYPES } from '../../utils';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

const SORT_TYPE = {
  DESCENDING: 'desc',
  ASCENDING: 'asc',
};

const sortMap = {
  recordNumber: 'source_record_order',
  title: 'title',
  srsMarcStatus: 'source_record_action_status',
  instanceStatus: 'instance_action_status',
  holdingsStatus: 'holdings_action_status',
  itemStatus: 'item_action_status',
  authorityStatus: 'authority_action_status',
  orderStatus: 'order_action_status',
  invoiceStatus: 'invoice_action_status',
  error: 'error',
};

const JobSummaryComponent = props => {
  const {
    stripes,
    mutator,
    resources,
    resources: {
      jobExecutions: { records: jobExecutionsRecords },
      jobLogEntries: { records: jobLogEntriesRecords },
    },
    location,
    history,
  } = props;

  const dataType = jobExecutionsRecords[0]?.jobProfileInfo.dataType;
  const isEdifactType = dataType === DATA_TYPES[1];
  const jobExecutionsId = jobExecutionsRecords[0]?.id;

  const { id } = useParams();

  // persist previous jobExecutionsId
  const previousJobExecutionsIdRef = useRef(jobExecutionsId);

  useEffect(() => {
    if (previousJobExecutionsIdRef.current !== id) {
      mutator?.resultOffset?.replace(0);
    }
  }, [id, mutator]);

  useEffect(() => {
    if (jobExecutionsId && previousJobExecutionsIdRef.current !== jobExecutionsId) {
      jobLogEntriesRecords.forEach(entry => {
        const recordId = isEdifactType ? entry.invoiceLineJournalRecordId : entry.sourceRecordId;

        mutator.jobLog.GET({ path: `metadata-provider/jobLogEntries/${jobExecutionsId}/records/${recordId}` });
      });
    }
  }, [jobExecutionsId, jobLogEntriesRecords]); // eslint-disable-line react-hooks/exhaustive-deps

  const getSource = () => {
    const resourceName = 'jobLogEntries';
    const parentResources = resources;
    const connectedSourceProps = {
      ...props,
      parentResources,
    };

    return makeConnectedSource(connectedSourceProps, stripes.logger, resourceName);
  };

  const renderHeader = renderProps => {
    const resultCountMessageId = 'stripes-smart-components.searchResultsCountHeader';
    const label = (
      <SettingsLabel
        iconKey={isEdifactType ? FOLIO_RECORD_TYPES.INVOICE.iconKey : 'app'}
        app="data-import"
      >
        <>{jobExecutionsRecords[0]?.fileName}</>
      </SettingsLabel>
    );
    const firstMenu = (
      <PaneMenu>
        <PaneCloseLink to="/data-import" />
      </PaneMenu>
    );

    return (
      <PaneHeader
        {...renderProps}
        paneTitle={label}
        paneSub={(
          <FormattedMessage
            id={resultCountMessageId}
            values={{ count: getSource().totalCount() }}
          />
        )}
        firstMenu={firstMenu}
      />
    );
  };

  return (
    <Paneset data-testid="pane">
      <Pane
        id="pane-results"
        data-testid="pane-results"
        defaultWidth="fill"
        noOverflow
        padContent={false}
        renderHeader={renderHeader}
      >
        <div className={css.paneBody}>
          <div className={sharedCss.separatorLine}>
            <SummaryTable jobExecutionId={jobExecutionsId} />
          </div>
          <div className={css.searchResults}>
            <RecordsTable
              resources={resources}
              mutator={mutator}
              location={location}
              history={history}
              source={getSource()}
              isEdifactType={isEdifactType}
              resultCountIncrement={RESULT_COUNT_INCREMENT}
              pageAmount={RESULT_COUNT_INCREMENT}
            />
          </div>
        </div>
      </Pane>
    </Paneset>
  );
};

JobSummaryComponent.manifest = Object.freeze({
  initializedFilterConfig: { initialValue: false },
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  jobLogEntries: {
    type: 'okapi',
    records: 'entries',
    resultDensity: 'sparse',
    resultOffset: '%{resultOffset}',
    perRequest: RESULT_COUNT_INCREMENT,
    path: 'metadata-provider/jobLogEntries/:{id}',
    clientGeneratePk: false,
    throwErrors: false,
    GET: {
      params: {
        sortBy: queryParams => {
          const { sort: sortsFromQuery } = queryParams;

          const sorts = sortsFromQuery ? sortsFromQuery.split(',') : [];
          const mainSort = sorts[0] || '';
          const sort = mainSort.replace(/^-/, '');

          return sortMap[sort];
        },
        order: queryParams => {
          const { sort: sortsFromQuery } = queryParams;

          const sorts = sortsFromQuery ? sortsFromQuery.split(',') : [];
          const mainSort = sorts[0] || '';

          return mainSort.startsWith('-') ? SORT_TYPE.DESCENDING : SORT_TYPE.ASCENDING;
        },
      },
      staticFallback: { params: {} },
    },
  },
  jobLog: {
    type: 'okapi',
    path: 'metadata-provider/jobLogEntries/:{id}/records/:{recordId}',
    throwErrors: false,
    accumulate: true,
  },
  jobExecutions: {
    type: 'okapi',
    path: 'change-manager/jobExecutions/:{id}',
    throwErrors: false,
  },
});

JobSummaryComponent.propTypes = {
  mutator: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
  resources: PropTypes.shape({
    query: PropTypes.object,
    jobExecutions: PropTypes.shape({
      records: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          fileName: PropTypes.string.isRequired,
          progress: PropTypes.shape({ total: PropTypes.number.isRequired }).isRequired,
          jobProfileInfo: PropTypes.shape({ dataType: PropTypes.string.isRequired }).isRequired,
        }),
      ).isRequired,
    }),
    jobLogEntries: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }),
    jobLog: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }),
  }).isRequired,
  location: PropTypes.oneOfType([
    PropTypes.shape({
      search: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.string.isRequired,
  ]).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export const JobSummary = stripesConnect(JobSummaryComponent);
