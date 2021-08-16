import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../test/jest/helpers';

import { FileItem } from '..';

import { FILE_STATUSES } from '../../../../utils';

const fileName = 'test_file';
const fileSize = 1000;

const renderFileItem = ({
  uiKey = fileName,
  name = fileName,
  size = fileSize,
  onDelete,
  onUndoDelete,
  status,
  uploadedDate,
  loading,
  isSnapshotMode,
}) => {
  const component = (
    <FileItem
      uiKey={uiKey}
      name={name}
      size={size}
      status={status}
      uploadedDate={uploadedDate}
      onDelete={onDelete}
      onUndoDelete={onUndoDelete}
      loading={loading}
      isSnapshotMode={isSnapshotMode}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('FileItem component', () => {
  it('should be rendered', () => {
    const { container } = renderFileItem({});

    const fileItemElement = container.querySelector('.fileItem');

    expect(fileItemElement).toBeDefined();
  });

  it('should render the doc icon in the heading', () => {
    const { getByText } = renderFileItem({});

    expect(getByText('Icon')).toBeDefined();
  });

  describe('when status is NEW', () => {
    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.NEW });

        expect(getByText('test_file')).toBeDefined();
      });
    });

    describe('progress section', () => {
      it('should render Waiting for upload message', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.NEW });

        expect(getByText('Waiting for upload')).toBeDefined();
      });
    });
  });

  describe('when status is UPLOADING', () => {
    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.UPLOADING });

        expect(getByText('test_file')).toBeDefined();
      });
    });

    describe('progress section', () => {
      describe('in snapshot mode', () => {
        it('should render Uploading message', () => {
          const { getByText } = renderFileItem({
            status: FILE_STATUSES.UPLOADING,
            isSnapshotMode: true,
          });

          expect(getByText('Uploading')).toBeDefined();
        });
      });

      describe('in non-snapshot mode', () => {
        it('should render the progress info', () => {
          const { getByText } = renderFileItem({
            status: FILE_STATUSES.UPLOADING,
            isSnapshotMode: false,
          });

          expect(getByText('Uploading 0%')).toBeDefined();
        });
      });
    });
  });

  describe('when status is UPLOADED', () => {
    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.UPLOADED });

        expect(getByText('test_file')).toBeDefined();
      });

      it('should render the uploaded date', () => {
        const { getByText } = renderFileItem({
          status: FILE_STATUSES.UPLOADED,
          uploadedDate: '2021-08-09T13:36:06.537+00:00',
        });

        expect(getByText('8/9/2021')).toBeDefined();
      });

      it('should render the delete button', () => {
        const { container } = renderFileItem({ status: FILE_STATUSES.UPLOADED });

        const deleteButtonElement = container.querySelector('[ data-test-delete-button="true"]');

        expect(deleteButtonElement).toBeDefined();
      });

      describe('when clicking on Delete button', () => {
        it('should delete the file', () => {
          const onDelete = jest.fn();
          const { container } = renderFileItem({
            status: FILE_STATUSES.UPLOADED,
            onDelete,
          });

          const deleteButtonElement = container.querySelector('[ data-test-delete-button="true"]');

          fireEvent.click(deleteButtonElement);

          expect(onDelete.mock.calls.length).toEqual(1);
        });
      });
    });
  });

  describe('when status is ERROR', () => {
    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.ERROR });

        expect(getByText('test_file')).toBeDefined();
      });
    });
  });

  describe('when status is ERROR_DEFINITION', () => {
    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.ERROR_DEFINITION });

        expect(getByText('test_file')).toBeDefined();
      });

      it('should render the error message', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.ERROR_DEFINITION });

        expect(getByText('Error: file upload')).toBeDefined();
      });

      describe('when loading', () => {
        it('should render preloader icon', () => {
          const { container } = renderFileItem({
            status: FILE_STATUSES.ERROR_DEFINITION,
            loading: true,
          });

          const preloaderElement = container.querySelector('[data-test-preloader="true"]');

          expect(preloaderElement).toBeDefined();
        });
      });

      describe('when not loading', () => {
        it('should render delete button', () => {
          const { container } = renderFileItem({
            status: FILE_STATUSES.ERROR_DEFINITION,
            loading: false,
          });

          const deleteButtonElement = container.querySelector('[data-test-delete-button="true"]');

          expect(deleteButtonElement).toBeDefined();
        });
      });
    });
  });

  describe('when status is DELETING', () => {
    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.DELETING });

        expect(getByText('test_file')).toBeDefined();
      });

      describe('when loading', () => {
        it('should render preloader icon', () => {
          const { container } = renderFileItem({
            status: FILE_STATUSES.DELETING,
            loading: true,
          });

          const preloaderElement = container.querySelector('[data-test-preloader="true"]');

          expect(preloaderElement).toBeDefined();
        });
      });

      describe('when not loading', () => {
        it('should render undo button', () => {
          const { container } = renderFileItem({
            status: FILE_STATUSES.DELETING,
            loading: false,
          });

          const undoDeleteButtonElement = container.querySelector('[data-test-undo-button="true"]');

          expect(undoDeleteButtonElement).toBeDefined();
        });

        describe('when clicking on undo button', () => {
          it('file deleting should be aborted', () => {
            const onUndoDelete = jest.fn();
            const { container } = renderFileItem({
              status: FILE_STATUSES.DELETING,
              loading: false,
              onUndoDelete,
            });

            const undoDeleteButtonElement = container.querySelector('[data-test-undo-button="true"]');

            fireEvent.click(undoDeleteButtonElement);

            expect(onUndoDelete.mock.calls.length).toEqual(1);
          });
        });
      });
    });
  });
});
