import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { InstanceCell } from '../InstanceCell';

const renderInstanceCell = (instanceActionStatus) => {
  const component = (
    <Router>
      <InstanceCell
        relatedInstanceInfo={{
          actionStatus: instanceActionStatus,
          idList: ['testInstanceId'],
        }}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('InstanceCell component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderInstanceCell('CREATED');

    await runAxeTest({ rootNode: container });
  });

  describe('when instance was created', () => {
    it('should render hotlink', () => {
      const { container } = renderInstanceCell('CREATED');
      const instanceHotlink = container.querySelector('[data-test-entity-name="instance"]');

      expect(instanceHotlink.href).toContain('/inventory/view/testInstanceId');
    });
  });

  describe('when instance was updated', () => {
    it('should render hotlink', () => {
      const { container } = renderInstanceCell('UPDATED');
      const instanceHotlink = container.querySelector('[data-test-entity-name="instance"]');

      expect(instanceHotlink.href).toContain('/inventory/view/testInstanceId');
    });
  });

  describe('when instance is empty', () => {
    it('should render empty value', () => {
      const { getByText } = renderInstanceCell();

      expect(getByText('-')).toBeDefined();
    });
  });
});
