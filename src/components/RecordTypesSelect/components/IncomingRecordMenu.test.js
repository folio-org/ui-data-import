import React from 'react';
import { noop } from 'lodash';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { IncomingRecordMenu } from './IncomingRecordMenu';
import { MATCH_INCOMING_RECORD_TYPES } from '../../../utils';

const onClick = jest.fn();

const renderIncomingRecordMenu = props => {
  const component = (
    <IncomingRecordMenu
      onClick={onClick}
      onToggle={noop}
      keyHandler={noop}
      incomingRecordOptions={MATCH_INCOMING_RECORD_TYPES}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('IncomingRecordMenu component', () => {
  afterEach(() => {
    onClick.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderIncomingRecordMenu({ open: true });

    await runAxeTest({ rootNode: container });
  });

  describe('when dropdown menu is closed', () => {
    it('record types should be invisible', () => {
      const { getByText } = renderIncomingRecordMenu({ open: false });

      expect(getByText('MARC Bibliographic')).not.toBeVisible();
      expect(getByText('Static value (submatch only)')).not.toBeVisible();
    });
  });

  describe('when dropdown menu is open', () => {
    describe('when exisiting record type is "INSTANCE"', () => {
      it('should render "MARC Bibliographic" and "Static value" options', () => {
        const { getByText } = renderIncomingRecordMenu({ open: true, existingRecordType: 'INSTANCE' });

        expect(getByText('MARC Bibliographic')).toBeVisible();
        expect(getByText('Static value (submatch only)')).toBeVisible();
      });
    });

    describe('when exisiting record type is "HOLDINGS"', () => {
      it('should render "MARC Bibliographic", "MARC Authority" and "Static value" options', () => {
        const { getByText } = renderIncomingRecordMenu({ open: true, existingRecordType: 'HOLDINGS' });

        expect(getByText('MARC Bibliographic')).toBeVisible();
        expect(getByText('MARC Authority')).toBeVisible();
        expect(getByText('Static value (submatch only)')).toBeVisible();
      });
    });

    describe('when exisiting record type is "ITEM"', () => {
      it('should render "MARC Bibliographic", "MARC Authority" and "Static value" options', () => {
        const { getByText } = renderIncomingRecordMenu({ open: true, existingRecordType: 'ITEM' });

        expect(getByText('MARC Bibliographic')).toBeVisible();
        expect(getByText('MARC Authority')).toBeVisible();
        expect(getByText('Static value (submatch only)')).toBeVisible();
      });
    });

    describe('when exisiting record type is "MARC_BIBLIOGRAPHIC"', () => {
      it('should render "MARC Bibliographic", "MARC Authority" and "Static value" options', () => {
        const { getByText } = renderIncomingRecordMenu({ open: true, existingRecordType: 'MARC_BIBLIOGRAPHIC' });

        expect(getByText('MARC Bibliographic')).toBeVisible();
        expect(getByText('MARC Authority')).toBeVisible();
        expect(getByText('Static value (submatch only)')).toBeVisible();
      });
    });

    describe('when exisiting record type is "MARC_AUTHORITY"', () => {
      it('should render "MARC Bibliographic", "MARC Authority" and "Static value" options', () => {
        const { getByText } = renderIncomingRecordMenu({ open: true, existingRecordType: 'MARC_AUTHORITY' });

        expect(getByText('MARC Bibliographic')).toBeVisible();
        expect(getByText('MARC Authority')).toBeVisible();
        expect(getByText('Static value (submatch only)')).toBeVisible();
      });
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
