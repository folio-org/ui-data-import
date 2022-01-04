import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { waitFor } from '@testing-library/react';
import { noop } from 'lodash';

import '../../../test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { FileUploader } from '@folio/stripes-data-transfer-components';

import { ConfirmationModal } from '@folio/stripes/components';
import { ImportJobs } from './ImportJobs';
import { ReturnToAssignJobs } from './components';
import { UploadingJobsContext } from '../UploadingJobsContextProvider';
import { translationsProperties } from '../../../test/jest/helpers';

const mockOpenDialogWindow = jest.fn();

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  ConfirmationModal: jest.fn(({
    open,
    onCancel,
    onConfirm,
  }) => (open ? (
    <div>
      <span>Confirmation modal</span>
      <button
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="button"
        id="confirmButton"
        onClick={onConfirm}
      >
        Confirm
      </button>
    </div>
  ) : null)),
}));
jest.mock('@folio/stripes-data-transfer-components', () => ({
  ...jest.requireActual('@folio/stripes-data-transfer-components'),
  Preloader: () => <span>Preloader</span>,
  FileUploader: jest.fn(({ children }) => {
    return (
      <>
        <div>FileUploader</div>
        {children(mockOpenDialogWindow)}
      </>
    );
  }),
}));
jest.mock('./components', () => ({ ReturnToAssignJobs: jest.fn().mockReturnValue('ReturnToAssignJobs') }));
jest.mock('../../utils/upload', () => ({
  mapFilesToUI: jest.fn(() => ({})),
  createUploadDefinition: jest.fn(() => ([null, {}])),
}));

const history = createMemoryHistory();

history.push = jest.fn();

const defaultContext = {
  uploadDefinition: {},
  updateUploadDefinition: () => ({ uploadDefinition: { fileDefinitions: [] } }),
  deleteUploadDefinition: noop,
};

const renderImportJobs = context => {
  const component = (
    <Router>
      <UploadingJobsContext.Provider value={context}>
        <ImportJobs />
      </UploadingJobsContext.Provider>
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Import Jobs component', () => {
  beforeEach(() => {
    history.push.mockClear();
  });

  describe('when is not loaded', () => {
    it('then it should render Preloader', () => {
      const { getByText } = renderImportJobs(defaultContext);

      expect(getByText('Preloader')).toBeDefined();
    });
  });

  describe('when is loaded', () => {
    it('then it should render FileUploader', async () => {
      const { getByText } = await renderImportJobs(defaultContext);

      await waitFor(() => expect(getByText('FileUploader')).toBeDefined());
    });
  });

  describe('when uploadDefinition is not empty', () => {
    it('then it should return to assign jobs', async () => {
      const { getByText } = await renderImportJobs({
        ...defaultContext,
        uploadDefinition: { fileDefinitions: [] },
      });

      await waitFor(() => expect(getByText('ReturnToAssignJobs')).toBeDefined());
    });

    describe('when assigned job is resumed', () => {
      it('should redirect to job profile', async () => {
        const { getByText } = await renderImportJobs({
          ...defaultContext,
          uploadDefinition: { fileDefinitions: [] },
        });

        ReturnToAssignJobs.mock.calls[0][0].onResume();

        await waitFor(() => expect(getByText('Preloader')).toBeDefined());
      });
    });
  });

  describe('when there is no upload definition files', () => {
    describe('and there is no error', () => {
      it('then it should delete upload definition', async () => {
        const context = {
          uploadDefinition: { fileDefinitions: [] },
          updateUploadDefinition: () => ({ uploadDefinition: { fileDefinitions: [] } }),
          deleteUploadDefinition: jest.fn(),
        };

        await renderImportJobs(context);

        await waitFor(() => expect(context.deleteUploadDefinition).toHaveBeenCalled());
      });
    });
  });

  describe('when onDragEnter method is called', () => {
    it('then it should render FileUploader with active drop zone', async () => {
      const context = {
        uploadDefinition: {},
        updateUploadDefinition: () => ({ uploadDefinition: { fileDefinitions: [] } }),
        deleteUploadDefinition: noop,
      };

      const { getByText } = await renderImportJobs(context);

      FileUploader.mock.calls[0][0].onDragEnter();

      await waitFor(() => expect(getByText('FileUploader')).toBeDefined());
    });
  });

  describe('when onDragLeave method is called', () => {
    it('then it should render FileUploader with non-active drop zone', async () => {
      const context = {
        uploadDefinition: {},
        updateUploadDefinition: () => ({ uploadDefinition: { fileDefinitions: [] } }),
        deleteUploadDefinition: noop,
      };

      await renderImportJobs(context);

      FileUploader.mock.calls[0][0].onDragLeave();

      await waitFor(() => expect(FileUploader.mock.calls[0][0].isDropZoneActive).toEqual(false));
    });
  });

  describe('when onDrop method is called', () => {
    it('should set drop zone inactive', async () => {
      await renderImportJobs(defaultContext);

      FileUploader.mock.calls[0][0].onDrop();

      expect(FileUploader.mock.calls[0][0].isDropZoneActive).toBeFalsy();
    });
  });

  describe('when confirmation modal is confirmed', () => {
    it('should open dialog window', async () => {
      await renderImportJobs(defaultContext);

      ConfirmationModal.mock.calls[0][0].onConfirm();

      expect(mockOpenDialogWindow).toHaveBeenCalled();
    });
  });
});
