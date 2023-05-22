import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';
import faker from 'faker';

import '../../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { OrderCell } from '../OrderCell';

const jobLogRecords = [{
  sourceRecordId: 'testId',
  sourceRecordOrder: 0,
  sourceRecordTitle: 'Test item 1',
  relatedInstanceInfo: {
    actionStatus: 'CREATED',
    idList: [faker.random.uuid()],
  },
  relatedHoldingsInfo: [{
    actionStatus : 'CREATED',
    id : 'testHoldingsId',
    permanentLocationId: faker.random.uuid(),
    hrid : 'ho00000000017',
    error : ''
  }],
  relatedItemInfo: [{
    actionStatus : 'CREATED',
    id : '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
    hrid : 'it00000000015',
    holdingsId : 'testHoldingsId',
    error : ''
  }],
  relatedPoLineInfo: {
    actionStatus: 'CREATED',
    idList: ['testPOLineId'],
  },
}];

const sortedItemData = [
  [{
    actionStatus : 'CREATED',
    id : '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
    hrid : 'it00000000015',
    holdingsId : 'testHoldingsId',
    error : ''
  }]
];

const renderOrderCell = (poLineActionStatus) => {
  const component = (
    <Router>
      <OrderCell
        poLineActionStatus={poLineActionStatus}
        sourceRecordId="testId"
        jobLogRecords={jobLogRecords}
        sortedItemData={sortedItemData}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('OrderCell component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderOrderCell('CREATED');

    await runAxeTest({ rootNode: container });
  });

  describe('when order was created', () => {
    it('hotlink should be rendered', () => {
      const { container } = renderOrderCell('CREATED');
      const orderHotlink = container.querySelector('[data-test-entity-name="order"]');

      expect(orderHotlink.href).toContain('/orders/lines/view/testPOLineId');
    });
  });

  describe('when order was updated', () => {
    it('should render cell with text "Updated"', () => {
      const { getByText } = renderOrderCell('UPDATED');

      expect(getByText('Updated')).toBeInTheDocument();
    });
  });

  describe('when order is empty', () => {
    it('should render empty value', () => {
      const { getByText } = renderOrderCell();

      expect(getByText('-')).toBeDefined();
    });
  });
});
