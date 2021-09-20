import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { CompareRecordSelect } from './CompareRecordSelect';

const compareRecordSelectProps = {
  id: 'match.value-type.static-value',
  existingRecord: {
    type: 'INSTANCE',
    captionId: 'ui-data-import.recordTypes.instance',
    iconKey: 'instances',
  },
  incomingRecord: {
    type: 'HOLDINGS',
    captionId: 'ui-data-import.recordTypes.holdings',
    iconKey: 'holdings',
  },
};

const renderCompareRecordSelect = ({
  existingRecord,
  incomingRecord,
  isLocalLTR = true,
  id,
}) => {
  const component = (
    <CompareRecordSelect
      existingRecord={existingRecord}
      incomingRecord={incomingRecord}
      isLocalLTR={isLocalLTR}
      id={id}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('CompareRecordSelect', () => {
  describe('when current language is LTR', () => {
    it('diraction should be rendered correctly', () => {
      const {
        container,
        getByText,
      } = renderCompareRecordSelect(compareRecordSelectProps);
      const compareContainer = container.querySelector('.borderLeft');

      expect(getByText('Incoming records')).toBeDefined();
      expect(getByText('Existing records')).toBeDefined();
      expect(compareContainer).toBeDefined();
    });
  });

  describe('when current language is RLT', () => {
    it('diraction should be rendered correctly', () => {
      const {
        container,
        getByText,
      } = renderCompareRecordSelect({
        ...compareRecordSelectProps,
        isLocalLTR: false,
      });
      const compareContainer = container.querySelector('.borderRight');

      expect(getByText('Incoming records')).toBeDefined();
      expect(getByText('Existing records')).toBeDefined();
      expect(compareContainer).toBeDefined();
    });
  });
});
