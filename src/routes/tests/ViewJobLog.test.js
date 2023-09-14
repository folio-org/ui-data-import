import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import faker from 'faker';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { ViewJobLog } from '../ViewJobLog';
import {
  useJobLogRecordsQuery,
  useSRSRecordQuery,
} from '../../hooks';

const mockJobLogData = {
  relatedInstanceInfo: { idList: [faker.random.uuid()] },
  relatedHoldingsInfo: [
    {
      id: 'holdingId1',
      hrid: 'holdingHrid1',
      permanentLocationId: 'permanentLocationId1',
      error: '',
    },
    {
      id: 'holdingId2',
      hrid: 'holdingHrid2',
      permanentLocationId: 'permanentLocationId2',
      error: '',
    },
  ],
  relatedItemInfo: [
    {
      id: '',
      hrid: '',
      holdingsId: '',
      error: 'Error message',
    },
    {
      id: 'itemId2',
      hrid: 'itemHrid2',
      holdingsId: 'holdingId1',
      error: '',
    },
  ],
  relatedPoLineInfo: {
    idList: [faker.random.uuid()],
    orderId: faker.random.uuid(),
  },
  relatedInvoiceInfo: { idList: [faker.random.uuid()] },
  relatedInvoiceLineInfo: {
    id: faker.random.uuid(),
    fullInvoiceLineNumber: '1024200-1',
  },
  relatedAuthorityInfo: { idList: [faker.random.uuid()] },
  sourceRecordOrder: 0,
  sourceRecordTitle: 'Test record title',
};
const mockSRSMARCBibMARCJSONData = {
  id: faker.random.uuid(),
  recordType: 'MARC',
};
const mockSRSMARCBibEDIFACTJSONData = {
  id: faker.random.uuid(),
  recordType: 'EDIFACT',
};
const mockInstanceJSONData = {
  id: faker.random.uuid(),
  source: 'MARC',
  title: 'Test instance title',
};
const mockHoldingsJSONData = [{
  id: 'holdingId1',
  title: 'Test holdings title 1',
}, {
  id: 'holdingId2',
  title: 'Test holdings title 2',
}];
const mockItemsJSONData = [{
  id: 'itemId2',
  title: 'Test item title',
}];
const mockOrderJSONData = {
  id: faker.random.uuid(),
  title: 'Test purchase order title',
};
const mockPoLineJSONData = {
  id: faker.random.uuid(),
  title: 'Test po line title',
};
const mockInvoiceJSONData = {
  id: faker.random.uuid(),
  title: 'Test invoice title',
};
const mockInvoiceLineJSONData = {
  id: faker.random.uuid(),
  title: 'Test invoice line title',
};
const mockAuthorityJSONData = {
  id: faker.random.uuid(),
  title: 'Test authority title',
};
const mockLocationsData = [{
  id: 'permanentLocationId1',
  code: 'permanentLocationCode1',
}, {
  id: 'permanentLocationId2',
  code: 'permanentLocationCode2',
}];

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useJobLogRecordsQuery: jest.fn(() => ({ isLoading: false, data: mockJobLogData })),
  useSRSRecordQuery: jest.fn(() => ({ isLoading: false, data: mockSRSMARCBibMARCJSONData })),
  useInventoryInstancesByIdQuery: jest.fn(() => ({ isLoading: false, data: [mockInstanceJSONData] })),
  useInventoryHoldingsByIdQuery: jest.fn(() => ({ isLoading: false, data: mockHoldingsJSONData })),
  useInventoryItemsByIdQuery: jest.fn(() => ({ isLoading: false, data: mockItemsJSONData })),
  useOrderByIdQuery: jest.fn(() => ({ isLoading: false, data: mockOrderJSONData })),
  usePOLinesByIdQuery: jest.fn(() => ({ isLoading: false, data: [mockPoLineJSONData] })),
  useInvoicesByIdQuery: jest.fn(() => ({ isLoading: false, data: [mockInvoiceJSONData] })),
  useInvoiceLineByIdQuery: jest.fn(() => ({ isLoading: false, data: mockInvoiceLineJSONData })),
  useAuthoritiesByIdQuery: jest.fn(() => ({ isLoading: false, data: [mockAuthorityJSONData] })),
  useLocationsQuery: jest.fn(() => ({ isLoading: false, data: mockLocationsData })),
}));

