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

const SRSMARCBibMARCJSONData = {
  id: faker.random.uuid(),
  recordType: 'MARC',
};
const SRSMARCBibEDIFACTJSONData = {
  id: faker.random.uuid(),
  recordType: 'EDIFACT',
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
const authorityJSONData = {
  id: faker.random.uuid(),
  title: 'Test authority title',
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
    relatedPoLineInfo: { idList: [faker.random.uuid()] },
    relatedInvoiceInfo: { idList: [faker.random.uuid()] },
    relatedInvoiceLineInfo: {
      id: faker.random.uuid(),
      fullInvoiceLineNumber: '1024200-1',
    },
    relatedAuthorityInfo: { idList: [faker.random.uuid()] },
    sourceRecordOrder: 0,
    sourceRecordTitle: 'Test record title',
  }],
  hasLoaded,
});
const srsMarcBibResources = recordType => buildResources({
  resourceName: 'srsMarcBib',
  records: [recordType === 'MARC' ? SRSMARCBibMARCJSONData : SRSMARCBibEDIFACTJSONData],
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
const authoritiesResources = buildResources({
  resourceName: 'authorities',
  records: [authorityJSONData],
});

const getResources = ({
  recordType,
  jobLogHasLoaded,
}) => ({
  ...jobLogResources(jobLogHasLoaded),
  ...srsMarcBibResources(recordType),
  ...instancesResources,
  ...holdingsResources,
  ...itemsResources,
  ...invoiceResources,
  ...invoiceLineResources,
  ...authoritiesResources,
});

const mutator = buildMutator({
  instances: { GET: jest.fn() },
  holdings: { GET: jest.fn() },
  items: { GET: jest.fn() },
  invoice: { GET: jest.fn() },
  invoiceLine: { GET: jest.fn() },
  authorities: { GET: jest.fn() },
});

const getViewJobLogComponent = ({
  recordType,
  jobLogHasLoaded = true,
}) => (
  <Harness translations={translationsProperties}>
    <Router>
      <ViewJobLog
        resources={getResources({
          recordType,
          jobLogHasLoaded,
        })}
        mutator={mutator}
      />
    </Router>
  </Harness>
);

const renderViewJobLog = ({
  recordType,
  jobLogHasLoaded,
}) => {
  return render(getViewJobLogComponent({
    recordType,
    jobLogHasLoaded,
  }));
};

describe('View job log page', () => {
  document.body.innerHTML =
    '<div>' +
    '  <header />' +
    '</div>';

  describe('when component is updated', () => {
    it('should get JSON data for each record type', () => {
      const { rerender } = renderViewJobLog({
        recordType: 'MARC',
        jobLogHasLoaded: false,
      });

      rerender(getViewJobLogComponent({ recordType: 'MARC' }));

      expect(mutator.instances.GET).toHaveBeenCalled();
      expect(mutator.holdings.GET).toHaveBeenCalled();
      expect(mutator.items.GET).toHaveBeenCalled();
      expect(mutator.invoice.GET).toHaveBeenCalled();
      expect(mutator.invoiceLine.GET).toHaveBeenCalled();
      expect(mutator.authorities.GET).toHaveBeenCalled();
    });
  });

  describe('rendering header', () => {
    describe('when record type is MARC', () => {
      it('should display record title', () => {
        const { queryByText } = renderViewJobLog({ recordType: 'MARC' });

        expect(queryByText('Import Log for Record')).toBeDefined();
        expect(queryByText('1 (Test record title)')).toBeDefined();
      });

      it('"SRS MARC" tab should be active by default', () => {
        const { getByRole } = renderViewJobLog({ recordType: 'MARC' });
        const srsMarcBibTabElement = getByRole('tab', {
          name: 'SRS MARC',
          selected: true,
        });

        expect(srsMarcBibTabElement).toBeDefined();
      });
    });

    describe('when record type is EDIFACT', () => {
      it('should display record title', () => {
        const { queryByText } = renderViewJobLog({ recordType: 'EDIFACT' });

        expect(queryByText('Import Log for Record')).toBeDefined();
        expect(queryByText('1024200-1 (Test record title)')).toBeDefined();
      });

      it('"Invoice" tab should be active by default', () => {
        const { getByRole } = renderViewJobLog({ recordType: 'EDIFACT' });
        const invoiceTabElement = getByRole('tab', {
          name: 'Invoice',
          selected: true,
        });

        expect(invoiceTabElement).toBeDefined();
      });
    });

    it('should have "Show:" label', () => {
      const { getByText } = renderViewJobLog({ recordType: 'MARC' });

      expect(getByText('Show:')).toBeDefined();
    });

    it('should have 7 tabs', () => {
      const { getAllByRole } = renderViewJobLog({ recordType: 'MARC' });

      expect(getAllByRole('tab').length).toEqual(7);
    });
  });

  describe('rendering JSON screens', () => {
    describe('when log for SRS MARC has not loaded', () => {
      it('should render preloader component instead', () => {
        const { getByText } = renderViewJobLog({
          recordType: 'MARC',
          jobLogHasLoaded: false,
        });

        expect(getByText('Loading')).toBeDefined();
      });
    });

    describe('when log for SRS MARC has loaded', () => {
      it('should display SRS MARC JSON details on the screen', () => {
        const { container } = renderViewJobLog({ recordType: 'MARC' });
        const codeElement = container.querySelector('code.info');

        expect(JSON.parse(codeElement.textContent)).toEqual(SRSMARCBibMARCJSONData);
      });

      describe('and Instance tag is active', () => {
        it('should display Instance JSON details on the screen', () => {
          const {
            container,
            getByText,
          } = renderViewJobLog({ recordType: 'MARC' });

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
          } = renderViewJobLog({ recordType: 'MARC' });

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
          } = renderViewJobLog({ recordType: 'MARC' });

          fireEvent.click(getByText('Item*'));
          const codeElement = container.querySelector('code.info');

          expect(JSON.parse(codeElement.textContent)).toEqual(itemsJSONData);
        });
      });

      describe('and Authority tag is active', () => {
        it('should display Authority JSON details on the screen', () => {
          const {
            container,
            getByText,
          } = renderViewJobLog({ recordType: 'MARC' });

          fireEvent.click(getByText('Authority'));
          const codeElement = container.querySelector('code.info');

          expect(JSON.parse(codeElement.textContent)).toEqual(authorityJSONData);
        });
      });

      describe('and Invoice tag is active', () => {
        it('should display Invoice Line JSON details on the screen', () => {
          const { getByRole } = renderViewJobLog({ recordType: 'EDIFACT' });
          const invoiceTabElement = getByRole('tab', { name: 'Invoice' });

          fireEvent.click(invoiceTabElement);
          const invoiceLineCodeElement = document.querySelectorAll('code.info')[0];

          expect(JSON.parse(invoiceLineCodeElement.textContent)).toEqual(invoiceLineJSONData);
        });

        it('should display Invoice JSON details on the screen', () => {
          const { getByRole } = renderViewJobLog({ recordType: 'EDIFACT' });
          const invoiceTabElement = getByRole('tab', { name: 'Invoice' });

          fireEvent.click(invoiceTabElement);
          const invoiceCodeElement = document.querySelectorAll('code.info')[1];

          expect(JSON.parse(invoiceCodeElement.textContent)).toEqual(invoiceJSONData);
        });
      });
    });
  });

  describe('rendering error details', () => {
    it('should render a tab with an asterisk', () => {
      const { getByText } = renderViewJobLog({ recordType: 'MARC' });

      expect(getByText('Item*')).toBeDefined();
    });

    describe('when clicking on the tab with an error', () => {
      it('should show an error message', () => {
        const { getByText } = renderViewJobLog({ recordType: 'MARC' });

        fireEvent.click(getByText('Item*'));

        expect(getByText('Error message')).toBeDefined();
      });
    });
  });
});
