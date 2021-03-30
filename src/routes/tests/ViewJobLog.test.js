import React from 'react';
import {
  fireEvent,
  render,
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import faker from 'faker';

import {
  buildResources,
  buildMutator,
  Harness,
} from '@folio/stripes-data-transfer-components/test/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { ViewJobLog } from '../ViewJobLog';

const SRSMARCBibJSONData = {
  id: faker.random.uuid(),
  recordType: 'MARC',
};
const instanceJSONData = {
  id: faker.random.uuid(),
  source: 'MARC',
  title: 'Test instance title',
};
const holdingsJSONData = {
  id: faker.random.uuid(),
  title: 'Test holdings title',
};
const itemsJSONData = {
  id: faker.random.uuid(),
  title: 'Test item title',
};
const invoiceJSONData = {
  id: faker.random.uuid(),
  title: 'Test invoice title',
};
const invoiceLineJSONData = {
  id: faker.random.uuid(),
  title: 'Test invoice line title',
};

const jobLogResources = hasLoaded => buildResources({
  resourceName: 'jobLog',
  records: [{
    relatedInstanceInfo: { idList: [faker.random.uuid()] },
    relatedHoldingsInfo: { idList: [faker.random.uuid()] },
    relatedItemInfo: {
      error: 'Error message',
      idList: [faker.random.uuid()],
    },
    relatedOrderInfo: { idList: [faker.random.uuid()] },
    relatedInvoiceInfo: { idList: [faker.random.uuid()] },
    relatedInvoiceLineInfo: { fullInvoiceLineNumber: '1' },
    sourceRecordOrder: 0,
    sourceRecordTitle: 'Test record title',
  }],
  hasLoaded,
});
const srsMarcBibResources = buildResources({
  resourceName: 'srsMarcBib',
  records: [SRSMARCBibJSONData],
});
const instancesResources = buildResources({
  resourceName: 'instances',
  records: [instanceJSONData],
});
const holdingsResources = buildResources({
  resourceName: 'holdings',
  records: [holdingsJSONData],
});
const itemsResources = buildResources({
  resourceName: 'items',
  records: [itemsJSONData],
});
const invoiceResources = buildResources({
  resourceName: 'invoice',
  records: [invoiceJSONData],
});
const invoiceLineResources = buildResources({
  resourceName: 'invoiceLine',
  records: [invoiceLineJSONData],
});

const getResources = jobLogHasLoaded => ({
  ...jobLogResources(jobLogHasLoaded),
  ...srsMarcBibResources,
  ...instancesResources,
  ...holdingsResources,
  ...itemsResources,
  ...invoiceResources,
  ...invoiceLineResources,
});

const mutator = buildMutator({
  instances: { GET: jest.fn() },
  holdings: { GET: jest.fn() },
  items: { GET: jest.fn() },
  invoice: { GET: jest.fn() },
  invoiceLine: { GET: jest.fn() },
});

const getViewJobLogComponent = (jobLogHasLoaded = true) => (
  <Harness translations={translationsProperties}>
    <Router>
      <ViewJobLog
        resources={getResources(jobLogHasLoaded)}
        mutator={mutator}
      />
    </Router>
  </Harness>
);

const renderViewJobLog = jobLogHasLoaded => {
  return render(getViewJobLogComponent(jobLogHasLoaded));
};

describe('View job log page', () => {
  document.body.innerHTML =
    '<div>' +
    '  <header />' +
    '</div>';

  describe('when component is updated', () => {
    it('should get JSON data for each record type', () => {
      const { rerender } = renderViewJobLog(false);

      rerender(getViewJobLogComponent());

      expect(mutator.instances.GET).toHaveBeenCalled();
      expect(mutator.holdings.GET).toHaveBeenCalled();
      expect(mutator.items.GET).toHaveBeenCalled();
      expect(mutator.invoice.GET).toHaveBeenCalled();
      expect(mutator.invoiceLine.GET).toHaveBeenCalled();
    });
  });

  describe('rendering header', () => {
    it('should display record title', () => {
      const { getByText } = renderViewJobLog();

      expect(getByText('Import Log for Record')).toBeDefined();
      expect(getByText('1 (Test record title)')).toBeDefined();
    });

    it('should have "Show:" label', () => {
      const { getByText } = renderViewJobLog();

      expect(getByText('Show:')).toBeDefined();
    });

    it('should have 6 tabs', () => {
      const { getAllByRole } = renderViewJobLog();

      expect(getAllByRole('tab').length).toEqual(6);
    });

    it('"SRS MARC Bib" tab should be active by default', () => {
      const { getByRole } = renderViewJobLog();
      const srsMarcBibTabElement = getByRole('tab', {
        name: 'SRS MARC Bib',
        selected: true,
      });

      expect(srsMarcBibTabElement).toBeDefined();
    });
  });

  describe('rendering JSON screens', () => {
    describe('when log for SRS MARC Bib has not loaded', () => {
      it('should render preloader component instead', () => {
        const { getByText } = renderViewJobLog(false);

        expect(getByText('Loading')).toBeDefined();
      });
    });

    describe('when log for SRS MARC Bib has loaded', () => {
      it('should display SRS MARC Bib JSON details on the screen', () => {
        const { container } = renderViewJobLog();
        const codeElement = container.querySelector('code.info');

        expect(JSON.parse(codeElement.textContent)).toEqual(SRSMARCBibJSONData);
      });

      describe('and Instance tag is active', () => {
        it('should display Instance JSON details on the screen', () => {
          const {
            container,
            getByText,
          } = renderViewJobLog();

          fireEvent.click(getByText('Instance'));
          const codeElement = container.querySelector('code.info');

          expect(JSON.parse(codeElement.textContent)).toEqual(instanceJSONData);
        });
      });

      describe('and Holdings tag is active', () => {
        it('should display Holdings JSON details on the screen', () => {
          const {
            container,
            getByText,
          } = renderViewJobLog();

          fireEvent.click(getByText('Holdings'));
          const codeElement = container.querySelector('code.info');

          expect(JSON.parse(codeElement.textContent)).toEqual(holdingsJSONData);
        });
      });

      describe('and Item tag is active', () => {
        it('should display Item JSON details on the screen', () => {
          const {
            container,
            getByText,
          } = renderViewJobLog();

          fireEvent.click(getByText('Item*'));
          const codeElement = container.querySelector('code.info');

          expect(JSON.parse(codeElement.textContent)).toEqual(itemsJSONData);
        });
      });

      describe('and Invoice tag is active', () => {
        it('should display Invoice JSON details on the screen', () => {
          const {
            container,
            getByText,
          } = renderViewJobLog();

          fireEvent.click(getByText('Invoice*'));
          const invoiceLineCodeElement = container.querySelectorAll('code.info')[0];
          const invoiceCodeElement = container.querySelectorAll('code.info')[1];

          expect(JSON.parse(invoiceLineCodeElement.textContent)).toEqual(invoiceLineJSONData);

          expect(JSON.parse(invoiceCodeElement.textContent)).toEqual(invoiceJSONData);
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
