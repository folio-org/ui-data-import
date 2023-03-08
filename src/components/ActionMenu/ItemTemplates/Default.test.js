import React from 'react';
import { fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { Default } from './Default';

const onClick = jest.fn();

const renderDefaultItemTemplate = () => {
  const component = (
    <Default
      caption="ui-data-import.run"
      icon="test icon"
      onClick={onClick}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Action menu Default Item Template', () => {
  afterEach(() => {
    onClick.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderDefaultItemTemplate();
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should be rendered', () => {
    expect(renderDefaultItemTemplate()).toBeDefined();
  });

  describe('when button is clicked', () => {
    it('then `onClick` function should be called', () => {
      const { getByText } = renderDefaultItemTemplate();

      fireEvent.click(getByText('Run'));

      expect(onClick.mock.calls.length).toEqual(1);
    });
  });
});
