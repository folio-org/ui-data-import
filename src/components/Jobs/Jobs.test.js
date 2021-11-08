import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import {
  jobExecutions,
  jobsLogs,
} from '../../../test/bigtest/mocks';
import { translationsProperties } from '../../../test/jest/helpers';

import { DataFetcherContext } from '../DataFetcher';
import { Jobs } from './Jobs';

import { DEFAULT_TIMEOUT_BEFORE_JOB_DELETION } from '../../utils';
import { deleteFile } from '../../utils/upload';

jest.mock('../../utils/upload', () => ({
  ...jest.requireActual('../../utils/upload'),
  deleteFile: jest.fn(() => Promise.reject(new Error('Something went wrong!'))),
}));

jest.spyOn(console, 'error').mockImplementation(() => {});

global.fetch = jest.fn();

const defaultContext = {
  hasLoaded: true,
  jobs: [],
  logs: jobsLogs,
};

const renderJobs = (context = defaultContext) => {
  const component = (
    <DataFetcherContext.Provider value={context}>
      <Jobs />
    </DataFetcherContext.Provider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('<Jobs>', () => {
  beforeEach(() => {
    jest.setTimeout(5 * DEFAULT_TIMEOUT_BEFORE_JOB_DELETION);
  });

  afterEach(() => {
    jest.clearAllTimers();
    global.fetch.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should contain "Previews" and "Running" section', () => {
    const { getByText } = renderJobs();

    expect(getByText('Previews')).toBeInTheDocument();
    expect(getByText('Running')).toBeInTheDocument();
  });

  it('"Preview" and "Running" sections open by default', () => {
    const { getByRole } = renderJobs();

    expect(getByRole('button', {
      name: /previews/i,
      expanded: true,
    }));

    expect(getByRole('button', {
      name: /running/i,
      expanded: true,
    }));
  });

  it('should have correct job items amount', () => {
    const { getAllByRole } = renderJobs({
      ...defaultContext,
      jobs: jobExecutions,
    });

    expect(getAllByRole('listitem').length).toBe(jobExecutions.length);
  });

  describe('"Previews section"', () => {
    it('should render "Previews" toggle button', () => {
      const { getByRole } = renderJobs();

      expect(getByRole('button', { name: /previews/i })).toBeInTheDocument();
    });

    describe('when job data is empty', () => {
      it('should render empty message', () => {
        const { getByText } = renderJobs();

        expect(getByText('No previews to show')).toBeInTheDocument();
      });
    });

    describe('when clicked delete button', () => {
      it('should handle deletion errors', async done => {
        const { getAllByRole } = renderJobs({
          ...defaultContext,
          jobs: jobExecutions,
        });

        fireEvent.click(getAllByRole('button', { name: /delete/i })[0]);

        new Promise(r => setTimeout(r, DEFAULT_TIMEOUT_BEFORE_JOB_DELETION)).then(() => {
          expect(deleteFile).toHaveBeenCalled();
          // eslint-disable-next-line no-console
          expect(console.error).toHaveBeenCalledWith(new Error('Something went wrong!'));
          done();
        });
      });

      it('correct text should be rendered', () => {
        const {
          getByText,
          getAllByRole,
        } = renderJobs({
          ...defaultContext,
          jobs: jobExecutions,
        });

        fireEvent.click(getAllByRole('button', { name: /delete/i })[0]);

        expect(getByText('has been stopped', { exact: false })).toBeInTheDocument();
      });
    });

    describe('when clicked "undo" button', () => {
      it('deleted job reappears', () => {
        const {
          queryByText,
          getAllByRole,
        } = renderJobs({
          ...defaultContext,
          jobs: jobExecutions,
        });

        fireEvent.click(getAllByRole('button', { name: /delete/i })[0]);
        fireEvent.click(getAllByRole('button', { name: /undo/i })[0]);

        expect(queryByText('has been stopped', { exact: false })).toBeNull();
      });
    });
  });
});