const renderViewJobLog = () => {
  const component = (
    <Router>
      <ViewJobLog />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('View job log page', () => {
  document.body.innerHTML =
    '<div>' +
    '  <header />' +
    '</div>';

  it('should be rendered with no axe errors', async () => {
    const { container } = renderViewJobLog();

    await runAxeTest({ rootNode: container });
  });

  describe('rendering header', () => {
    describe('when record type is MARC', () => {
      it('should display record title', () => {
        const { queryByText } = renderViewJobLog();

        expect(queryByText('Import Log for Record')).toBeDefined();
        expect(queryByText('1 (Test record title)')).toBeDefined();
      });

      it('"SRS MARC" tab should be active by default', () => {
        const { getByRole } = renderViewJobLog();
        const srsMarcBibTabElement = getByRole('tab', {
          name: 'SRS MARC',
          selected: true,
        });

        expect(srsMarcBibTabElement).toBeDefined();
      });
    });

    describe('when record type is EDIFACT', () => {
      it('should display record title', () => {
        useSRSRecordQuery
          .mockReturnValueOnce({ data: mockSRSMARCBibEDIFACTJSONData })
          .mockReturnValueOnce({ data: mockSRSMARCBibEDIFACTJSONData });

        const { queryByText } = renderViewJobLog();

        expect(queryByText('Import Log for Record')).toBeDefined();
        expect(queryByText('1024200-1 (Test record title)')).toBeDefined();
      });

      it('"Invoice" tab should be active by default', () => {
        useSRSRecordQuery
          .mockReturnValueOnce({ data: mockSRSMARCBibEDIFACTJSONData })
          .mockReturnValueOnce({ data: mockSRSMARCBibEDIFACTJSONData });

        const { getByRole } = renderViewJobLog();
        const invoiceTabElement = getByRole('tab', {
          name: 'Invoice',
          selected: true,
        });

        expect(invoiceTabElement).toBeDefined();
      });
    });

    it('should have "Show:" label', () => {
      const { getByText } = renderViewJobLog();

      expect(getByText('Show:')).toBeDefined();
    });

    it('should have 7 tabs', () => {
      const { getAllByRole } = renderViewJobLog();

      expect(getAllByRole('tab').length).toEqual(7);
    });
  });

  describe('rendering JSON screens', () => {
    describe('when log for SRS MARC has not loaded', () => {
      it('should render preloader component instead', () => {
        useJobLogRecordsQuery.mockReturnValueOnce({ isLoading: true });

        const { getByText } = renderViewJobLog({
          recordType: 'MARC',
          jobLogHasLoaded: false,
        });

        expect(getByText('Loading')).toBeDefined();
      });
    });

    describe('when log for SRS MARC has loaded', () => {
      it('should be rendered with no axe errors', async () => {
        const { container } = renderViewJobLog();

        await runAxeTest({ rootNode: container });
      });

      it('should display SRS MARC JSON details on the screen', () => {
        const { container } = renderViewJobLog();
        const codeElement = container.querySelector('code.info');

        expect(JSON.parse(codeElement.textContent)).toEqual(mockSRSMARCBibMARCJSONData);
      });

      describe('and Instance tag is active', () => {
        it('should display Instance JSON details on the screen', () => {
          const {
            container,
            getByText,
          } = renderViewJobLog();

          fireEvent.click(getByText('Instance'));
          const codeElement = container.querySelector('code.info');

          expect(JSON.parse(codeElement.textContent)).toEqual(mockInstanceJSONData);
        });
      });

      describe('and Holdings tag is active', () => {
        it('should display permanent location code above each holding', () => {
          const { getByText } = renderViewJobLog();

          fireEvent.click(getByText('Holdings'));

          expect(getByText('permanentLocationCode1')).toBeInTheDocument();
          expect(getByText('permanentLocationCode2')).toBeInTheDocument();
        });

        it('should display Holdings JSON details on the screen', () => {
          const {
            container,
            getByText,
          } = renderViewJobLog();

          fireEvent.click(getByText('Holdings'));
          const codeElements = container.querySelectorAll('code.info');

          [...codeElements].forEach((codeElement, i) => {
            expect(JSON.parse(codeElement.textContent)).toEqual(mockHoldingsJSONData[i]);
          });
        });
      });

      describe('and Item tag is active', () => {
        it('should display item hrid above the JSON details', () => {
          const { getByText } = renderViewJobLog();

          fireEvent.click(getByText('Item*'));

          expect(getByText('itemHrid2')).toBeInTheDocument();
        });

        it('should display Item JSON details on the screen', () => {
          const {
            container,
            getByText,
          } = renderViewJobLog();

          fireEvent.click(getByText('Item*'));
          const codeElement = container.querySelectorAll('code.info')[1];

          expect(JSON.parse(codeElement.textContent)).toEqual(mockItemsJSONData[0]);
        });
      });

      describe('and Authority tag is active', () => {
        it('should display Authority JSON details on the screen', () => {
          const {
            container,
            getByText,
          } = renderViewJobLog();

          fireEvent.click(getByText('Authority'));
          const codeElement = container.querySelector('code.info');

          expect(JSON.parse(codeElement.textContent)).toEqual(mockAuthorityJSONData);
        });
      });

      describe('and Order tag is active', () => {
        it('should display Order Line JSON details on the screen', () => {
          const { getByRole } = renderViewJobLog();
          const orderTabElement = getByRole('tab', { name: 'Order' });

          fireEvent.click(orderTabElement);
          const orderLineCodeElement = document.querySelectorAll('code.info')[0];

          expect(JSON.parse(orderLineCodeElement.textContent)).toEqual(mockPoLineJSONData);
        });

        it('should display Order JSON details on the screen', () => {
          const { getByRole } = renderViewJobLog();
          const orderTabElement = getByRole('tab', { name: 'Order' });

          fireEvent.click(orderTabElement);
          const orderLineCodeElement = document.querySelectorAll('code.info')[1];

          expect(JSON.parse(orderLineCodeElement.textContent)).toEqual(mockOrderJSONData);
        });
      });

      describe('and Invoice tag is active', () => {
        it('should display Invoice Line JSON details on the screen', () => {
          useSRSRecordQuery.mockReturnValueOnce({ data: mockSRSMARCBibEDIFACTJSONData });

          const { getByRole } = renderViewJobLog();
          const invoiceTabElement = getByRole('tab', { name: 'Invoice' });

          fireEvent.click(invoiceTabElement);
          const invoiceLineCodeElement = document.querySelectorAll('code.info')[0];

          expect(JSON.parse(invoiceLineCodeElement.textContent)).toEqual(mockInvoiceLineJSONData);
        });

        it('should display Invoice JSON details on the screen', () => {
          useSRSRecordQuery.mockReturnValueOnce({ data: mockSRSMARCBibEDIFACTJSONData });

          const { getByRole } = renderViewJobLog();
          const invoiceTabElement = getByRole('tab', { name: 'Invoice' });

          fireEvent.click(invoiceTabElement);
          const invoiceCodeElement = document.querySelectorAll('code.info')[1];

          expect(JSON.parse(invoiceCodeElement.textContent)).toEqual(mockInvoiceJSONData);
        });
      });
    });
  });

  describe('rendering error details', () => {
    it('should render a tab with an asterisk', () => {
      const { getByText } = renderViewJobLog();

      expect(getByText('Item*')).toBeDefined();
    });

    describe('when clicking on the tab with an error', () => {
      it('should show an error message', () => {
        const { getByText } = renderViewJobLog();

        fireEvent.click(getByText('Item*'));

        expect(getByText('Error message')).toBeDefined();
      });
    });
  });
});
