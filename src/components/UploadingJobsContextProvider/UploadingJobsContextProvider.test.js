import React, { useContext } from 'react';
import {
  waitFor,
  fireEvent,
} from '@testing-library/react';

import { renderWithContext } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';

import { UploadingJobsContextProvider } from './UploadingJobsContextProvider';
import { UploadingJobsContext } from './UploadingJobsContext';

import * as utils from '../../utils/upload';
import { FILE_STATUSES } from '../../utils';

global.fetch = jest.fn();

const deleteUploadDefinitionSpy = jest.spyOn(utils, 'deleteUploadDefinition');
const getLatestUploadDefinitionSpy = jest.spyOn(utils, 'getLatestUploadDefinition');

const TestComponent = () => {
  const {
    updateUploadDefinition,
    deleteUploadDefinition,
  } = useContext(UploadingJobsContext);

  return (
    <>
      <button
        type="button"
        onClick={() => updateUploadDefinition()}
      >
        updateUploadDefinition
      </button>
      <button
        type="button"
        onClick={() => deleteUploadDefinition()}
      >
        deleteUploadDefinition
      </button>
      <span>Children</span>
    </>
  );
};

const renderUploadingJobsContextProvider = () => {
  const component = (
    <UploadingJobsContextProvider>
      <TestComponent />
    </UploadingJobsContextProvider>
  );

  return renderWithContext(component);
};

describe('UploadingJobsContextProvider component', () => {
  afterEach(() => {
    global.fetch.mockClear();
    deleteUploadDefinitionSpy.mockClear();
    getLatestUploadDefinitionSpy.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should render children', () => {
    const { getByText } = renderUploadingJobsContextProvider();

    expect(getByText('Children')).toBeDefined();
  });

  describe('when deleting upload definition', () => {
    it('should call API delete upload definition and get latest upload definition', async () => {
      global.fetch
        .mockReturnValueOnce(Promise.resolve({
          status: 200,
          ok: true,
          json: async () => ({}),
        }))
        .mockResolvedValueOnce(Promise.resolve({
          status: 200,
          ok: true,
          json: async () => ({ uploadDefinitions: [{}] }),
        }));

      const { getByText } = renderUploadingJobsContextProvider();

      fireEvent.click(getByText('deleteUploadDefinition'));

      await waitFor(() => expect(deleteUploadDefinitionSpy).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(getLatestUploadDefinitionSpy).toHaveBeenCalledTimes(1));
    });
  });

  describe('when update definition', () => {
    describe('and upload definition failed', () => {
      describe('with error status', () => {
        it('should delete definition', async () => {
          global.fetch
            .mockReturnValue(Promise.resolve({
              status: 200,
              ok: true,
              json: async () => ({ uploadDefinitions: [{}] }),
            }))
            .mockReturnValueOnce(Promise.resolve({
              status: 200,
              ok: true,
              json: async () => ({ uploadDefinitions: [{ status: FILE_STATUSES.ERROR }] }),
            }));

          const { getByText } = renderUploadingJobsContextProvider();

          fireEvent.click(getByText('updateUploadDefinition'));

          await waitFor(() => expect(deleteUploadDefinitionSpy).toHaveBeenCalledTimes(1));
        });
      });

      describe('with all files failed', () => {
        it('should delete definition', async () => {
          const uploadDefinition = [{
            status: FILE_STATUSES.UPLOADED,
            fileDefinitions: [{ status: FILE_STATUSES.ERROR }, { status: FILE_STATUSES.ERROR }],
          }];

          global.fetch
            .mockReturnValue(Promise.resolve({
              status: 200,
              ok: true,
              json: async () => ({ uploadDefinitions: [{}] }),
            }))
            .mockReturnValueOnce(Promise.resolve({
              status: 200,
              ok: true,
              json: async () => ({ uploadDefinitions: uploadDefinition }),
            }));

          const { getByText } = renderUploadingJobsContextProvider();

          fireEvent.click(getByText('updateUploadDefinition'));

          await waitFor(() => expect(deleteUploadDefinitionSpy).toHaveBeenCalledTimes(1));
        });
      });
    });
  });
});
