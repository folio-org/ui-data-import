import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/test/helpers';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { JobSummary } from './JobSummary';

const resources = buildResources({
  resourceName: 'jobExecutions',
  records: [{
    fileName: 'testFileName',
    progress: { total: 10 },
  }],
});
const mutator = buildMutator();

const renderJobSummary = () => {
  const component = (
    <Router>
      <JobSummary
        resources={resources}
        mutator={mutator}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Job summary page', () => {
  it('should have a file name in the header', () => {
    const { getByText } = renderJobSummary();

    expect(getByText('testFileName')).toBeDefined();
  });

  it('should have total number of records in the subheader', () => {
    const { getByText } = renderJobSummary();

    expect(getByText('10 records found')).toBeDefined();
  });

  describe('results table', () => {
    it('should have proper columns', () => {
      const { getByText } = renderJobSummary();

      expect(getByText('Record')).toBeDefined();
      expect(getByText('Title')).toBeDefined();
      expect(getByText('SRS MARC Bib')).toBeDefined();
      expect(getByText('Instance')).toBeDefined();
      expect(getByText('Holdings')).toBeDefined();
      expect(getByText('Item')).toBeDefined();
      expect(getByText('Order')).toBeDefined();
      expect(getByText('Invoice')).toBeDefined();
      expect(getByText('Error')).toBeDefined();
    });
  });
});
