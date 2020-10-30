import React from 'react';

import '../../../test/jest/__mock__';
import { renderWithIntl } from '../../../test/jest/helpers';

import { MappedHeader } from './MappedHeader';

jest.mock('..', () => ({
  WithTranslation: ({
    children,
    wrapperLabel,
  }) => <>{children(wrapperLabel)}</>,
}));

const renderMappedHeader = ({ headersToSeparate }) => {
  const component = <MappedHeader headersToSeparate={headersToSeparate} />;

  return renderWithIntl(component);
};

describe('Mapped header component', () => {
  it('should display 2 headers separated by a dot', () => {
    const { getByText } = renderMappedHeader({ headersToSeparate: ['header1', 'header2'] });

    expect(getByText('header1 · header2')).toBeDefined();
  });

  it('should display 3 headers separated by a dot', () => {
    const { getByText } = renderMappedHeader({ headersToSeparate: ['header1', 'header2', 'header3'] });

    expect(getByText('header1 · header2 · header3')).toBeDefined();
  });
});
