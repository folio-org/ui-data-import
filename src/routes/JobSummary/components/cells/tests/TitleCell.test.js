import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { TitleCell } from '../TitleCell';

const jobLogEntriesRecordsProp = [{ jobExecutionId: 'jobExecutionId' }];

const renderTitleCell = ({
  sourceRecordType,
  holdingsActionStatus,
  sourceRecordActionStatus,
}) => {
  const component = (
    <Router>
      <TitleCell
        sourceRecordType={sourceRecordType}
        holdingsActionStatus={holdingsActionStatus}
        sourceRecordActionStatus={sourceRecordActionStatus}
        sourceRecordTitle="Test title"
        sourceRecordId="sourceRecordId"
        jobLogEntriesRecords={jobLogEntriesRecordsProp}
        invoiceLineJournalRecordId="journalRecordId"
        isEdifactType
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('TitleCell component', () => {
  describe('when source record type is holdings', () => {
    const titleForHoldingsProps = {
      sourceRecordType: 'MARC_HOLDINGS',
      holdingsActionStatus: 'DISCARDED',
      sourceRecordActionStatus: 'DISCARDED',
    };

    it('should be rendered with no axe errors', async () => {
      const { container } = renderTitleCell(titleForHoldingsProps);

      await runAxeTest({ rootNode: container });
    });

    it('should render hotlink with text "Holdings"', () => {
      const { container } = renderTitleCell(titleForHoldingsProps);

      const titleHotlink = container.querySelector('[data-test-text-link="true"]');

      expect(titleHotlink.innerHTML).toContain('Holdings');
      expect(titleHotlink.href).toContain('/data-import/log/jobExecutionId/sourceRecordId?instanceLineId=journalRecordId');
    });
  });

  describe('when source record type is not holdings', () => {
    const titleForNotHoldingsProps = {
      sourceRecordType: 'INSTANCE',
      holdingsActionStatus: 'CREATED',
      sourceRecordActionStatus: 'CREATED',
    };

    it('should be rendered with no axe errors', async () => {
      const { container } = renderTitleCell(titleForNotHoldingsProps);

      await runAxeTest({ rootNode: container });
    });

    it('should render hotlink with title', () => {
      const { container } = renderTitleCell(titleForNotHoldingsProps);

      const titleHotlink = container.querySelector('[data-test-text-link="true"]');

      expect(titleHotlink.innerHTML).toContain('Test title');
      expect(titleHotlink.href).toContain('/data-import/log/jobExecutionId/sourceRecordId?instanceLineId=journalRecordId');
    });
  });
});
