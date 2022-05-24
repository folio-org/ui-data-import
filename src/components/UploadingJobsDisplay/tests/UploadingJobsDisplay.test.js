import React from 'react';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { Router } from 'react-router-dom';

import { noop } from 'lodash';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { Paneset } from '@folio/stripes/components';
import {
  buildStripes,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { UploadingJobsContext } from '../../UploadingJobsContextProvider';
import { UploadingJobsDisplay } from '../UploadingJobsDisplay';

import {
  DEFAULT_TIMEOUT_BEFORE_JOB_DELETION,
  FILE_STATUSES,
} from '../../../utils';

jest.mock('../../../utils/upload', () => ({
  ...jest.requireActual('../../../utils/upload'),
  deleteFile: jest.fn()
    .mockImplementationOnce(() => Promise.resolve('deleted successfully'))
    .mockImplementationOnce(() => Promise.reject(new Error('failed to delete')))
    .mockImplementationOnce(() => Promise.resolve('deleted successfully')),
}));

jest.mock('../../../settings/JobProfiles', () => ({ createJobProfiles: () => () => <span>JobProfiles</span> }));

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({
    fileExtensions: [
      { dataTypes: ['MARC'] },
    ],
  }),
}));

const stripes = buildStripes();

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

const getHistory = stateField => ({
  length: 1,
  action: 'POP',
  location: {
    pathname: '/data-import/job-profile',
    search: '',
    state: stateField,
  },
  block: jest.fn(() => jest.fn),
  push: noop,
  replace: noop,
  listen: noop,
  createHref: noop,
  go: noop,
  goBack: noop,
  goForward: noop,
});

const defaultContext = {
  uploadDefinition: {},
  updateUploadDefinition: noop,
  deleteUploadDefinition: noop,
};

const renderUploadingJobsDisplay = (context, stateField) => {
  const component = () => (
    <UploadingJobsContext.Provider value={context}>
      <Router history={getHistory(stateField)}>
        <Paneset>
          <UploadingJobsDisplay
            stripes={stripes}
          />
        </Paneset>
      </Router>
    </UploadingJobsContext.Provider>

  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

// eslint-disable-next-line no-only-tests/no-only-tests
describe.skip('<UploadingjobsDisplay>', () => {
  beforeEach(() => {
    jest.setTimeout(10 * DEFAULT_TIMEOUT_BEFORE_JOB_DELETION);
  });

  afterEach(() => {
    jest.clearAllTimers();
    global.fetch.mockClear();
    mockConsoleError.mockReset();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('renders correctly', async () => {
    const { findByText } = renderUploadingJobsDisplay(defaultContext);

    expect(await findByText('Files')).toBeDefined();
  });

  describe('when cannot update file definition', () => {
    it('handles error correctly', async () => {
      renderUploadingJobsDisplay({
        ...defaultContext,
        updateUploadDefinition: () => Promise.reject(new Error('failed to update')),
      });

      await waitFor(() => expect(mockConsoleError).toHaveBeenCalledWith(new Error('failed to update')));
    });
  });

  describe('when uploaded successfully', () => {
    it('renders <JobProfiles>', async () => {
      const { getByText } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADED }] },
      });

      await waitFor(() => expect(getByText('JobProfiles')).toBeDefined());
    });
  });

  describe('when clicked delete button', () => {
    it('shows undo button', async () => {
      const {
        findByText,
        getByRole,
      } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: {
          fileDefinitions: [{
            status: FILE_STATUSES.UPLOADED,
            name: 'CatShip.mrc',
          }],
        },
      });

      expect(await findByText('CatShip.mrc')).toBeDefined();

      const deleteButton = getByRole('button', { name: /delete/i });

      fireEvent.click(deleteButton);

      const undoBtn = await findByText('Undo');

      expect(undoBtn).toBeDefined();
    });

    it('handles deletion error', async () => {
      const {
        findByText,
        getByRole,
      } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: {
          fileDefinitions: [{
            status: FILE_STATUSES.UPLOADED,
            name: 'CatShip.mrc',
          }],
        },
      });

      expect(await findByText('CatShip.mrc')).toBeDefined();

      const deleteButton = getByRole('button', { name: /delete/i });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(new Error('failed to delete'));
      });
    });

    it('deletes file successfully', async done => {
      const {
        findByRole,
        getByText,
      } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: {
          fileDefinitions: [{
            status: FILE_STATUSES.UPLOADED,
            name: 'CatShip.mrc',
          }],
        },
      });

      const deleteButton = await findByRole('button', { name: /delete/i });

      fireEvent.click(deleteButton);

      new Promise(r => setTimeout(r, DEFAULT_TIMEOUT_BEFORE_JOB_DELETION))
        .then(() => {
          expect(getByText('No files to show')).toBeDefined();
          done();
        });
    });
  });

  describe('when status is UPLOADING', () => {
    it('shows correct message', async () => {
      const { getByText } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADING }] },
      });

      await waitFor(() => expect(getByText('Uploading')).toBeInTheDocument());
    });
  });

  describe('when status is  ERROR_DEFINITION', () => {
    it('shows error message', async () => {
      const { getByText } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.ERROR_DEFINITION }] },
      });

      await waitFor(() => expect(getByText('Error: file upload')).toBeInTheDocument());
    });
  });

  describe('when status is ERROR', () => {
    it('renders error message', async () => {
      const state = { files: { 'CatShip.mrc1634031179989': { status: FILE_STATUSES.ERROR } } };
      const { getByText } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.ERROR }] },
      }, state);

      await waitFor(() => expect(getByText('Error: file upload')).toBeInTheDocument());
    });
  });

  describe('when there is no upload definition for location state', () => {
    it('should handle error correctly', async () => {
      renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: undefined,
      });

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(new TypeError('Cannot read property \'fileDefinitions\' of undefined'));
      });
    });
  });
});
