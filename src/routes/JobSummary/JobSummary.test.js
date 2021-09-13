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
const sourceRecordsIds = [
  faker.random.uuid(),
  faker.random.uuid(),
  faker.random.uuid(),
  faker.random.uuid(),
];
const instanceId = faker.random.uuid();

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
    instanceActionStatus: 'CREATED',
    jobExecutionId: firstRecordJobExecutionId,
    sourceRecordId: sourceRecordsIds[0],
    sourceRecordOrder: '0',
    sourceRecordTitle: 'Test item 1',
  }, {
    instanceActionStatus: 'UPDATED',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: sourceRecordsIds[1],
    sourceRecordOrder: '1',
    sourceRecordTitle: 'Test item 2',
  }, {
    holdingsActionStatus: 'MULTIPLE',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: sourceRecordsIds[2],
    sourceRecordOrder: '2',
    sourceRecordTitle: 'Test item 3',
  }, {
    itemActionStatus: 'DISCARDED',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: sourceRecordsIds[3],
    sourceRecordOrder: '3',
    sourceRecordTitle: 'Test item 4',
    error: 'Error message',
  }],
});
const jobLogResources = buildResources({
  resourceName: 'jobLog',
  records: [{
    sourceRecordId: sourceRecordsIds[0],
    sourceRecordOrder: '0',
    sourceRecordTitle: 'Test item 1',
    relatedInstanceInfo: {
      actionStatus: 'CREATED',
      idList: [instanceId],
    },
    relatedHoldingsInfo: {
      actionStatus: 'CREATED',
      idList: [faker.random.uuid()],
    },
    relatedItemInfo: {
      actionStatus: 'CREATED',
      idList: [faker.random.uuid()],
    },
  }, {
    sourceRecordId: sourceRecordsIds[1],
    sourceRecordOrder: '1',
    sourceRecordTitle: 'Test item 2',
    relatedInstanceInfo: {
      actionStatus: 'UPDATED',
      idList: [instanceId],
    },
    relatedHoldingsInfo: {
      actionStatus: 'UPDATED',
      idList: [faker.random.uuid()],
    },
    relatedItemInfo: {
      actionStatus: 'UPDATED',
      idList: [faker.random.uuid()],
    },
  }, {
    sourceRecordId: sourceRecordsIds[2],
    sourceRecordOrder: '2',
    sourceRecordTitle: 'Test item 1',
    relatedInstanceInfo: {
      actionStatus: 'MULTIPLE',
      idList: [faker.random.uuid()],
    },
    relatedHoldingsInfo: {
      actionStatus: 'MULTIPLE',
      idList: [faker.random.uuid()],
    },
    relatedItemInfo: {
      actionStatus: 'MULTIPLE',
      idList: [faker.random.uuid()],
    },
  }, {
    sourceRecordId: sourceRecordsIds[3],
    sourceRecordOrder: '3',
    sourceRecordTitle: 'Test item 4',
    relatedInstanceInfo: {
      actionStatus: 'DISCARDED',
      idList: [faker.random.uuid()],
    },
    relatedHoldingsInfo: {
      actionStatus: 'DISCARDED',
      idList: [faker.random.uuid()],
    },
    relatedItemInfo: {
      actionStatus: 'DISCARDED',
      idList: [faker.random.uuid()],
    },
  }],
});
const getResources = dataType => ({
  ...getJobExecutionsResources(dataType),
  ...jobLogEntriesResources,
  ...jobLogResources,
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

  describe('when clicking on a record title', () => {
    it('should navigate to the log details screen', () => {
      const { getByText } = renderJobSummary();

      expect(getByText('Test item 1').href).toContain(`/data-import/log/${firstRecordJobExecutionId}/${sourceRecordsIds[0]}`);
    });
  });

  describe('when action status is CREATED', () => {
    it('the value should be a hotlink', () => {
      const { container } = renderJobSummary();

      fireEvent.click(container.querySelector('[data-row-index="row-0"] [data-test-entity-name="instance"]'));

      expect(window.location.href).toContain(`/inventory/view/${instanceId}`);
    });
  });

  describe('when action status is UPDATED', () => {
    it('the value should be a hotlink', () => {
      const { container } = renderJobSummary();

      fireEvent.click(container.querySelector('[data-row-index="row-1"] [data-test-entity-name="instance"]'));

      expect(window.location.href).toContain(`/inventory/view/${instanceId}`);
    });
  });

  describe('when action status is MULTIPLE', () => {
    it('the value should be a text', () => {
      const { getByText } = renderJobSummary();

      expect(getByText('Multiple')).not.toHaveAttribute('href');
    });
  });

  describe('when action status is DISCARDED', () => {
    it('the value should be a text', () => {
      const { getByText } = renderJobSummary();

      expect(getByText('Discarded')).not.toHaveAttribute('href');
    });
  });
});
