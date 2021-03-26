import React from 'react';
import { fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import faker from 'faker';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/test/helpers';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { JobSummary } from './JobSummary';

window.open = jest.fn();
window.open.mockReturnValue({ focus: jest.fn() });

const firstRecordJobExecutionId = faker.random.uuid();
const firstRecordSourceRecordId = faker.random.uuid();
const getJobExecutionsResources = dataType => buildResources({
  resourceName: 'jobExecutions',
  records: [{
    fileName: 'testFileName',
    progress: { total: 10 },
    jobProfileInfo: { dataType },
  }],
});
const jobLogEntriesResources = buildResources({
  resourceName: 'jobLogEntries',
  records: [{
    sourceRecordActionStatus: 'CREATED',
    jobExecutionId: firstRecordJobExecutionId,
    sourceRecordId: firstRecordSourceRecordId,
    sourceRecordOrder: '0',
    sourceRecordTitle: 'Test item 1',
  }, {
    instanceActionStatus: 'UPDATED',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: faker.random.uuid(),
    sourceRecordOrder: '1',
    sourceRecordTitle: 'Test item 2',
  }, {
    holdingsActionStatus: 'MULTIPLE',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: faker.random.uuid(),
    sourceRecordOrder: '2',
    sourceRecordTitle: 'Test item 3',
  }, {
    itemStatus: 'DISCARDED',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: faker.random.uuid(),
    sourceRecordOrder: '3',
    sourceRecordTitle: 'Test item 4',
    error: 'Error message',
  }],
});
const getResources = dataType => ({
  ...getJobExecutionsResources(dataType),
  ...jobLogEntriesResources,
});

const mutator = buildMutator();

const renderJobSummary = (dataType = 'MARC') => {
  const component = (
    <Router>
      <JobSummary
        resources={getResources(dataType)}
        mutator={mutator}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Job summary page', () => {
  afterEach(() => {
    window.open.mockClear();
  });

  it('should have a file name in the header', () => {
    const { getByText } = renderJobSummary();

    expect(getByText('testFileName')).toBeDefined();
  });

  it('should have total number of records in the subheader', () => {
    const { getByText } = renderJobSummary();

    expect(getByText('4 records found')).toBeDefined();
  });

  describe('results table', () => {
    it('should have proper columns', () => {
      const { getByText } = renderJobSummary();
      /*
       * Get "Error" label by query selector instead of by "getByText" because there are
       * "Error" column label and "Error" messages in cells on the page
       */
      const errorColumn = document.querySelector('#list-column-error div[class^="mclHeaderInner"] > div');

      expect(getByText('Record')).toBeDefined();
      expect(getByText('Title')).toBeDefined();
      expect(getByText('SRS MARC Bib')).toBeDefined();
      expect(getByText('Instance')).toBeDefined();
      expect(getByText('Holdings')).toBeDefined();
      expect(getByText('Item')).toBeDefined();
      expect(getByText('Order')).toBeDefined();
      expect(getByText('Invoice')).toBeDefined();
      expect(errorColumn.innerHTML).toEqual('Error');
    });

    describe('record order field', () => {
      describe('for EDIFACT data type', () => {
        it('should display order as it is', () => {
          const { container } = renderJobSummary('EDIFACT');

          const cells = container.querySelectorAll('[role="gridcell"]');
          const firstRowRecordOrder = cells[0].innerHTML;

          expect(firstRowRecordOrder).toEqual('0');
        });
      });

      describe('for MARC data type', () => {
        it('should display incremented order', () => {
          const { container } = renderJobSummary('MARC');

          const cells = container.querySelectorAll('[role="gridcell"]');
          const firstRowRecordOrder = cells[0].innerHTML;

          expect(firstRowRecordOrder).toEqual('1');
        });
      });
    });
  });

  describe('when clicking on a row', () => {
    it('should navigate to the log details screen', () => {
      const { container } = renderJobSummary();

      const firstRow = container.querySelector('[data-row-inner="0"]');

      fireEvent.click(firstRow);

      expect(window.open).toHaveBeenCalledWith(`/data-import/log/${firstRecordJobExecutionId}/${firstRecordSourceRecordId}`, '_blank');
    });
  });
});
