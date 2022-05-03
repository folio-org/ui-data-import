import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/test/helpers';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { JobSummary } from './JobSummary';

jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
  SummaryTable: () => 'SummaryTable',
  RecordsTable: () => 'RecordsTable',
}));

const getJobExecutionsResources = dataType => buildResources({
  resourceName: 'jobExecutions',
  records: [{
    id: 'testId',
    fileName: 'testFileName',
    progress: { total: 10 },
    jobProfileInfo: { dataType },
  }],
});
const jobLogEntriesResources = buildResources({
  resourceName: 'jobLogEntries',
  records: [{}],
});
const jobLogResources = buildResources({
  resourceName: 'jobLog',
  records: [{}],
});
const getResources = dataType => ({
  ...getJobExecutionsResources(dataType),
  ...jobLogEntriesResources,
  ...jobLogResources,
});

const mutator = buildMutator({
  jobLog: { GET: jest.fn() },
});

const renderJobSummary = ({ dataType = 'MARC', resources }) => {
  const component = (
    <Router>
      <JobSummary
        resources={resources || getResources(dataType)}
        mutator={mutator}
        location={{
          search: '',
          pathname: '',
        }}
        history={{ push: () => {} }}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Job summary page', () => {
  it('should have a file name in the header', () => {
    const { getByText } = renderJobSummary({ dataType: 'EDIFACT' });

    expect(getByText('testFileName')).toBeDefined();
  });

  it('should have total number of records in the subheader', () => {
    const { getByText } = renderJobSummary({});

    expect(getByText('1 record found')).toBeDefined();
  });

  it('should render the summary table', () => {
    const { getByText } = renderJobSummary({});

    expect(getByText('SummaryTable')).toBeDefined();
  });

  it('should render the records table', () => {
    const { getByText } = renderJobSummary({});

    expect(getByText('RecordsTable')).toBeDefined();
  });

  it('should fetch job logs once jobExecutionsId is known', () => {
    renderJobSummary({});

    expect(mutator.jobLog.GET).toHaveBeenCalled();
  });
});
