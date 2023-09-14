import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildStripes,
  renderWithIntl,
  translationsProperties
} from '../../../test/jest/helpers';
import { Harness } from '../../../test/helpers';
import '../../../test/jest/__mock__';

import { JobSummary } from './JobSummary';

import { PREVIOUS_LOCATIONS_KEY } from '../../utils';

jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
  SummaryTable: () => 'SummaryTable',
  RecordsTable: () => 'RecordsTable',
}));

const history = createMemoryHistory();
history.push = jest.fn();

const getJobExecutionsResources = (dataType, jobExecutionsId = 'testId') => ({
  jobExecutions: {
    records: [{
      id: jobExecutionsId,
      hrId: 12,
      fileName: 'testFileName',
      progress: { total: 10 },
      jobProfileInfo: {
        dataType,
        name: 'Test job profile',
        id: 'testId',
      },
    }],
    other: { totalRecords: 1 },
    resultCount: 1,
    hasLoaded: true,
  },
});
const jobLogEntriesResources = {
  jobLogEntries: {
    records: [{}],
    resultCount: 1,
    hasLoaded: true,
    other: { totalRecords: 1 },
  },
};
const jobLogResources = {
  jobLog: { records: [{}] },
};
const getResources = (dataType, jobExecutionsId) => ({
  ...getJobExecutionsResources(dataType, jobExecutionsId),
  ...jobLogEntriesResources,
  ...jobLogResources,
  query: { errorsOnly: false },
  resultCount: 1,
});

const mutator = {
  jobLog: { GET: jest.fn() },
};
const stripesMock = buildStripes();

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
        history={history}
        stripes={stripesMock}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Job summary page', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderJobSummary({});

    await runAxeTest({ rootNode: container });
  });

  it('should have a file name in the header', () => {
    const { getByText } = renderJobSummary({ dataType: 'EDIFACT' });

    expect(getByText('testFileName')).toBeDefined();
  });

  describe('subheader', () => {
    it('should be rendered', () => {
      const { getByText } = renderJobSummary({});

      expect(getByText('Job 12 • 1 record found')).toBeDefined();
    });

    it('should render total number of records', () => {
      const { getByText } = renderJobSummary({});

      expect(getByText(/1 record found/i)).toBeDefined();
    });

    it('should render hrId', () => {
      const { getByText } = renderJobSummary({});

      expect(getByText(/12/i)).toBeDefined();
    });
  });

  describe('when close the pane', () => {
    describe('when previous location is set', () => {
      it('should redirect to the previous location', () => {
        window.sessionStorage.setItem(PREVIOUS_LOCATIONS_KEY, JSON.stringify(['/test']));

        const { getByLabelText } = renderJobSummary({});

        const closeButton = getByLabelText('times');
        fireEvent.click(closeButton);

        expect(history.push).toHaveBeenCalledWith('/test');
      });
    });

    describe('when previous location is not set', () => {
      it('should redirect to Data Import landing page', () => {
        const { getByLabelText } = renderJobSummary({});

        const closeButton = getByLabelText('times');
        fireEvent.click(closeButton);

        expect(history.push).toHaveBeenCalledWith('/data-import');
      });
    });
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
    const component = (jobExecutionsId) => (
      <Harness
        translations={translationsProperties}
        stripes={{}}
      >
        <Router>
          <JobSummary
            resources={getResources('MARC', jobExecutionsId)}
            mutator={mutator}
            location={{
              search: '',
              pathname: '',
              state: { from: 'test' }
            }}
            history={{ push: () => {} }}
          />
        </Router>
      </Harness>
    );

    const { rerender } = render(component('testId'));

    rerender(component('testJobExecutionsId'));

    expect(mutator.jobLog.GET).toHaveBeenCalled();
  });
});
