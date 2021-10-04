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
    const { getByText } = renderDateColumn('2021-08-24T13:36:06.537+00:00');

    expect(getByText('Icon')).toBeDefined();
    expect(getByText('8/24/2021')).toBeDefined();
  });
});
