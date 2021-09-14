import React from 'react';
import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { RecordSelect } from './RecordSelect';

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
  it('Records should be rendered', () => {
    const { getByText } = renderRecordSelect({ isLocalLTR: false });

    expect(getByText('Instance')).toBeDefined();
    expect(getByText('Holdings')).toBeDefined();
    expect(getByText('Item')).toBeDefined();
    expect(getByText('MARC Holdings')).toBeDefined();
    expect(getByText('MARC Bibliographic')).toBeDefined();
    expect(getByText('Order & order line')).toBeDefined();
    expect(getByText('Invoice')).toBeDefined();
    expect(getByText('MARC Authority')).toBeDefined();
  });
  describe('when it renders on the right side', () => {
    it('container should be rendered with appropriate class', () => {
      const { container } = renderRecordSelect({ isLocalLTR: false });

      expect(container.querySelector('treeViewRTL')).toBeDefined();
    });
  });

  describe('when it renders on the left side', () => {
    it('container should be rendered with appropriate class', () => {
      const { container } = renderRecordSelect({ isLocalLTR: true });

      expect(container.querySelector('treeViewLTR')).toBeDefined();
    });
  });
});
