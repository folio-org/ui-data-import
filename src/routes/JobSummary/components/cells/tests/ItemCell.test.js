import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { ItemCell } from '../ItemCell';

const sortedItemDataProp = actionStatus => [
  [{
    actionStatus,
    id: 'testItemId',
    hrid: 'it00000000015',
    holdingsId: 'testHoldingsId',
    error: '',
  }]
];

const renderItemCell = sortedItemData => {
  const component = (
    <Router>
      <ItemCell
        sortedItemData={sortedItemData}
        instanceId="testInstanceId"
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ItemCell component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderItemCell(sortedItemDataProp('CREATED'));

    await runAxeTest({ rootNode: container });
  });

  describe('when item was created', () => {
    it('should render hotlink and hrid', () => {
      const {
        container,
        getByText,
      } = renderItemCell(sortedItemDataProp('CREATED'));
      const itemHotlink = container.querySelector('[data-test-entity-name="item"]');

      expect(itemHotlink.href).toContain('/inventory/view/testInstanceId/testHoldingsId/testItemId');
      expect(getByText('(it00000000015)')).toBeInTheDocument();
    });
  });

  describe('when item was updated', () => {
    it('should render hotlink and hrid', () => {
      const {
        container,
        getByText,
      } = renderItemCell(sortedItemDataProp('UPDATED'));
      const itemHotlink = container.querySelector('[data-test-entity-name="item"]');

      expect(itemHotlink.href).toContain('/inventory/view/testInstanceId/testHoldingsId/testItemId');
      expect(getByText('(it00000000015)')).toBeInTheDocument();
    });
  });

  describe('when item is empty', () => {
    it('should render empty value', () => {
      const { getByText } = renderItemCell(sortedItemDataProp(null));

      expect(getByText('-')).toBeDefined();
    });
  });
});
