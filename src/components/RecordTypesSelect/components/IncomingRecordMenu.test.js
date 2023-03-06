import React from 'react';
import { noop } from 'lodash';
import { fireEvent } from '@testing-library/react';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { IncomingRecordMenu } from './IncomingRecordMenu';

expect.extend(toHaveNoViolations);

const onClick = jest.fn();

const renderIncomingRecordMenu = ({ open }) => {
  const component = (
    <IncomingRecordMenu
      open={open}
      onClick={onClick}
      onToggle={noop}
      keyHandler={noop}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('IncomingRecordMenu', () => {
  afterEach(() => {
    onClick.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderIncomingRecordMenu({ open: true });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  describe('when dropdown menu is closed', () => {
    it('record types should be invisible', () => {
      const { getByText } = renderIncomingRecordMenu({ open: false });

      expect(getByText('MARC Bibliographic')).not.toBeVisible();
      expect(getByText('MARC Authority')).not.toBeVisible();
      expect(getByText('Static value (submatch only)')).not.toBeVisible();
    });
  });

  describe('when dropdown menu is open', () => {
    it('record types should be visible', () => {
      const { getByText } = renderIncomingRecordMenu({ open: true });

      expect(getByText('MARC Bibliographic')).toBeVisible();
      expect(getByText('MARC Authority')).toBeVisible();
      expect(getByText('Static value (submatch only)')).toBeVisible();
    });
  });

  describe('when clicking on active option', () => {
    it('appropriate record type should be chosen', () => {
      const { getByText } = renderIncomingRecordMenu({ open: true });

      fireEvent.click(getByText('Static value (submatch only)'));

      expect(onClick.mock.calls[0][0].type).toEqual('STATIC_VALUE');
    });
  });

  describe('when clicking on existing record type', () => {
    it('existing record type should be chosen', () => {
      const { getByText } = renderIncomingRecordMenu({ open: true });

      fireEvent.click(getByText('Static value (submatch only)'));
      fireEvent.click(getByText('Static value (submatch only)'));

      expect(onClick.mock.calls[0][0].type).toEqual('STATIC_VALUE');
    });
  });
});
