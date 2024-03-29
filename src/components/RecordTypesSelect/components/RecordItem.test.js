import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { RecordItem } from './RecordItem';
import { MATCH_INCOMING_RECORD_TYPES } from '../../../utils';

const onClick = jest.fn();

const recordItemProps = (iconKey = null) => ({
  item: {
    type: 'HOLDINGS',
    captionId: 'ui-data-import.recordTypes.holdings',
    iconKey,
  },
});

const renderRecordItem = ({
  item,
  className = null,
  isEditable,
}) => {
  const component = (
    <RecordItem
      item={item}
      className={className}
      isEditable={isEditable}
      onClick={onClick}
      incomingRecordOptions={MATCH_INCOMING_RECORD_TYPES}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('RecordItem component', () => {
  afterEach(() => {
    onClick.mockClear();
  });

  describe('when button is initial', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderRecordItem({
        ...recordItemProps('holdings'),
        isEditable: true,
      });

      await runAxeTest({ rootNode: container });
    });

    it('should be rendered', () => {
      const { getByText } = renderRecordItem({
        ...recordItemProps('holdings'),
        isEditable: true,
      });

      expect(getByText('Holdings')).toBeDefined();
    });

    describe('when initial button has icon', () => {
      it('icon shoud be rendered', () => {
        const { container } = renderRecordItem({
          ...recordItemProps('holdings'),
          isEditable: true,
        });
        const icon = container.querySelector('.icon');

        expect(icon).toBeDefined();
      });
    });

    describe('when initial button has no icon', () => {
      it('icon shoud not be rendered', () => {
        const { container } = renderRecordItem({
          ...recordItemProps(),
          isEditable: true,
        });
        const icon = container.querySelector('.icon');

        expect(icon).toBeNull();
      });
    });

    describe('when clicking on initial button', () => {
      it('appropriate record type should be chosen', () => {
        const { getByText } = renderRecordItem({
          ...recordItemProps('holdings'),
          isEditable: true,
        });

        fireEvent.click(getByText('Holdings'));

        expect(onClick.mock.calls[0][0].type).toEqual('HOLDINGS');
      });
    });

    describe('when clicking on disabled initial button', () => {
      it('record should not be chosen', () => {
        const { getByText } = renderRecordItem({
          ...recordItemProps('holdings'),
          isEditable: false,
        });

        fireEvent.click(getByText('Holdings'));

        expect(onClick.mock.calls).toHaveLength(0);
      });
    });
  });

  describe('when button is dropdown', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderRecordItem({
        ...recordItemProps('holdings'),
        className: 'incomingRecord',
        isEditable: true,
      });

      await runAxeTest({ rootNode: container });
    });

    it('should be rendered', () => {
      const { getByText } = renderRecordItem({
        ...recordItemProps('holdings'),
        className: 'incomingRecord',
        isEditable: true,
      });

      expect(getByText('Holdings')).toBeDefined();
    });

    describe('when clicking on record', () => {
      it('dropdown menu should be shown', () => {
        const { getByText } = renderRecordItem({
          ...recordItemProps('holdings'),
          className: 'incomingRecord',
          isEditable: true,
        });

        fireEvent.click(getByText('Holdings'));

        expect(getByText('MARC Bibliographic')).toBeVisible();
        expect(getByText('Static value (submatch only)')).toBeVisible();
      });
    });

    describe('when clicking on record type', () => {
      it('appropriate record type should be chosen', () => {
        const { getByText } = renderRecordItem({
          ...recordItemProps('holdings'),
          className: 'incomingRecord',
          isEditable: true,
        });

        fireEvent.click(getByText('Static value (submatch only)'));

        expect(onClick.mock.calls[0][0].type).toEqual('STATIC_VALUE');
      });
    });
  });
});
