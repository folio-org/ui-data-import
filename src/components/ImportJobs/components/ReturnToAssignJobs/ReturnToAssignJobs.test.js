import React from 'react';

import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../test/jest/__mock__';

import { fireEvent } from '@testing-library/react';

import { UploadingJobsContext } from '../../../UploadingJobsContextProvider';

import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import { ReturnToAssignJobs } from './ReturnToAssignJobs';

import { FILE_STATUSES } from '../../../../utils';

jest.mock('@folio/stripes-data-transfer-components', () => ({ Preloader: () => <span>Preloader</span> }));

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

const returnToAssignJobsProps = {
  onResume: mockOnResumeProp,
  prohibitFilesUploading: false,
};

const renderReturnToAssignJobs = ({
  onResume,
  prohibitFilesUploading,
}) => {
  const component = () => (
    <UploadingJobsContext.Provider value={defaultContext}>
      <ReturnToAssignJobs
        onResume={onResume}
        prohibitFilesUploading={prohibitFilesUploading}
      />
    </UploadingJobsContext.Provider>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('ReturnToAssignJobs component', () => {
  afterEach(() => {
    mockOnResumeProp.mockClear();
    mockDeleteUploadDefinition.mockClear();
  });

  it('should render correctly', () => {
    const {
      getByText,
      getByRole,
    } = renderReturnToAssignJobs(returnToAssignJobsProps);

    const resumeButton = getByRole('button', { name: /resume/i });

    const deleteFilesButton = getByText(/delete files/i);

    expect(resumeButton).toBeInTheDocument();

    expect(deleteFilesButton).toBeInTheDocument();

    expect(getByText(/1 file uploaded/i)).toBeInTheDocument();
  });

  it('should call the assigned handler when Resume button clicked', () => {
    const { getByRole } = renderReturnToAssignJobs(returnToAssignJobsProps);

    const resumeButton = getByRole('button', { name: /resume/i });

    fireEvent.click(resumeButton);

    expect(mockOnResumeProp).toHaveBeenCalled();
  });

  it('should render Preloader when delete files button clicked', async () => {
    const { getByText } = renderReturnToAssignJobs(returnToAssignJobsProps);

    const deleteFilesButton = getByText(/delete files/i);

    fireEvent.click(deleteFilesButton);

    expect(getByText(/preloader/i)).toBeInTheDocument();
  });

  it('should still show Preloader when delete button clicked multiple times ', () => {
    const { getByText } = renderReturnToAssignJobs(returnToAssignJobsProps);

    const deleteFilesButton = getByText(/delete files/i);

    fireEvent.click(deleteFilesButton);

    fireEvent.click(deleteFilesButton);

    expect(getByText(/preloader/i)).toBeInTheDocument();
  });

  it('should handle deletion error correctly', () => {
    const { getByText } = renderReturnToAssignJobs(returnToAssignJobsProps);

    const deleteFilesButton = getByText(/delete files/i);

    fireEvent.click(deleteFilesButton);

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalled();
  });
});
