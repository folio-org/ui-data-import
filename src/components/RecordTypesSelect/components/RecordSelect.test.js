import React from 'react';
import { noop } from 'lodash';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { RecordSelect } from './RecordSelect';

expect.extend(toHaveNoViolations);

const renderRecordSelect = ({ isLocalLTR }) => {
  const component = (
    <RecordSelect
      onSelect={noop}
      id="testId"
      isLocalLTR={isLocalLTR}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('RecordSelect', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderRecordSelect({ isLocalLTR: false });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
  it('Records should be rendered', () => {
    const { getByText } = renderRecordSelect({ isLocalLTR: false });

    expect(getByText('Instance')).toBeDefined();
    expect(getByText('Holdings')).toBeDefined();
    expect(getByText('Item')).toBeDefined();
    expect(getByText('MARC Bibliographic')).toBeDefined();
    expect(getByText('MARC Authority')).toBeDefined();
  });

  describe('when current language is RTL', () => {
    it('direction should be rendered correctly', () => {
      const { container } = renderRecordSelect({ isLocalLTR: false });

      expect(container.querySelector('treeViewRTL')).toBeDefined();
    });
  });

  describe('when current language is LTR', () => {
    it('direction should be rendered correctly', () => {
      const { container } = renderRecordSelect({ isLocalLTR: true });

      expect(container.querySelector('treeViewLTR')).toBeDefined();
    });
  });
});
