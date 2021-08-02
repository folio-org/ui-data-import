import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { LogViewer } from './LogViewer';

const logViewerLogsProps = {
  logs: {
    0: [{
      label: 'srs-marc-bib label',
      logs: [{
        id: '0',
        name: 'test',
      }],
      errorBlockId: 'srs-marc-bib-error',
    }],
    1: [{
      label: 'instance label',
      error: 'test error',
      errorBlockId: 'instance-error',
    }],
    2: [{
      label: 'holdings label',
      logs: [{
        id: '2',
        name: 'test',
      }],
      errorBlockId: 'holdings-error',
    }],
    3: [{
      label: 'item label',
      logs: [{
        id: '3',
        name: 'test',
      }],
      errorBlockId: 'item-error',
    }],
    4: [{}],
    5: [{
      label: 'invoice label',
      logs: [{
        id: '5',
        name: 'test',
      }],
      errorBlockId: 'invoice-error',
    }, {
      label: 'invoice-line label',
      error: 'test error',
    }],
  },
};

const logViewerOtherProps = {
  language: 'langRAW',
  theme: 'stalker',
  toolbar: {
    visible: true,
    message: <span>test message</span>,
    showThemes: true,
    activeFilter: 0,
  },
};

const renderLogViewer = ({
  logs,
  language,
  theme,
  toolbar,
}) => {
  const component = (
    <LogViewer
      logs={logs}
      language={language}
      theme={theme}
      toolbar={toolbar}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('LogViewer', () => {
  it('should be rendered with default theme', () => {
    const { getByText } = renderLogViewer(logViewerLogsProps);
    const preElement = getByText('srs-marc-bib label');

    expect(preElement).toHaveClass('coy');
  });
  it('should be rendered', () => {
    const { getByText } = renderLogViewer({
      ...logViewerLogsProps,
      ...logViewerOtherProps,
    });

    expect(getByText('srs-marc-bib label')).toBeDefined();
  });

  describe('when there is no data', () => {
    it('should show no record message', () => {
      const { getByText } = renderLogViewer({
        ...logViewerLogsProps,
        ...logViewerOtherProps,
      });
      const instanceButton = getByText('Instance*').parentNode;

      fireEvent.click(instanceButton);

      expect(getByText('No record')).toBeDefined();
    });
  });

  describe('when there is an error in the logs', () => {
    it('an asterisk should be displayed next to the record type button name', () => {
      const { getByText } = renderLogViewer({
        ...logViewerLogsProps,
        ...logViewerOtherProps,
      });
      const instanceButtonWithError = getByText('Instance*');
      const invoiceButtonWithError = getByText('Invoice*');

      expect(instanceButtonWithError).toBeDefined();
      expect(invoiceButtonWithError).toBeDefined();
    });
  });

  describe('when clicking on button from button group', () => {
    describe('when clicking on Instance button', () => {
      it('Instance button should be active', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });

        const instanceButton = getByText('Instance*').parentNode;

        fireEvent.click(instanceButton);

        expect(instanceButton).toHaveClass('primary');
      });
    });

    describe('when clicking on SRS MARC Bib button', () => {
      it('SRS MARC Bib button should be active', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });
        const srsMARCBibButton = getByText('SRS MARC Bib').parentNode;

        fireEvent.click(srsMARCBibButton);

        expect(srsMARCBibButton).toHaveClass('primary');
      });
    });

    describe('when clicking on Holdings button', () => {
      it('Holdings button should be active', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });
        const holdingsButton = getByText('Holdings').parentNode;

        fireEvent.click(holdingsButton);

        expect(holdingsButton).toHaveClass('primary');
      });
    });

    describe('when clicking on Item button', () => {
      it('Item button should be active', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });
        const itemButton = getByText('Item').parentNode;

        fireEvent.click(itemButton);

        expect(itemButton).toHaveClass('primary');
      });
    });

    describe('when clicking on Order button', () => {
      it('Order button should be active', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });
        const orderButton = getByText('Order').parentNode;

        fireEvent.click(orderButton);

        expect(orderButton).toHaveClass('default');
      });
    });

    describe('when clicking on Invoice button', () => {
      it('Invoice button should be active', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });
        const invoiceButton = getByText('Invoice*').parentNode;

        fireEvent.click(invoiceButton);

        expect(invoiceButton).toHaveClass('primary');
      });
    });
  });

  describe('when change the theme', () => {
    it('should change value', () => {
      const {
        container,
        getByText,
      } = renderLogViewer({
        ...logViewerLogsProps,
        ...logViewerOtherProps,
      });
      const preElement = getByText('srs-marc-bib label');
      const selectControl = container.querySelector('.selectControl');

      fireEvent.change(selectControl, { target: { value: 'coy' } });

      expect(preElement).toHaveClass('coy');
    });
  });
});
