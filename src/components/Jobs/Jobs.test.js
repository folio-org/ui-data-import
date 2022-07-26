import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import {
  jobExecutions,
  RUNNING_JOBS_LENGTH,
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
  jobs: jobExecutions,
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

describe('<Jobs>', () => {
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

  it('should have correct job items amount', () => {
    const { getAllByRole } = renderJobs();

    expect(getAllByRole('listitem').length).toBe(RUNNING_JOBS_LENGTH);
  });

  describe('"Running" section', () => {
    describe('when clicked delete button', () => {
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
