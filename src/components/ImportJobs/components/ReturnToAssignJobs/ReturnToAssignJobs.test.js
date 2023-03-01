import React from 'react';
import { fireEvent } from '@testing-library/react';
import { noop } from 'lodash';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import '../../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { translationsProperties } from '../../../../../test/jest/helpers';

import { UploadingJobsContext } from '../../../UploadingJobsContextProvider';
import { ReturnToAssignJobs } from './ReturnToAssignJobs';

import { FILE_STATUSES } from '../../../../utils';

expect.extend(toHaveNoViolations);

jest.mock('@folio/stripes-data-transfer-components', () => ({
  ...jest.requireActual('@folio/stripes-data-transfer-components'),
  Preloader: () => <span>Preloader</span>,
}));

const mockOnResumeProp = jest.fn();

const mockDeleteUploadDefinition = jest.fn(async () => Promise.reject(new Error('Something went wrong')));

jest.spyOn(console, 'error').mockImplementation(() => {});

const defaultContext = {
  uploadDefinition: {
    fileDefinitions: [
      { status: FILE_STATUSES.UPLOADED },
      { status: FILE_STATUSES.UPLOADING },
    ],
  },
  updateUploadDefinition: noop,
  deleteUploadDefinition: mockDeleteUploadDefinition,
};

const renderReturnToAssignJobs = () => {
  const component = (
    <UploadingJobsContext.Provider value={defaultContext}>
      <ReturnToAssignJobs
        onResume={mockOnResumeProp}
        prohibitFilesUploading={false}
      />
    </UploadingJobsContext.Provider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ReturnToAssignJobs component', () => {
  afterEach(() => {
    mockOnResumeProp.mockClear();
    mockDeleteUploadDefinition.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderReturnToAssignJobs();
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should render correctly', () => {
    const {
      getByText,
      getByRole,
    } = renderReturnToAssignJobs();

    const resumeButton = getByRole('button', { name: /resume/i });
    const deleteFilesButton = getByText(/delete files/i);

    expect(resumeButton).toBeInTheDocument();
    expect(deleteFilesButton).toBeInTheDocument();
    expect(getByText(/1 file uploaded/i)).toBeInTheDocument();
  });

  it('should call the assigned handler when Resume button clicked', () => {
    const { getByRole } = renderReturnToAssignJobs();

    const resumeButton = getByRole('button', { name: /resume/i });

    fireEvent.click(resumeButton);

    expect(mockOnResumeProp).toHaveBeenCalled();
  });

  it('should render Preloader when delete files button clicked', () => {
    const { getByText } = renderReturnToAssignJobs();

    const deleteFilesButton = getByText(/delete files/i);

    fireEvent.click(deleteFilesButton);

    expect(getByText('Preloader')).toBeInTheDocument();
  });

  it('should still show Preloader when delete button clicked multiple times ', () => {
    const { getByText } = renderReturnToAssignJobs();

    const deleteFilesButton = getByText(/delete files/i);

    fireEvent.click(deleteFilesButton);
    fireEvent.click(deleteFilesButton);

    expect(getByText('Preloader')).toBeInTheDocument();
  });

  it('should handle deletion error correctly', () => {
    const { getByText } = renderReturnToAssignJobs();

    const deleteFilesButton = getByText(/delete files/i);

    fireEvent.click(deleteFilesButton);

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalled();
  });
});
