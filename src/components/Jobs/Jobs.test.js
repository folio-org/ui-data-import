import React from 'react';
import { fireEvent, within } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { DataFetcherContext } from '../DataFetcher';
import { Jobs } from './Jobs';

import {
  DEFAULT_TIMEOUT_BEFORE_JOB_DELETION,
  JOB_STATUSES,
} from '../../utils';
import { deleteFile } from '../../utils/upload';

jest.mock('../../utils/upload', () => ({
  ...jest.requireActual('../../utils/upload'),
  deleteFile: jest.fn(() => Promise.reject(new Error('Something went wrong!'))),
}));

jest.spyOn(console, 'error').mockImplementation(() => {});

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

const renderJobs = (context = defaultContext) => {
  const component = (
    <DataFetcherContext.Provider value={context}>
      <Jobs />
    </DataFetcherContext.Provider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Jobs', () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should contain "Running" section', () => {
    const { getByText } = renderJobs();

    expect(getByText('Running')).toBeInTheDocument();
  });

  it('"Running" section should be open by default', () => {
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

    describe('when clicked delete button on running job card', () => {
      it('should handle deletion errors', () => {
        const { getAllByRole } = renderJobs();

        fireEvent.click(getAllByRole('button', { name: /delete/i })[0]);

        return new Promise(r => setTimeout(r, DEFAULT_TIMEOUT_BEFORE_JOB_DELETION)).then(() => {
          expect(deleteFile).toHaveBeenCalled();
          expect(console.error).toHaveBeenCalledWith(new Error('Something went wrong!')); // eslint-disable-line no-console
        });
      }, DEFAULT_TIMEOUT_BEFORE_JOB_DELETION);

      it('correct text should be rendered', () => {
        const {
          getByText,
          getAllByRole,
        } = renderJobs();

        fireEvent.click(getAllByRole('button', { name: /delete/i })[0]);

        expect(getByText('has been stopped', { exact: false })).toBeInTheDocument();
      });
    });

    describe('when clicked "undo" button', () => {
      it('deleted job reappears', () => {
        const {
          queryByText,
          getAllByRole,
        } = renderJobs();

        fireEvent.click(getAllByRole('button', { name: /delete/i })[0]);
        fireEvent.click(getAllByRole('button', { name: /undo/i })[0]);

        expect(queryByText('has been stopped', { exact: false })).toBeNull();
      });
    });
  });
});
