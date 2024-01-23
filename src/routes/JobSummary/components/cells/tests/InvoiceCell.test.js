import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { InvoiceCell } from '../InvoiceCell';

const sortedItemData = [
  [{
    actionStatu: 'CREATED',
    id: '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
    hrid: 'it00000000015',
    holdingsId: 'testHoldingsId',
    error: '',
  }]
];

const renderInvoiceCell = (invoiceActionStatus) => {
  const component = (
    <Router>
      <InvoiceCell
        relatedInvoiceInfo={{
          actionStatus: invoiceActionStatus,
          idList: ['testInvoiceId'],
        }}
        relatedInvoiceLineInfo={{ id: 'testInvoiceLineId' }}
        sortedItemData={sortedItemData}
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
    it('should render hotlink', () => {
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
