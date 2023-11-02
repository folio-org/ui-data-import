import React from 'react';
import {
  fireEvent,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithRedux,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { DataFetcherContext } from '../DataFetcher';
import { Jobs } from './Jobs';

import { JOB_STATUSES } from '../../utils';
import * as API from '../../utils/upload';
import * as multipartAPI from '../../utils/multipartUpload';

const mockDeleteFile = jest.spyOn(API, 'deleteFile').mockResolvedValue(true);
const mockCancelMultipartJob = jest.spyOn(multipartAPI, 'cancelMultipartJob').mockResolvedValue(true);

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  ConfirmationModal: jest.fn(({
    open,
    onCancel,
    onConfirm,
    heading,
  }) => (open ? (
    <div>
      <span>{heading}</span>
      <span>Confirmation Modal</span>
      <button
        type="button"
        onClick={onCancel}
      >
        No, do not cancel import
      </button>
      <button
        type="button"
        id="confirmButton"
        onClick={onConfirm}
      >
        Yes, cancel import job
      </button>
    </div>
  ) : null)),
}));

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

global.fetch = jest.fn();

const runningJobs = [
  {
    id: '469eba83-41d1-4161-bd1a-0f46d5554c6a',
    hrId: 182982989,
    subordinationType: 'PARENT_SINGLE',
    jobProfileInfo: { name: 'Main bib jobs' },
    fileName: 'import_1.mrc',
    sourcePath: 'import_1.mrc',
    runBy: {
      firstName: 'Mark',
      lastName: 'Curie',
    },
    progress: {
      current: 290,
      total: 500,
    },
    startedDate: '2018-11-22T12:00:31.000',
    uiStatus: JOB_STATUSES.RUNNING,
    status: 'PROCESSING_FINISHED',
  },
];

const runningCompositeJobs = [{
  id: 'f4e1e42f-7c9b-45be-898f-25d8c563bf13',
  hrId: 10,
  parentJobId: 'f4e1e42f-7c9b-45be-898f-25d8c563bf13',
  subordinationType: 'COMPOSITE_PARENT',
  jobProfileInfo: {
    id: '80898dee-449f-44dd-9c8e-37d5eb469b1d',
    name: 'Default - Create Holdings and SRS MARC Holdings',
    dataType: 'MARC',
    hidden: false
  },
  sourcePath: '500 records.mrc',
  fileName: '500 records.mrc',
  runBy: {
    firstName: 'DIKU',
    lastName: 'ADMINISTRATOR'
  },
  progress: {
    jobExecutionId: 'f4e1e42f-7c9b-45be-898f-25d8c563bf13',
    current: 504,
    total: 500
  },
  startedDate: '2023-06-16T18:22:18.484+00:00',
  completedDate: '2023-06-16T18:50:11.105+00:00',
  status: 'PROCESSING_IN_PROGRESS',
  uiStatus: 'RUNNING',
  userId: 'eb9e217c-0dcf-47ed-b3f0-22a928702631',
  jobPartNumber: 1,
  totalJobParts: 1,
  compositeDetails: {
    processingInProgressState: {
      chunksCount: 5,
      totalRecordsCount: 2500,
      currentlyProcessedCount: 832
    },
    committedState: {
      chunksCount: 3,
      totalRecordsCount: 1500,
      currentlyProcessedCount: 1500
    },
    errorState: {
      chunksCount: 2,
      totalRecordsCount: 1000,
      currentlyProcessedCount: 1000
    }
  },
  totalRecordsInFile: 200
}
];

const defaultContext = {
  hasLoaded: true,
  jobs: runningJobs,
  logs: [],
};

const compositeContext = {
  hasLoaded: true,
  jobs: runningCompositeJobs,
  logs: [],
};

const initialStore = {
  'folio-data-import_landing': {
    hrIds: [],
    selectedJob: null,
  }
};

const renderJobs = (context = defaultContext) => {
  const component = (
    <DataFetcherContext.Provider value={context}>
      <Jobs />
    </DataFetcherContext.Provider>
  );

  return renderWithIntl(renderWithRedux(component, initialStore), translationsProperties);
};

const renderCompositeJobs = (context = compositeContext) => {
  const component = (
    <DataFetcherContext.Provider value={context}>
      <Jobs />
    </DataFetcherContext.Provider>
  );

  return renderWithIntl(renderWithRedux(component, initialStore), translationsProperties);
};

