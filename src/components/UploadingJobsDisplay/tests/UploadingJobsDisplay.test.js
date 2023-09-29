import React from 'react';
import {
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { Router } from 'react-router-dom';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../test/jest/__mock__';

import { Paneset } from '@folio/stripes/components';

import {
  renderWithIntl,
  buildStripes,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { UploadingJobsContext } from '../../UploadingJobsContextProvider';
import { UploadingJobsDisplay } from '../UploadingJobsDisplay';

import { deleteFile } from '../../../utils/upload';
import { FILE_STATUSES } from '../../../utils';

const deleteFailureMock = jest.fn(() => Promise.reject(new Error('failed to delete')));

jest.mock('../../../utils/upload', () => ({
  ...jest.requireActual('../../../utils/upload'),
  deleteFile: jest.fn()
    .mockImplementationOnce(() => Promise.resolve('deleted successfully'))
    .mockImplementationOnce(() => Promise.reject(new Error('failed to delete')))
    .mockImplementationOnce(() => Promise.resolve('deleted successfully')),
}));

jest.mock('../../../settings/JobProfiles', () => ({ createJobProfiles: () => () => <span>JobProfiles</span> }));
const kyPostMock = jest.fn();
const kyGetMock = jest.fn();
const kyMock = () => ({
  get: kyGetMock,
  post: kyPostMock,
});

const mockMultipart = (
  uploadDefId = 'test', // eslint-disable-line
  files = [], // eslint-disable-line
  ky = kyMock,
  errorHandler = jest.fn(),
  progressHandler = jest.fn(),
  successHandler = jest.fn()
) => {
  return {
    init: () => {
      try {
        ky.post();
        progressHandler({ current: 30, total: 100 });
        successHandler();
      } catch (error) {
        errorHandler(error);
      }
    }
  };
};

jest.mock('../../../utils/multipartUpload', () => ({
  ...jest.requireActual('../../../utils/multipartUpload'),
  MultipartUploader: mockMultipart,
}));

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
  uploadConfiguration: { canUseObjectStorage: false }
};

const renderUploadingJobsDisplay = (context, stateField) => {
  const component = () => (
    <UploadingJobsContext.Provider value={context}>
      <Router history={getHistory(stateField)}>
        <Paneset>
          <UploadingJobsDisplay
            stripes={stripes}
            history={getHistory(stateField)}
          />
        </Paneset>
      </Router>
    </UploadingJobsContext.Provider>

  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('UploadingJobsDisplay component', () => {
  afterEach(() => {
    global.fetch.mockClear();
    mockConsoleError.mockReset();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderUploadingJobsDisplay(defaultContext);

    await runAxeTest({ rootNode: container });
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
    it('should be rendered with no axe errors', async () => {
      const { container } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADED }] },
      });

      await runAxeTest({ rootNode: container });
    });

    it('renders JobProfiles component', async () => {
      const { getByText } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADED }] },
      });

      await waitFor(() => expect(getByText('JobProfiles')).toBeDefined());
    });
  });

  describe('when clicked delete button', () => {
    it('modal window should be shown', async () => {
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

      const modalTitle = await findByText('Delete uploaded file?');

      expect(modalTitle).toBeDefined();
    });

    describe('when cancel deletion', () => {
      it('file should not be deleted', async () => {
        const {
          findByText,
          getByRole,
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

        expect(await findByText('CatShip.mrc')).toBeDefined();

        const deleteButton = getByRole('button', { name: /delete/i });

        fireEvent.click(deleteButton);

        expect(await findByText('Delete uploaded file?')).toBeDefined();

        const cancelButton = getByText('No, do not delete');
        await waitFor(() => fireEvent.click(cancelButton));

        expect(await findByText('CatShip.mrc')).toBeDefined();
      });
    });

    describe('when confirm deletion', () => {
      it('file should be deleted', async () => {
        const {
          findByText,
          getByRole,
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

        expect(await findByText('CatShip.mrc')).toBeDefined();

        const deleteButton = getByRole('button', { name: /delete/i });

        fireEvent.click(deleteButton);

        const modalWindow = await findByText('Delete uploaded file?');
        expect(modalWindow).toBeDefined();

        const confirmButton = getByText('Yes, delete');
        await waitFor(() => fireEvent.click(confirmButton));

        expect(await findByText('No files to show')).toBeDefined();
      });
    });

    it('handles deletion error', async () => {
      deleteFile.mockImplementationOnce(deleteFailureMock);

      const {
        findByText,
        getByRole,
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

      expect(await findByText('CatShip.mrc')).toBeDefined();

      const deleteButton = getByRole('button', { name: /delete/i });

      fireEvent.click(deleteButton);

      const confirmButton = getByText('Yes, delete');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(new Error('failed to delete'));
      });
    });
  });

  describe('when status is UPLOADING', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADING }] },
      });

      await runAxeTest({ rootNode: container });
    });

    it('shows correct message', async () => {
      const { getByText } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADING }] },
      });

      window.dispatchEvent(new Event('beforeunload'));

      await waitFor(() => expect(getByText('Uploading')).toBeInTheDocument());
    });

    describe('when reload page while uploading', () => {
      it('file should continue uploading', async () => {
        const { getByText } = renderUploadingJobsDisplay({
          ...defaultContext,
          uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADING }] },
        });

        window.dispatchEvent(new Event('beforeunload'));

        await waitFor(() => expect(getByText('Uploading')).toBeInTheDocument());
      });
    });
  });

  describe('when status is  ERROR_DEFINITION', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.ERROR_DEFINITION }] },
      });

      await runAxeTest({ rootNode: container });
    });

    it('shows error message', async () => {
      const { getByText } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.ERROR_DEFINITION }] },
      });

      await waitFor(() => expect(getByText('Error: file upload')).toBeInTheDocument());
    });
  });

  describe('when status is ERROR', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.ERROR }] },
      });

      await runAxeTest({ rootNode: container });
    });
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
        expect(mockConsoleError).toHaveBeenCalled();
      });
    });
  });
});

