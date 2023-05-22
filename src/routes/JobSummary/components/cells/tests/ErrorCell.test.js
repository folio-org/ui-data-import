import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { ErrorCell } from '../ErrorCell';

const errorProp = 'test error';

const sortedItemDataProp = [
  [{
    actionStatus : 'CREATED',
    id : '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
    hrid : 'it00000000015',
    holdingsId : 'testHoldingsId',
    error : 'test error'
  }]
];

const renderErrorCell = ({ error = '', sortedItemData }) => {
  const component = (
    <ErrorCell
      error={error}
      sortedItemData={sortedItemData}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ErrorCell component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderErrorCell({ error: errorProp });

    await runAxeTest({ rootNode: container });
  });

  describe('when error was occured', () => {
    it('error message should be rendered', () => {
      const { getByText } = renderErrorCell({ error: errorProp });

      expect(getByText('Error')).toBeInTheDocument();
    });

    describe('when item has an error', () => {
      it('error message should be rendered', () => {
        const { getByText } = renderErrorCell({ sortedItemData: sortedItemDataProp });

        expect(getByText('Error')).toBeInTheDocument();
      });
    });
  });
});
