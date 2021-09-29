import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../test/jest/helpers';

import { DateColumn } from './DateColumn';

const renderDateColumn = value => {
  const component = (
    <DateColumn value={value} />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('DateColumn', () => {
  it('should be rendered', () => {
    const { getByText } = renderDateColumn('12/12/2021');

    expect(getByText('Icon')).toBeDefined();
    expect(getByText('12/11/2021')).toBeDefined();
  });
});
