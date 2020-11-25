import React from 'react';
import {
  render,
  fireEvent,
} from '@testing-library/react';

import '../../../test/jest/__mock__';

import { menuTemplate } from './menuTemplate';

jest.mock('./ItemTemplates', () => ({
  LinkTo: () => <button type="button">LinkTo</button>,
  Default: ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
    >
      Default
    </button>
  ),
  GroupAction: () => <button type="button">GroupAction</button>,
}));

const entity = {
  props: {
    ENTITY_KEY: 'test entity',
    location: { pathname: '/test-url' },
    checkboxList: {
      selectedRecords: { size: 1 },
      selectAll: jest.fn(),
      deselectAll: jest.fn(),
    },
  },
  showRunConfirmation: jest.fn(),
  showDeleteConfirmation: jest.fn(),
  showRestoreConfirmation: jest.fn(),
};
const menu = { onToggle: jest.fn() };

const templates = menuTemplate(entity, menu);

describe('Action menu menuTemplate', () => {
  afterEach(() => {
    menu.onToggle.mockClear();
    entity.showRunConfirmation.mockClear();
    entity.showDeleteConfirmation.mockClear();
    entity.showRestoreConfirmation.mockClear();
    entity.props.checkboxList.selectAll.mockClear();
    entity.props.checkboxList.deselectAll.mockClear();
  });

  describe('when item is `addNew`', () => {
    it('then `LinkTo` component should be rendered', () => {
      const { getByText } = render(templates.addNew('key'));

      expect(getByText('LinkTo')).toBeDefined();
    });
  });

  describe('when item is `edit`', () => {
    it('then `LinkTo` component should be rendered', () => {
      const { getByText } = render(templates.edit('key'));

      expect(getByText('LinkTo')).toBeDefined();
    });
  });

  describe('when item is `editJobProfile`', () => {
    it('then `LinkTo` component should be rendered', () => {
      const { getByText } = render(templates.editJobProfile('key'));

      expect(getByText('LinkTo')).toBeDefined();
    });
  });

  describe('when item is `duplicate`', () => {
    it('then `LinkTo` component should be rendered', () => {
      const { getByText } = render(templates.duplicate('key'));

      expect(getByText('LinkTo')).toBeDefined();
    });
  });

  describe('when item is `run`', () => {
    it('then `Default` component should be rendered', () => {
      const { getByText } = render(templates.run('key'));

      expect(getByText('Default')).toBeDefined();
    });

    describe('when `Run` button is clicked', () => {
      it('then `handleRun` function should be called ', () => {
        const { getByText } = render(templates.run('key'));

        fireEvent.click(getByText('Default'));

        expect(menu.onToggle.mock.calls.length).toEqual(1);
        expect(entity.showRunConfirmation.mock.calls.length).toEqual(1);
      });
    });
  });

  describe('when item is `exportSelected`', () => {
    it('then `GroupAction` component should be rendered', () => {
      const { getByText } = render(templates.exportSelected('key'));

      expect(getByText('GroupAction')).toBeDefined();
    });
  });

  describe('when item is `selectAll`', () => {
    it('then `Default` component should be rendered', () => {
      const { getByText } = render(templates.selectAll('key'));

      expect(getByText('Default')).toBeDefined();
    });

    describe('when `selectAll` button is clicked', () => {
      it('then `handleSelectAllButton` function should be called ', () => {
        const { getByText } = render(templates.selectAll('key'));

        fireEvent.click(getByText('Default'));

        expect(menu.onToggle.mock.calls.length).toEqual(1);
        expect(entity.props.checkboxList.selectAll.mock.calls.length).toEqual(1);
      });
    });
  });

  describe('when item is `deselectAll`', () => {
    it('then `Default` component should be rendered', () => {
      const { getByText } = render(templates.deselectAll('key'));

      expect(getByText('Default')).toBeDefined();
    });

    describe('when `deselectAll` button is clicked', () => {
      it('then `handleDeselectAllButton` function should be called ', () => {
        const { getByText } = render(templates.deselectAll('key'));

        fireEvent.click(getByText('Default'));

        expect(menu.onToggle.mock.calls.length).toEqual(1);
        expect(entity.props.checkboxList.deselectAll.mock.calls.length).toEqual(1);
      });
    });
  });

  describe('when item is `delete`', () => {
    it('then `Default` component should be rendered', () => {
      const { getByText } = render(templates.delete('key'));

      expect(getByText('Default')).toBeDefined();
    });

    describe('when `delete` button is clicked', () => {
      it('then `handleDelete` function should be called ', () => {
        const { getByText } = render(templates.delete('key'));

        fireEvent.click(getByText('Default'));

        expect(menu.onToggle.mock.calls.length).toEqual(1);
        expect(entity.showDeleteConfirmation.mock.calls.length).toEqual(1);
      });
    });
  });

  describe('when item is `restoreDefaults`', () => {
    it('then `Default` component should be rendered', () => {
      const { getByText } = render(templates.restoreDefaults('key'));

      expect(getByText('Default')).toBeDefined();
    });

    describe('when `restoreDefaults` button is clicked', () => {
      it('then `handleRestoreDefaults` function should be called ', () => {
        const { getByText } = render(templates.restoreDefaults('key'));

        fireEvent.click(getByText('Default'));

        expect(menu.onToggle.mock.calls.length).toEqual(1);
        expect(entity.showRestoreConfirmation.mock.calls.length).toEqual(1);
      });
    });
  });
});
