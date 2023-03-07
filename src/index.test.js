import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import '../test/jest/__mock__';
import { buildStripes } from '../test/jest/helpers';

import DataImport from './index';

jest.mock('./settings', () => ({
  ...jest.requireActual('./settings'),
  DataImportSettings: () => 'DataImportSettings',
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  CommandList: ({ children }) => <>{children}</>,
}));

const stripes = buildStripes();

const renderDataImport = (showSettings = false) => {
  const component = (
    <Router>
      <DataImport
        showSettings={showSettings}
        match={{ path: 'data-import' }}
        stripes={stripes}
      />
    </Router>
  );

  return render(component);
};

describe('DataImport component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderDataImport();
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should be rendered', () => {
    expect(renderDataImport()).toBeDefined();
  });

  describe('when showSettings is true', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderDataImport(true);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should render Data import settings', () => {
      const { getByText } = renderDataImport(true);

      expect(getByText('DataImportSettings')).toBeDefined();
    });
  });
});
