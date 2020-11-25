import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { GroupAction } from './GroupAction';

const menu = { onToggle: jest.fn() };

const renderGroupActionItemTemplate = ({ selectedCount = 0 }) => {
  const component = (
    <GroupAction
      caption="ui-data-import.run"
      icon="test icon"
      menu={menu}
      selectedCount={selectedCount}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Action menu GroupAction Item Template', () => {
  afterEach(() => {
    menu.onToggle.mockClear();
  });

  it('should be rendered', () => {
    expect(renderGroupActionItemTemplate({})).toBeDefined();
  });

  describe('when button is clicked and `selectedCount` prop not passed', () => {
    it('then `onToggle` function should not be called', () => {
      const { getByText } = renderGroupActionItemTemplate({});

      fireEvent.click(getByText('Run'));

      expect(menu.onToggle.mock.calls.length).toEqual(0);
    });
  });

  describe('when button is clicked and `selectedCount` prop is passed', () => {
    it('then `onToggle` function should be called', () => {
      const { getByText } = renderGroupActionItemTemplate({ selectedCount: 1 });

      fireEvent.click(getByText('Run (1 item)'));

      expect(menu.onToggle.mock.calls.length).toEqual(1);
    });

    it('then `selectedCount` should be shown', () => {
      const { getByText } = renderGroupActionItemTemplate({ selectedCount: 2 });

      expect(getByText('Run (2 items)')).toBeDefined();
    });
  });
});