// Tests - Object storage upload edition!
describe('UploadingJobsDisplay component - object storage upload', () => {
  beforeAll(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({
        fileExtensions: [
          { dataTypes: ['MARC'] },
        ],
      }),
    }));
  });

  afterEach(() => {
    global.fetch.mockClear();
    mockConsoleError.mockReset();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderUploadingJobsDisplay({
      ...defaultContext,
      uploadConfiguration: { canUseObjectStorage: true },
    });

    await runAxeTest({ rootNode: container });
  });

  it('renders correctly', async () => {
    const { findByText } = renderUploadingJobsDisplay({
      ...defaultContext,
      uploadConfiguration: { canUseObjectStorage: true },
    });

    expect(await findByText('Files')).toBeDefined();
  });

  describe('when cannot update file definition', () => {
    it('handles error correctly', async () => {
      renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
        updateUploadDefinition: () => Promise.reject(new Error('failed to update')),
      });

      await waitFor(() => expect(mockConsoleError).toHaveBeenCalledWith(new Error('failed to update')));
    });
  });

  describe('when uploaded successfully', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADED }] },
      });

      await runAxeTest({ rootNode: container });
    });

    it('renders JobProfiles component', async () => {
      const { getByText } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADED }] },
      });

      await waitFor(() => expect(getByText('JobProfiles')).toBeDefined());
    });
  });

  describe('when clicked delete button', () => {
    it('modal window should be shown', async () => {
      const {
        findByText,
        getByRole,
      } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
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

      const modalTitle = await findByText('Delete uploaded file?');

      expect(modalTitle).toBeDefined();
    });

    describe('when cancel deletion', () => {
      it('file should not be deleted', async () => {
        const {
          findByText,
          getByRole,
          getByText,
        } = renderUploadingJobsDisplay({
          ...defaultContext,
          uploadConfiguration: { canUseObjectStorage: true },
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

        expect(await findByText('Delete uploaded file?')).toBeDefined();

        const cancelButton = getByText('No, do not delete');
        await waitFor(() => fireEvent.click(cancelButton));

        expect(await findByText('CatShip.mrc')).toBeDefined();
      });
    });

    describe('when confirm deletion', () => {
      it('file should be deleted', async () => {
        const {
          findByText,
          getByRole,
          getByText,
        } = renderUploadingJobsDisplay({
          ...defaultContext,
          uploadConfiguration: { canUseObjectStorage: true },
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

        const modalWindow = await findByText('Delete uploaded file?');
        expect(modalWindow).toBeDefined();

        const confirmButton = getByText('Yes, delete');
        await waitFor(() => fireEvent.click(confirmButton));

        expect(await findByText('No files to show')).toBeDefined();
      });
    });

    it('handles deletion error', async () => {
      deleteFile.mockImplementationOnce(deleteFailureMock);
      const {
        findByText,
        getByRole,
        getByText,
      } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
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

      const confirmButton = getByText('Yes, delete');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(new Error('failed to delete'));
      });
    });
  });

  describe('when status is UPLOADING', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADING }] },
      });

      await runAxeTest({ rootNode: container });
    });

    it('shows correct message', async () => {
      const { getByText } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADING }] },
      });

      window.dispatchEvent(new Event('beforeunload'));

      await waitFor(() => expect(getByText('Uploading')).toBeInTheDocument());
    });

    describe('when reload page while uploading', () => {
      it('file should continue uploading', async () => {
        const { getByText } = renderUploadingJobsDisplay({
          ...defaultContext,
          uploadConfiguration: { canUseObjectStorage: true },
          uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.UPLOADING }] },
        });

        window.dispatchEvent(new Event('beforeunload'));

        await waitFor(() => expect(getByText('Uploading')).toBeInTheDocument());
      });
    });
  });

  describe('when status is  ERROR_DEFINITION', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.ERROR_DEFINITION }] },
      });

      await runAxeTest({ rootNode: container });
    });

    it('shows error message', async () => {
      const { getByText } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.ERROR_DEFINITION }] },
      });

      await waitFor(() => expect(getByText('Error: file upload')).toBeInTheDocument());
    });
  });

  describe('when status is ERROR', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.ERROR }] },
      });

      await runAxeTest({ rootNode: container });
    });
    it('renders error message', async () => {
      const state = { files: { 'CatShip.mrc1634031179989': { status: FILE_STATUSES.ERROR } } };
      const { getByText } = renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
        uploadDefinition: { fileDefinitions: [{ status: FILE_STATUSES.ERROR }] },
      }, state);

      await waitFor(() => expect(getByText('Error: file upload')).toBeInTheDocument());
    });
  });

  describe('when there is no upload definition for location state', () => {
    it('should handle error correctly', async () => {
      renderUploadingJobsDisplay({
        ...defaultContext,
        uploadConfiguration: { canUseObjectStorage: true },
        uploadDefinition: undefined,
      });

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalled();
      });
    });
  });
});
