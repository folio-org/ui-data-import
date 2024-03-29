import React, {
  useEffect,
  useRef,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import { makeConnectedSource } from '@folio/stripes/smart-components';
import {
  SettingsLabel,
  FOLIO_RECORD_TYPES,
} from '@folio/stripes-data-transfer-components';
import {
  PaneMenu,
  PaneCloseLink,
  Pane,
  PaneHeader,
  Paneset,
  Row,
  Col,
  Layout,
  TextLink,
} from '@folio/stripes/components';
import css from '@folio/stripes-data-transfer-components/lib/SearchAndSortPane/SearchAndSortPane.css';
import sharedCss from '../../shared.css';

import {
  SummaryTable,
  RecordsTable,
  SourceDownloadLink,
} from './components';

import {
  DATA_TYPES,
  storage,
  PREVIOUS_LOCATIONS_KEY,
  PER_REQUEST_LIMIT,
  trimLeadNumbers,
} from '../../utils';

import { UploadingJobsContext } from '../../components';

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
      query,
    },
    location,
    history,
  } = props;

  const dataType = jobExecutionsRecords[0]?.jobProfileInfo.dataType;
  const jobProfileName = jobExecutionsRecords[0]?.jobProfileInfo.name;
  const jobProfileId = jobExecutionsRecords[0]?.jobProfileInfo.id;

  const isEdifactType = dataType === DATA_TYPES[1];
  const jobExecutionsId = jobExecutionsRecords[0]?.id;
  const jobExecutionsHrId = jobExecutionsRecords[0]?.hrId;
  const isErrorsOnly = !!query.errorsOnly;

  const { id } = useParams();
  const { uploadConfiguration } = useContext(UploadingJobsContext);
  // persist previous jobExecutionsId
  const previousJobExecutionsIdRef = useRef(jobExecutionsId);

  const previousLocations = useRef(storage.getItem(PREVIOUS_LOCATIONS_KEY) || []);

  useEffect(() => {
    if (location.state?.from) {
      previousLocations.current.push(location.state.from);
      storage.setItem(PREVIOUS_LOCATIONS_KEY, previousLocations.current);
    }
  }, [location]);

  useEffect(() => {
    if (previousJobExecutionsIdRef.current !== id) {
      mutator?.resultOffset?.replace(0);
    }
  }, [id, mutator]);

  const getSource = () => {
    const resourceName = 'jobLogEntries';
    const parentResources = resources;
    const connectedSourceProps = {
      ...props,
      parentResources,
    };

    return makeConnectedSource(connectedSourceProps, stripes.logger, resourceName);
  };

  const handlePaneClose = () => {
    if (isEmpty(previousLocations.current)) {
      history.push('/data-import');
    } else {
      history.push(previousLocations.current.pop());
      storage.setItem(PREVIOUS_LOCATIONS_KEY, previousLocations.current);
    }
  };

  const jobProfileLink = (
    <TextLink to={{
      pathname: `/settings/data-import/job-profiles/view/${jobProfileId}`,
      search: '?sort=name',
    }}
    >
      {jobProfileName}
    </TextLink>
  );

  const renderHeader = renderProps => {
    const resultCountMessageId = 'stripes-smart-components.searchResultsCountHeader';
    const errorsCountMessageId = 'ui-data-import.errorsCountHeader';
    const label = (
      <SettingsLabel
        iconKey={isEdifactType ? FOLIO_RECORD_TYPES.INVOICE.iconKey : 'app'}
        app="data-import"
      >
        <>{trimLeadNumbers(jobExecutionsRecords[0]?.fileName)}</>
      </SettingsLabel>
    );
    const firstMenu = (
      <PaneMenu>
        <PaneCloseLink onClick={handlePaneClose} />
      </PaneMenu>
    );

    return (
      <PaneHeader
        {...renderProps}
        paneTitle={label}
        paneSub={(
          <>
            <FormattedMessage
              id="ui-data-import.jobHrId"
              values={{ hrId: jobExecutionsHrId }}
            />
            <FormattedMessage
              id={!isErrorsOnly ? resultCountMessageId : errorsCountMessageId}
              values={{ count: getSource().totalCount() }}
            />
          </>
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
        <div className={classNames(css.paneBody, sharedCss.sideMargins)}>
          <Row style={{ padding: '14px' }} center="xs">
            <Col sm={6}>
              <Layout className="padding-all-gutter flex centerContent">
                <div>
                  <strong>
                    <FormattedMessage id="ui-data-import.jobProfileName" />
                    :&nbsp;
                  </strong>
                  { jobProfileLink }
                </div>
              </Layout>
            </Col>
            {uploadConfiguration?.canUseObjectStorage && (
              <Col sm={6}>
                <SourceDownloadLink
                  executionId={id}
                  fileName={jobExecutionsRecords[0]?.fileName}
                />
              </Col>
            )}
          </Row>
          <hr />
          {!isErrorsOnly && (
            <div className={sharedCss.separatorLine}>
              <SummaryTable jobExecutionId={jobExecutionsId} />
            </div>
          )}
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
        errorsOnly: queryParams => {
          const { errorsOnly } = queryParams;

          return errorsOnly;
        },
        entity: queryParams => {
          const { entity } = queryParams;

          return entity;
        },
      },
      staticFallback: { params: {} },
    },
  },
  jobExecutions: {
    type: 'okapi',
    path: 'change-manager/jobExecutions/:{id}',
    throwErrors: false,
  },
  locations: {
    throwErrors: false,
    type: 'okapi',
    records: 'locations',
    path: `locations?limit=${PER_REQUEST_LIMIT}&query=cql.allRecords=1 sortby name`,
  }
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
          hrId: PropTypes.number.isRequired,
          progress: PropTypes.shape({ total: PropTypes.number.isRequired }).isRequired,
          jobProfileInfo: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            dataType: PropTypes.string.isRequired,
          }).isRequired,
        }),
      ).isRequired,
    }),
    jobLogEntries: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }),
    locations: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }),
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
