import React from 'react';
import { fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';

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
  onCancelImport,
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
      onCancelImport={onCancelImport}
      loading={loading}
      isSnapshotMode={isSnapshotMode}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('FileItem component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderFileItem({});
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

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
    it('should be rendered with no axe errors', async () => {
      const { container } = renderFileItem({ status: FILE_STATUSES.NEW });
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.NEW });

        expect(getByText(fileName)).toBeDefined();
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
    it('should be rendered with no axe errors', async () => {
      const { container } = renderFileItem({ status: FILE_STATUSES.UPLOADING });
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.UPLOADING });

        expect(getByText(fileName)).toBeDefined();
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
    it('should be rendered with no axe errors', async () => {
      const { container } = renderFileItem({ status: FILE_STATUSES.UPLOADED });
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.UPLOADED });

        expect(getByText(fileName)).toBeDefined();
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
        it('should call a function to open the modal window', () => {
          const onCancelImport = jest.fn();
          const { container } = renderFileItem({
            status: FILE_STATUSES.UPLOADED,
            onCancelImport,
          });

          const cancelButtonElement = container.querySelector('[ data-test-delete-button="true"]');

          fireEvent.click(cancelButtonElement);

          expect(onCancelImport.mock.calls.length).toEqual(1);
        });
      });
    });
  });

  describe('when status is ERROR', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderFileItem({ status: FILE_STATUSES.ERROR });
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.ERROR });

        expect(getByText(fileName)).toBeDefined();
      });
    });
  });

  describe('when status is ERROR_DEFINITION', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderFileItem({ status: FILE_STATUSES.ERROR_DEFINITION });
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.ERROR_DEFINITION });

        expect(getByText(fileName)).toBeDefined();
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
    it('should be rendered with no axe errors', async () => {
      const { container } = renderFileItem({ status: FILE_STATUSES.DELETING });
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    describe('heading', () => {
      it('should render the file name', () => {
        const { getByText } = renderFileItem({ status: FILE_STATUSES.DELETING });

        expect(getByText(fileName)).toBeDefined();
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
        it('delete button should be hidden', () => {
          const { container } = renderFileItem({
            status: FILE_STATUSES.DELETING,
            loading: false,
          });

          const deleteButton = container.querySelector('[ data-test-delete-button="true"]');

          expect(deleteButton).toBeNull();
        });
      });
    });
  });
});
