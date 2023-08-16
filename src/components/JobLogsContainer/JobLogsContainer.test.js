import React from 'react';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
  buildStripes,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import JobLogsContainer from './JobLogsContainer';
import { FILE_STATUSES } from '../../utils';

import { UploadingJobsContext } from '../UploadingJobsContextProvider/UploadingJobsContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/test',
    search: '?testKey=testValue',
  }),
}));

const splitRecord = {
  status: FILE_STATUSES.COMMITTED,
  progress: { current: 0 },
  jobPartNumber: 2,
  totalJobParts: 20
};

const successfulRecord = {
  status: FILE_STATUSES.COMMITTED,
  progress: { current: 0 },
};

const failedRecord = {
  status: FILE_STATUSES.ERROR,
  progress: { current: 0 },
};

const completedWithErrorsRecord = {
  status: FILE_STATUSES.ERROR,
  progress: { current: 1 },
};

const cancelledRecord = {
  status: FILE_STATUSES.CANCELLED,
  progress: { current: 1 },
};

const checkboxListProp = {
  isAllSelected: false,
  handleSelectAllCheckbox: noop,
  selectRecord: noop,
  selectedRecords: new Set(),
  selectAll: noop,
  deselectAll: noop,
};

const stripes = buildStripes();
const defaultUploadContext = {
  uploadConfiguration: { canUseObjectStorage: { splitStatus: false } }
};

const splittingUploadContext = {
  uploadConfiguration: { canUseObjectStorage: { splitStatus: true } }
};

const renderJobLogsContainer = (record, context = defaultUploadContext) => {
  const { Provider } = UploadingJobsContext;
  const childComponent = listProps => {
    listProps.resultsFormatter.status(record);
    listProps.resultsFormatter.fileName(record);

    return (
      <div>
        <span>child component</span>
        <span>{listProps.resultsFormatter.status(record)}</span>
        {record.jobPartNumber && <span>{listProps.resultsFormatter.jobParts(record)}</span>}
      </div>
    );
  };

  const component = (
    <Provider value={context}>
      <JobLogsContainer checkboxList={checkboxListProp} stripes={stripes}>
        {({ listProps }) => childComponent(listProps)}
      </JobLogsContainer>
    </Provider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Job Logs container', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderJobLogsContainer(successfulRecord);

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered with child component', () => {
    const { getByText } = renderJobLogsContainer(successfulRecord);

    expect(getByText('child component')).toBeDefined();
  });

  describe('when job status is COMMITTED', () => {
    it('then component should be rendered with appropriate text', () => {
      const { getByText } = renderJobLogsContainer(successfulRecord);

      expect(getByText('Completed')).toBeDefined();
    });
  });

  describe('when job status is ERROR', () => {
    it('then component should be rendered with appropriate text', () => {
      const { getByText } = renderJobLogsContainer(failedRecord);

      expect(getByText('Failed')).toBeDefined();
    });

    describe('and job is already in progress ', () => {
      it('then component should be rendered with appropriate text', () => {
        const { getByText } = renderJobLogsContainer(completedWithErrorsRecord);

        expect(getByText('Completed with errors')).toBeDefined();
      });
    });
  });

  describe('when job status is CANCELLED', () => {
    it('then component should be rendered with appropriate text', () => {
      const { getByText } = renderJobLogsContainer(cancelledRecord);

      expect(getByText('Stopped by user')).toBeDefined();
    });
  });

  describe('when large file splitting is enabled, display job parts column', () => {
    it('should render the correct parts current and total for the job', () => {
      const { getByText } = renderJobLogsContainer(splitRecord, splittingUploadContext);
      const { jobPartNumber, totalJobParts } = splitRecord;
      expect(getByText(`${jobPartNumber} of ${totalJobParts}`)).toBeInTheDocument();
    });
  });
});
