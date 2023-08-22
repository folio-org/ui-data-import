import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';
import faker from 'faker';

import '../../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { AuthorityCell } from '../AuthorityCell';

const jobLogRecords = [{
  sourceRecordId: 'testId',
  sourceRecordOrder: 0,
  sourceRecordTitle: 'Test item 1',
  relatedInstanceInfo: {
    actionStatus: 'CREATED',
    idList: [faker.random.uuid()],
  },
  relatedHoldingsInfo: [{
    actionStatus: 'CREATED',
    id: 'testHoldingsId',
    permanentLocationId: faker.random.uuid(),
    hrid: 'ho00000000017',
    error: '',
  }],
  relatedItemInfo: [{
    actionStatus: 'CREATED',
    id: '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
    hrid: 'it00000000015',
    holdingsId: 'testHoldingsId',
    error: '',
  }],
  relatedAuthorityInfo: {
    actionStatus: 'CREATED',
    idList: ['testAuthorityId'],
  },
  relatedPoLineInfo: {
    actionStatus: 'CREATED',
    idList: [faker.random.uuid()],
  },
}];

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
        authorityActionStatus={authorityActionStatus}
        sourceRecordId="testId"
        jobLogRecords={jobLogRecords}
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
