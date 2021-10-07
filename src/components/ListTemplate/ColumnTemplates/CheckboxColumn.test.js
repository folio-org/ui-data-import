import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { CheckboxColumn } from './CheckboxColumn';

const onChangeMock = jest.fn();

const renderCheckboxColumn = (value, checked, onChange) => {
  const component = (
    <CheckboxColumn
      value={value}
      checked={checked}
      onChange={onChange}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('CheckboxColumn', () => {
  afterEach(() => {
    onChangeMock.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderCheckboxColumn('test value');
    const checkbox = container.querySelector('.input');

    expect(checkbox).toBeDefined();
  });

  describe('when clicking on checkbox', () => {
    it('onChange event should be called with value', () => {
      const { container } = renderCheckboxColumn('test value', false, onChangeMock);
      const checkbox = container.querySelector('.input');

      fireEvent.click(checkbox);

      expect(onChangeMock.mock.calls[0][0]).toEqual('test value');
    });
  });
});
