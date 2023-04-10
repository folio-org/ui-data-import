import React from 'react';
import {
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
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

const mockDeleteFile = jest.spyOn(API, 'deleteFile').mockResolvedValue(true);

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  ConfirmationModal: jest.fn(({
    open,
    onCancel,
    onConfirm,
  }) => (open ? (
    <div>
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

const defaultContext = {
  hasLoaded: true,
  jobs: runningJobs,
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
