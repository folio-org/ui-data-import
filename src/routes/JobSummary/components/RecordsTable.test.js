import React from 'react';
import { fireEvent } from '@testing-library/react';
import faker from 'faker';
import { noop } from 'lodash';
import { BrowserRouter } from 'react-router-dom';

import {
  buildMutator,
  buildResources
} from '@folio/stripes-data-transfer-components/test/helpers';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { RecordsTable } from './RecordsTable';

window.open = jest.fn();
window.open.mockReturnValue({ focus: jest.fn() });

const firstRecordJobExecutionId = faker.random.uuid();
const sourceRecordsIds = [
  faker.random.uuid(),
  faker.random.uuid(),
  faker.random.uuid(),
  faker.random.uuid(),
  faker.random.uuid(),
  faker.random.uuid(),
];
const instanceId = faker.random.uuid();
const authorityId = faker.random.uuid();

const jobLogEntriesResources = buildResources({
  resourceName: 'jobLogEntries',
  records: [{
    sourceRecordActionStatus: 'CREATED',
    sourceRecordType: 'MARC_BIBLIOGRAPHIC',
    instanceActionStatus: 'CREATED',
    authorityActionStatus: 'CREATED',
    jobExecutionId: firstRecordJobExecutionId,
    sourceRecordId: sourceRecordsIds[0],
    sourceRecordOrder: '0',
    sourceRecordTitle: 'Test item 1',
  }, {
    instanceActionStatus: 'UPDATED',
    authorityActionStatus: 'UPDATED',
    sourceRecordType: 'MARC_BIBLIOGRAPHIC',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: sourceRecordsIds[1],
    sourceRecordOrder: '1',
    sourceRecordTitle: 'Test item 2',
  }, {
    holdingsActionStatus: 'MULTIPLE',
    sourceRecordType: 'MARC_BIBLIOGRAPHIC',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: sourceRecordsIds[2],
    sourceRecordOrder: '2',
    sourceRecordTitle: 'Test item 3',
  }, {
    itemActionStatus: 'DISCARDED',
    sourceRecordType: 'MARC_BIBLIOGRAPHIC',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: sourceRecordsIds[3],
    sourceRecordOrder: '3',
    sourceRecordTitle: 'Test item 4',
    error: 'Error message',
  }, {
    sourceRecordActionStatus: 'CREATED',
    holdingsActionStatus: 'CREATED',
    holdingsRecordHridList: ['holdingsHrid1'],
    sourceRecordType: 'MARC_HOLDINGS',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: sourceRecordsIds[4],
    sourceRecordOrder: '4',
    sourceRecordTitle: 'Test item 5',
  }, {
    sourceRecordActionStatus: 'DISCARDED',
    holdingsActionStatus: 'DISCARDED',
    holdingsRecordHridList: ['holdingsHrid2'],
    sourceRecordType: 'MARC_HOLDINGS',
    jobExecutionId: faker.random.uuid(),
    sourceRecordId: sourceRecordsIds[5],
    sourceRecordOrder: '5',
    sourceRecordTitle: 'Test item 6',
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
    relatedAuthorityInfo: {
      actionStatus: 'CREATED',
      idList: [authorityId],
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
    relatedAuthorityInfo: {
      actionStatus: 'UPDATED',
      idList: [authorityId],
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
    relatedAuthorityInfo: {
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
    relatedAuthorityInfo: {
      actionStatus: 'DISCARDED',
      idList: [faker.random.uuid()],
    },
  }],
});
const resources = {
  ...jobLogEntriesResources,
  ...jobLogResources,
};
const mutator = buildMutator();
const source = {
  records: () => resources.jobLogEntries.records,
  pending: () => false,
  totalCount: () => resources.jobLogEntries.other.totalRecords,
  fetchMore: noop,
  fetchOffset: noop,
};

const renderRecordsTable = ({ isEdifactType = false }) => {
  const component = (
    <BrowserRouter>
      <RecordsTable
        isEdifactType={isEdifactType}
        resources={resources}
        mutator={mutator}
        source={source}
        resultCountIncrement={5}
        pageAmount={5}
      />
    </BrowserRouter>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('RecordsTable component', () => {
  it('should have proper columns', () => {
    const { getByText } = renderRecordsTable({});
    /*
     * Get "Holdings" and "Error" labels by query selector instead of by "getByText" because there are
     * "Holdings" / "Error" column labels and "Holdings" / "Error" messages in cells on the page
     */
    const holdingsColumn = document.querySelector('#list-column-holdingsstatus div[class^="mclHeaderInner"] > div');
    const errorColumn = document.querySelector('#list-column-error div[class^="mclHeaderInner"] > div');

    expect(getByText('Record')).toBeDefined();
    expect(getByText('Title')).toBeDefined();
    expect(getByText('SRS MARC')).toBeDefined();
    expect(getByText('Instance')).toBeDefined();
    expect(holdingsColumn.innerHTML).toEqual('Holdings');
    expect(getByText('Item')).toBeDefined();
    expect(getByText('Authority')).toBeDefined();
    expect(getByText('Order')).toBeDefined();
    expect(getByText('Invoice')).toBeDefined();
    expect(errorColumn.innerHTML).toEqual('Error');
  });

  describe('record order field', () => {
    describe('for EDIFACT data type', () => {
      it('should display order as it is', () => {
        const { container } = renderRecordsTable({ isEdifactType: true });

        const cells = container.querySelectorAll('[role="gridcell"]');
        const firstRowRecordOrder = cells[0].innerHTML;

        expect(firstRowRecordOrder).toEqual('0');
      });
    });

    describe('for MARC data type', () => {
      it('should display incremented order', () => {
        const { container } = renderRecordsTable({});

        const cells = container.querySelectorAll('[role="gridcell"]');
        const firstRowRecordOrder = cells[0].innerHTML;

        expect(firstRowRecordOrder).toEqual('1');
      });
    });
  });

  describe('when clicking on a record title', () => {
    it('should navigate to the log details screen', () => {
      const { getByText } = renderRecordsTable({});

      expect(getByText('Test item 1').href).toContain(`/data-import/log/${firstRecordJobExecutionId}/${sourceRecordsIds[0]}`);
    });
  });

  describe('when action status is CREATED', () => {
    it('the instance value should be a hotlink', () => {
      const { container } = renderRecordsTable({});

      fireEvent.click(container.querySelector('[data-row-index="row-0"] [data-test-entity-name="instance"]'));

      expect(window.location.href).toContain(`/inventory/view/${instanceId}`);
    });

    it('the authority value should be a hotlink', () => {
      const { container } = renderRecordsTable({});

      fireEvent.click(container.querySelector('[data-row-index="row-0"] [data-test-entity-name="authority"]'));

      expect(window.location.href).toContain(`/marc-authorities/authorities/${authorityId}`);
    });
  });

  describe('when action status is UPDATED', () => {
    it('the instance value should be a hotlink', () => {
      const { container } = renderRecordsTable({});

      fireEvent.click(container.querySelector('[data-row-index="row-1"] [data-test-entity-name="instance"]'));

      expect(window.location.href).toContain(`/inventory/view/${instanceId}`);
    });

    it('the authority value should be a hotlink', () => {
      const { container } = renderRecordsTable({});

      fireEvent.click(container.querySelector('[data-row-index="row-1"] [data-test-entity-name="authority"]'));

      expect(window.location.href).toContain(`/marc-authorities/authorities/${authorityId}`);
    });
  });

  describe('when action status is MULTIPLE', () => {
    it('the value should be a text', () => {
      const { getByText } = renderRecordsTable({});

      expect(getByText('Multiple')).not.toHaveAttribute('href');
    });
  });

  describe('when action status is DISCARDED', () => {
    it('the value should be a text', () => {
      const { getAllByText } = renderRecordsTable({});

      const discardedStatuses = getAllByText('Discarded');

      discardedStatuses.forEach(status => {
        expect(status).not.toHaveAttribute('href');
      });
    });
  });
});