describe('Jobs component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderJobs();

    await runAxeTest({ rootNode: container });
  });

  it('should contain "Running" section', () => {
    const { getByText } = renderJobs();

    expect(getByText('Running')).toBeInTheDocument();
  });

  it('"Running" section accordion should be open by default', () => {
    const { getByRole } = renderJobs();

    expect(getByRole('button', { name: /running/i, expanded: true }));
  });

  describe('"Running" section', () => {
    it('should have correct amount of running job cards', () => {
      const { getAllByRole } = renderJobs();

      expect(getAllByRole('listitem').length).toBe(runningJobs.length);
    });

    it('should display appropriate message when there are no running jobs', () => {
      const { getByText } = renderJobs({
        ...defaultContext,
        jobs: [],
      });

      expect(getByText('No running jobs to show')).toBeInTheDocument();
    });

    describe('Job card', () => {
      let jobCard;

      beforeEach(() => {
        const { getByRole } = renderJobs();
        jobCard = getByRole('listitem');
      });

      it('should display job profile name', () => {
        const jobProfileName = runningJobs[0].jobProfileInfo.name;

        expect(within(jobCard).getByText(jobProfileName)).toBeInTheDocument();
      });

      it('should display file name', () => {
        const fileName = runningJobs[0].fileName;

        expect(within(jobCard).getByText(fileName)).toBeInTheDocument();
      });

      it('should display total number of records', () => {
        const totalRecords = runningJobs[0].progress.total;

        expect(within(jobCard).getByText(`${totalRecords} records`)).toBeInTheDocument();
      });

      it('should display user full name', () => {
        const {
          firstName,
          lastName,
        } = runningJobs[0].runBy;
        const fullName = `${firstName} ${lastName}`;

        expect(within(jobCard).getByText(fullName, { exact: false })).toBeInTheDocument();
      });
    });

    describe('When delete button on running job card is clicked', () => {
      it('cancel import job modal should be opened', async () => {
        const {
          getByRole,
          getByText,
        } = renderJobs();

        fireEvent.click(getByRole('button', { name: /delete/i }));

        await waitFor(() => expect(getByText('Confirmation Modal')).toBeInTheDocument());
      });

      it('correct text should be rendered on the job card', () => {
        const {
          getByText,
          getByRole,
        } = renderJobs();

        fireEvent.click(getByRole('button', { name: /delete/i }));

        expect(getByText('has been stopped', { exact: false })).toBeInTheDocument();
      });
    });
  });

  describe('Opened cancel import job modal', () => {
    it('should be closed when cancel button is clicked', async () => {
      const {
        getByRole,
        queryByText,
      } = renderJobs();

      fireEvent.click(getByRole('button', { name: /delete/i }));
      fireEvent.click(getByRole('button', { name: 'No, do not cancel import' }));

      await waitFor(() => expect(queryByText('Confirmation Modal')).not.toBeInTheDocument());
    });

    it('should be closed when confirm button is clicked', async () => {
      const {
        getByRole,
        queryByText,
      } = renderJobs();

      fireEvent.click(getByRole('button', { name: /delete/i }));
      fireEvent.click(getByRole('button', { name: 'Yes, cancel import job' }));

      await waitFor(() => expect(queryByText('Confirmation Modal')).not.toBeInTheDocument());
    });

    describe('when there is a deletion error while cancelling job', () => {
      it('console.error should be called', async () => {
        const error = new Error('Something went wrong. Try again.');
        mockDeleteFile.mockRejectedValueOnce(error);
        const { getByRole } = renderJobs();

        fireEvent.click(getByRole('button', { name: /delete/i }));
        fireEvent.click(getByRole('button', { name: 'Yes, cancel import job' }));

        expect(mockDeleteFile).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(mockConsoleError).toHaveBeenCalledWith(error));
      });
    });
  });
});

