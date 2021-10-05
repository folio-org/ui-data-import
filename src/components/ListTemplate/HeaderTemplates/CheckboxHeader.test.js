import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { CheckboxHeader } from './CheckboxHeader';

const onChangeMock = jest.fn();

const renderCheckboxHeader = (checked, onChange) => {
  const component = (
    <CheckboxHeader
      checked={checked}
      onChange={onChange}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('CheckboxHeader', () => {
  afterEach(() => {
    onChangeMock.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderCheckboxHeader();
    const checkbox = container.querySelector('.input');

    expect(checkbox).toBeDefined();
  });

  describe('when clicking on checkbox', () => {
    it('onChange event should be called', () => {
      const { container } = renderCheckboxHeader(false, onChangeMock);
      const checkbox = container.querySelector('.input');

      fireEvent.click(checkbox);

      expect(onChangeMock.mock.calls).toHaveLength(1);
    });
  });
});
