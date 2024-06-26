import React, { act } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildStripes,
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { JobSummary } from './JobSummary';
import { UploadingJobsContext } from '../../components';
import { PREVIOUS_LOCATIONS_KEY } from '../../utils';

jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
  SourceDownloadLink: () => 'SourceDownloadLink',
  SummaryTable: () => 'SummaryTable',
  RecordsTable: () => 'RecordsTable',
}));

const history = createMemoryHistory();
history.push = jest.fn();
const multipartUploadContext = {
  uploadConfiguration: {
    canUseObjectStorage: true
  }
};

const defaultUploadContext = {
  uploadConfiguration: {
    canUseObjectStorage: false
  }
};

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
const getResources = ({ dataType, jobExecutionsId, isErrorsOnly = false }) => ({
  ...getJobExecutionsResources(dataType, jobExecutionsId),
  ...jobLogEntriesResources,
  query: { errorsOnly: isErrorsOnly },
  resultCount: 1,
});

const mutator = {
  jobLogEntries: { GET: () => {} },
};
const stripesMock = buildStripes();

const renderJobSummary = ({
  dataType = 'MARC',
  isErrorsOnly = false,
  resources,
  context = defaultUploadContext,
}) => {
  const component = (
    <Router>
      <UploadingJobsContext.Provider value={context}>
        <JobSummary
          resources={resources || getResources({ dataType, isErrorsOnly })}
          mutator={mutator}
          location={{
            search: '',
            pathname: '',
          }}
          history={history}
          stripes={stripesMock}
        />
      </UploadingJobsContext.Provider>
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

    await act(async () => {
      await runAxeTest({ rootNode: container });
    });
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

    it('should render total count of errors if it is filtered down by errors', () => {
      const { getByText } = renderJobSummary({ isErrorsOnly: true });

      expect(getByText(/1 error found/i)).toBeDefined();
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

  it('should render a download link if multipart capability is present', () => {
    const { getByText } = renderJobSummary({ context: multipartUploadContext });

    expect(getByText('SourceDownloadLink')).toBeInTheDocument();
  });
});
