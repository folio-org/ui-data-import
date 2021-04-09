import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { JobLogsContainer } from './JobLogsContainer';

const successfulRecord = {
  status: 'COMMITTED',
  progress: { current: 0 },
};

const failedRecord = {
  status: 'ERROR',
  progress: { current: 0 },
};

const completedWithErrorsRecord = {
  status: 'ERROR',
  progress: { current: 1 },
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
    <JobLogsContainer>
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
});
