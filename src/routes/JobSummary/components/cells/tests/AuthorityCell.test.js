import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { AuthorityCell } from '../AuthorityCell';

const sortedItemData = [
  [{
    actionStatus: 'CREATED',
    id: '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
    hrid: 'it00000000015',
    holdingsId: 'testHoldingsId',
    error: '',
  }]
];

const renderAuthorityCell = (authorityActionStatus) => {
  const component = (
    <Router>
      <AuthorityCell
        relatedAuthorityInfo={{
          actionStatus: authorityActionStatus,
          idList: ['testAuthorityId'],
        }}
        sortedItemData={sortedItemData}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('AuthorityCell component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderAuthorityCell('CREATED');

    await runAxeTest({ rootNode: container });
  });

  describe('when authority was created', () => {
    it('should render hotlink', () => {
      const { container } = renderAuthorityCell('CREATED');
      const authorityHotlink = container.querySelector('[data-test-entity-name="authority"]');

      expect(authorityHotlink.href).toContain('/marc-authorities/authorities/testAuthorityId');
    });
  });

  describe('when authority was updated', () => {
    it('should render hotlink', () => {
      const { container } = renderAuthorityCell('UPDATED');
      const authorityHotlink = container.querySelector('[data-test-entity-name="authority"]');

      expect(authorityHotlink.href).toContain('/marc-authorities/authorities/testAuthorityId');
    });
  });

  describe('when authority is empty', () => {
    it('should render empty value', () => {
      const { getByText } = renderAuthorityCell();

      expect(getByText('-')).toBeDefined();
    });
  });
});
