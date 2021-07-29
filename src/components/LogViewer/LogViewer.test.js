import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { LogViewer } from './LogViewer';

const logViewerLogsProps = {
  logs: {
    0: [{
      label: 'test label',
      logs: [{ name: 'test' }],
      errorBlockId: 'srs-marc-bib-error',
    }],
    1: [{
      label: 'test label',
      error: jest.fn(),
    }],
    2: [{
      label: 'test label',
      logs: [{ name: 'test' }],
      errorBlockId: 'holdings-error',
    }],
    3: [{
      label: 'test label',
      logs: [{ name: 'test' }],
      errorBlockId: 'item-error',
    }],
    4: [{}],
    5: [{
      label: 'test label',
      logs: [{ name: 'test' }],
      errorBlockId: 'invoice-error',
    }, {
      label: 'test label',
      logs: [],
      errorBlockId: 'invoice-line-error',
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
    const preElement = getByText('test label');

    expect(preElement).toHaveClass('coy');
  });
  it('should be rendered', () => {
    const { getByText } = renderLogViewer({
      ...logViewerLogsProps,
      ...logViewerOtherProps,
    });

    expect(getByText('test label')).toBeDefined();
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

  describe('when click on button from button group', () => {
    describe('when click on Instance button', () => {
      it('should be chosen as filter', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });

        const instanceButton = getByText('Instance*').parentNode;

        fireEvent.click(instanceButton);

        expect(instanceButton).toHaveClass('primary');
      });
    });

    describe('when click on SRS MARC Bib button', () => {
      it('should be chosen as filter', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });
        const srsMARCBibButton = getByText('SRS MARC Bib').parentNode;

        fireEvent.click(srsMARCBibButton);

        expect(srsMARCBibButton).toHaveClass('primary');
      });
    });

    describe('when click on Holdings button', () => {
      it('should be chosen as filter', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });
        const holdingsButton = getByText('Holdings').parentNode;

        fireEvent.click(holdingsButton);

        expect(holdingsButton).toHaveClass('primary');
      });
    });

    describe('when click on Item button', () => {
      it('should be chosen as filter', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });
        const itemButton = getByText('Item').parentNode;

        fireEvent.click(itemButton);

        expect(itemButton).toHaveClass('primary');
      });
    });

    describe('when click on Order button', () => {
      it('should not be chosen as filter', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });
        const orderButton = getByText('Order').parentNode;

        fireEvent.click(orderButton);

        expect(orderButton).toHaveClass('default');
      });
    });

    describe('when click on Invoice button', () => {
      it('should be chosen as filter', () => {
        const { getByText } = renderLogViewer({
          ...logViewerLogsProps,
          ...logViewerOtherProps,
        });
        const invoiceButton = getByText('Invoice').parentNode;

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
      const preElement = getByText('test label');
      const selectControl = container.querySelector('.selectControl');

      fireEvent.change(selectControl, { target: { value: 'coy' } });

      expect(preElement).toHaveClass('coy');
    });
  });
});
