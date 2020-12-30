import React from 'react';
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

const jobExecutionsResources = buildResources({
  resourceName: 'jobExecutions',
  records: [{
    fileName: 'testFileName',
    progress: { total: 10 },
  }],
});
const jobLogEntriesResources = buildResources({
  resourceName: 'jobLogEntries',
  records: [{
    sourceRecordActionStatus: 'CREATED',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: faker.random.uuid(),
    sourceRecordOrder: 0,
    sourceRecordTitle: 'Test item 1',
  }, {
    instanceActionStatus: 'UPDATED',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: faker.random.uuid(),
    sourceRecordOrder: 1,
    sourceRecordTitle: 'Test item 2',
  }, {
    holdingsActionStatus: 'MULTIPLE',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: faker.random.uuid(),
    sourceRecordOrder: 2,
    sourceRecordTitle: 'Test item 3',
  }, {
    itemStatus: 'DISCARDED',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: faker.random.uuid(),
    sourceRecordOrder: 3,
    sourceRecordTitle: 'Test item 4',
    error: 'Error message',
  }],
});
const resources = {
  ...jobExecutionsResources,
  ...jobLogEntriesResources,
};

const mutator = buildMutator();

const renderJobSummary = () => {
  const component = (
    <Router>
      <JobSummary
        resources={resources}
        mutator={mutator}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Job summary page', () => {
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
  });
});
