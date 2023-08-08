import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { HoldingsCell } from '../HoldingsCell';

const locationsProp = [{
  id: 'testLocationId',
  name: 'Annex',
  code: 'KU/CC/DI/A',
}];

const holdingsInfoProp = (actionStatus = 'CREATED') => [{
  actionStatus,
  id: 'testHoldingsId',
  permanentLocationId: 'testLocationId',
  hrid: 'ho00000000017',
  error: '',
}];

const itemInfo = [{
  actionStatus: 'CREATED',
  id: '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
  hrid: 'it00000000015',
  holdingsId: 'testHoldingsId',
  error: '',
}];

const renderHoldingsCell = (holdingsInfo) => {
  const component = (
    <Router>
      <HoldingsCell
        holdingsInfo={holdingsInfo}
        instanceId="testInstanceId"
        itemInfo={itemInfo}
        locations={locationsProp}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('HoldingsCell component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderHoldingsCell(holdingsInfoProp());

    await runAxeTest({ rootNode: container });
  });

  describe('when holdings was created', () => {
    it('should render hotlink and location', () => {
      const {
        container,
        getByText,
      } = renderHoldingsCell(holdingsInfoProp());
      const holdingsHotlink = container.querySelector('[data-test-entity-name="holdings"]');

      expect(holdingsHotlink.href).toContain('/inventory/view/testInstanceId/testHoldingsId');
      expect(getByText('(KU/CC/DI/A)')).toBeInTheDocument();
    });
  });

  describe('when holdings was updated', () => {
    it('should render hotlink and location', () => {
      const {
        container,
        getByText,
      } = renderHoldingsCell(holdingsInfoProp('UPDATED'));
      const holdingsHotlink = container.querySelector('[data-test-entity-name="holdings"]');

      expect(holdingsHotlink.href).toContain('/inventory/view/testInstanceId/testHoldingsId');
      expect(getByText('(KU/CC/DI/A)')).toBeInTheDocument();
    });
  });

  describe('when holdings is empty', () => {
    it('should render empty value', () => {
      const { getByText } = renderHoldingsCell(holdingsInfoProp(null));

      expect(getByText('-')).toBeDefined();
    });
  });
});
