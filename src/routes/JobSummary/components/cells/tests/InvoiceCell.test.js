import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { InvoiceCell } from '../InvoiceCell';

const jobLogRecords = [{
  sourceRecordId: 'testId',
  sourceRecordOrder: 0,
  invoiceActionStatus: 'CREATED',
  relatedInvoiceInfo : {
    idList : ['testInvoiceId'],
    hridList : []
  },
  relatedInvoiceLineInfo: {
    fullInvoiceLineNumber: 0,
    id: 'testInvoiceLineId',
    hridList : [],
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

const renderInvoiceCell = (invoiceActionStatus) => {
  const component = (
    <Router>
      <InvoiceCell
        invoiceActionStatus={invoiceActionStatus}
        sourceRecordId="testId"
        jobLogRecords={jobLogRecords}
        sortedItemData={sortedItemData}
        sourceRecordOrder={0}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('InvoiceCell component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderInvoiceCell('CREATED');

    await runAxeTest({ rootNode: container });
  });

  describe('when invoice was created', () => {
    it('hotlink should be rendered', () => {
      const { container } = renderInvoiceCell('CREATED');
      const invoiceHotlink = container.querySelector('[data-test-entity-name="invoice"]');

      expect(invoiceHotlink.href).toContain('/invoice/view/testInvoiceId/line/testInvoiceLineId/view');
    });
  });

  describe('when invoice was updated', () => {
    it('should render cell with text "Updated"', () => {
      const { getByText } = renderInvoiceCell('UPDATED');

      expect(getByText('Updated')).toBeInTheDocument();
    });
  });

  describe('when invoice is empty', () => {
    it('should render empty value', () => {
      const { getByText } = renderInvoiceCell();

      expect(getByText('-')).toBeDefined();
    });
  });
});
