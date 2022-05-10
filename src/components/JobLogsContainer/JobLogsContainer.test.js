import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { noop } from 'lodash';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { JobLogsContainer } from './JobLogsContainer';
import { FILE_STATUSES } from '../../utils';

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

const renderJobLogsContainer = record => {
  const childComponent = listProps => {
    listProps.resultsFormatter.status(record);
    listProps.resultsFormatter.fileName(record);

    return (
      <div>
        <span>child component</span>
        <span>{listProps.resultsFormatter.status(record)}</span>
      </div>
    );
  };

  const component = (
    <JobLogsContainer checkboxList={checkboxListProp}>
      {({ listProps }) => childComponent(listProps)}
    </JobLogsContainer>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Job Logs container', () => {
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
});
