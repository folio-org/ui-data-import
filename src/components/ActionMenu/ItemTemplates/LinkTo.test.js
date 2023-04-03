import React from 'react';
import { fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { LinkTo } from './LinkTo';

const menu = { onToggle: jest.fn() };
const history = createMemoryHistory();

history.push = jest.fn();

const renderLinkToItemTemplate = () => {
  const component = (
    <Router history={history}>
      <LinkTo
        location="/test-url"
        caption="ui-data-import.run"
        menu={menu}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Action menu LinkTo Item Template', () => {
  afterEach(() => {
    menu.onToggle.mockClear();
    history.push.mockClear();
  });

  it('should be rendered', () => {
    expect(renderLinkToItemTemplate()).toBeDefined();
  });

  describe('when button is clicked', () => {
    it('then `onClick` function should be called', () => {
      const { getByText } = renderLinkToItemTemplate();

      fireEvent.click(getByText('Run'));

      expect(menu.onToggle.mock.calls.length).toEqual(1);
    });

    it('and url should be changed', () => {
      const { getByText } = renderLinkToItemTemplate();

      fireEvent.click(getByText('Run'));

      expect(history.push).toHaveBeenCalledWith('/test-url');
    });
  });
});
