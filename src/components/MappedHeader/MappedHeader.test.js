import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { MappedHeader } from './MappedHeader';

jest.mock('..', () => ({
  WithTranslation: ({
    children,
    wrapperLabel,
  }) => <>{children(wrapperLabel)}</>,
}));

const renderMappedHeader = ({ headersToSeparate }) => {
  const component = <MappedHeader headersToSeparate={headersToSeparate} />;

  return renderWithIntl(component, translationsProperties);
};

describe('Mapped header component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMappedHeader({ headersToSeparate: ['header1', 'header2', 'header3'] });

    await runAxeTest({ rootNode: container });
  });

  it('should display 1 header without separators', () => {
    const { getByText } = renderMappedHeader({ headersToSeparate: ['header1'] });

    expect(getByText('header1')).toBeDefined();
  });

  it('should display 2 headers separated by a dot', () => {
    const { getByText } = renderMappedHeader({ headersToSeparate: ['header1', 'header2'] });

    expect(getByText('header1 · header2')).toBeDefined();
  });

  it('should display 3 headers separated by a dot', () => {
    const { getByText } = renderMappedHeader({ headersToSeparate: ['header1', 'header2', 'header3'] });

    expect(getByText('header1 · header2 · header3')).toBeDefined();
  });
});