// Composite jobs tests..
describe('Composite jobs - Jobs component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('Composite jobs - should be rendered with no axe errors', async () => {
    const { container } = renderCompositeJobs();

    await runAxeTest({ rootNode: container });
  });

  it('Composite jobs - should contain "Running" section', () => {
    const { getByText } = renderCompositeJobs();

    expect(getByText('Running')).toBeInTheDocument();
  });

  it('Composite jobs -  "Running" section accordion should be open by default', () => {
    const { getByRole } = renderCompositeJobs();

    expect(getByRole('button', { name: /running/i, expanded: true }));
  });

  describe('Composite jobs - "Running" section', () => {
    it('should have correct amount of running job cards', () => {
      const { getAllByRole } = renderCompositeJobs();
      // Composite cards display a nested list of progress data that has 3 items...
      // we expect 3 more items per card.
      expect(getAllByRole('listitem').length).toBe(runningJobs.length + runningJobs.length * 2);
    });

    it('Composite jobs - should display appropriate message when there are no running jobs', () => {
      const { getByText } = renderCompositeJobs({
        ...defaultContext,
        jobs: [],
      });

      expect(getByText('No running jobs to show')).toBeInTheDocument();
    });

    describe('Composite jobs - Job card', () => {
      let jobCard;

      beforeEach(() => {
        const { getAllByRole } = renderCompositeJobs();
        jobCard = getAllByRole('listitem')[0];
      });

      it('Composite jobs - should display job profile name', () => {
        const jobProfileName = runningCompositeJobs[0].jobProfileInfo.name;

        expect(within(jobCard).getByText(jobProfileName)).toBeInTheDocument();
      });

      it('Composite jobs - should display file name', () => {
        const fileName = runningCompositeJobs[0].fileName;

        expect(within(jobCard).getByText(fileName)).toBeInTheDocument();
      });

      it('Composite jobs - should display total number of records', () => {
        const totalRecords = runningCompositeJobs[0].totalRecordsInFile;

        expect(within(jobCard).getByText(`${totalRecords} records`)).toBeInTheDocument();
      });

      it('Composite jobs - should display user full name', () => {
        const {
          firstName,
          lastName,
        } = runningCompositeJobs[0].runBy;
        const fullName = `${firstName} ${lastName}`;

        expect(within(jobCard).getByText(fullName, { exact: false })).toBeInTheDocument();
      });

      it('Composite jobs - should display number of processed slices', () => {
        expect(within(jobCard).getByText(/processed/)).toBeInTheDocument();
      });

      it('Composite jobs - should display number of remaining slices', () => {
        expect(within(jobCard).getByText(/remaining/)).toBeInTheDocument();
      });

      it('Composite jobs - should display number of completed slices', () => {
        expect(within(jobCard).getByText('Completed: 3')).toBeInTheDocument();
      });

      it('Composite jobs - should display number of slices completed with error', () => {
        expect(within(jobCard).getByText('Completed with errors: 2')).toBeInTheDocument();
      });
    });

    describe('Composite jobs - When delete button on running job card is clicked', () => {
      it('Composite jobs - cancel import job modal should be opened', async () => {
        const {
          getByRole,
          getByText,
        } = renderCompositeJobs();

        fireEvent.click(getByRole('button', { name: /delete/i }));

        await waitFor(() => expect(getByText('Confirmation Modal')).toBeInTheDocument());
      });

      it('Composite jobs - correct text should be rendered on the job card', () => {
        const {
          getByText,
          getByRole,
        } = renderCompositeJobs();

        fireEvent.click(getByRole('button', { name: /delete/i }));

        expect(getByText('has been stopped', { exact: false })).toBeInTheDocument();
      });
    });
  });

  describe('Composite jobs - Opened cancel import job modal', () => {
    it('Composite jobs - should be closed when cancel button is clicked', async () => {
      const {
        getByRole,
        queryByText,
      } = renderCompositeJobs();

      fireEvent.click(getByRole('button', { name: /delete/i }));
      fireEvent.click(getByRole('button', { name: 'No, do not cancel import' }));

      await waitFor(() => expect(queryByText('Confirmation Modal')).not.toBeInTheDocument());
    });

    it('Composite jobs - display correct modal label header', async () => {
      const {
        getByRole,
        queryByText,
      } = renderCompositeJobs();

      fireEvent.click(getByRole('button', { name: /delete/i }));

      await waitFor(() => expect(queryByText(/multipart/)).toBeInTheDocument());
    });

    it('Composite jobs - should be closed when confirm button is clicked', async () => {
      const {
        getByRole,
        queryByText,
      } = renderCompositeJobs();

      fireEvent.click(getByRole('button', { name: /delete/i }));
      fireEvent.click(getByRole('button', { name: 'Yes, cancel import job' }));

      await waitFor(() => expect(queryByText('Confirmation Modal')).not.toBeInTheDocument());
    });

    describe('Composite jobs - when there is a deletion error while cancelling job', () => {
      it('Composite jobs - console.error should be called', async () => {
        const error = new Error('Something went wrong. Try again.');
        mockCancelMultipartJob.mockRejectedValueOnce(error);
        const { getByRole } = renderCompositeJobs();

        fireEvent.click(getByRole('button', { name: /delete/i }));
        fireEvent.click(getByRole('button', { name: 'Yes, cancel import job' }));

        expect(mockCancelMultipartJob).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(mockConsoleError).toHaveBeenCalledWith(error));
      });
    });
  });
});
