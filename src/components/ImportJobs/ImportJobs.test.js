import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { waitFor } from '@testing-library/react';
import { noop } from 'lodash';

import '../../../test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { FileUploader } from '@folio/stripes-data-transfer-components';

import { ImportJobs } from './ImportJobs';
import { UploadingJobsContext } from '../UploadingJobsContextProvider';
import { translationsProperties } from '../../../test/jest/helpers';

jest.mock('./components', () => ({ ReturnToAssignJobs: () => <span>ReturnToAssignJobs</span> }));
jest.mock('@folio/stripes-data-transfer-components', () => ({
  Preloader: () => <span>Preloader</span>,
  FileUploader: jest.fn(() => 'FileUploader'),
}));

const history = createMemoryHistory();

history.push = jest.fn();

const defaultContext = {
  uploadDefinition: {},
  updateUploadDefinition: noop,
  deleteUploadDefinition: noop,
};

const renderImportJobs = context => {
  const component = (
    <UploadingJobsContext.Provider value={context || defaultContext}>
      <Router>
        <ImportJobs />
      </Router>
    </UploadingJobsContext.Provider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Import Jobs component', () => {
  beforeEach(() => {
    FileUploader.mockClear();
    history.push.mockClear();
  });

  describe('when is not loaded', () => {
    it('then it should render Preloader', () => {
      const { getByText } = renderImportJobs();

      expect(getByText('Preloader')).toBeDefined();
    });
  });

  describe('when is loaded', () => {
    it('then it should render FileUploader', async () => {
      FileUploader.mockImplementationOnce(() => 'FileUploader');
      const { getByText } = await renderImportJobs();

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
      FileUploader.mockImplementationOnce(({ onDragEnter }) => {
        useEffect(() => {
          onDragEnter();
        }, [onDragEnter]);

        return 'FileUploader';
      });

      const context = {
        uploadDefinition: {},
        updateUploadDefinition: () => ({ uploadDefinition: { fileDefinitions: [] } }),
        deleteUploadDefinition: noop,
      };

      const { getByText } = await renderImportJobs(context);

      await waitFor(() => expect(getByText('FileUploader')).toBeDefined());
    });
  });

  describe('when onDragLeave method is called', () => {
    it('then it should render FileUploader with non-active drop zone', async () => {
      FileUploader.mockImplementationOnce(({ onDragLeave }) => {
        useEffect(() => {
          onDragLeave();
        }, [onDragLeave]);

        return 'FileUploader';
      });

      const context = {
        uploadDefinition: {},
        updateUploadDefinition: () => ({ uploadDefinition: { fileDefinitions: [] } }),
        deleteUploadDefinition: noop,
      };

      await renderImportJobs(context);

      await waitFor(() => expect(FileUploader.mock.calls[0][0].isDropZoneActive).toEqual(false));
    });
  });
});
