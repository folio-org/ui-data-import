import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { CompareRecordSelect } from './CompareRecordSelect';
import { MATCH_INCOMING_RECORD_TYPES } from '../../../utils';

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
      incomingRecordOptions={MATCH_INCOMING_RECORD_TYPES}
      isLocalLTR={isLocalLTR}
      id={id}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('CompareRecordSelect component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderCompareRecordSelect(compareRecordSelectProps);

    await runAxeTest({ rootNode: container });
  });

  describe('when current language is LTR', () => {
    it('direction should be rendered correctly', () => {
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
    it('direction should be rendered correctly', () => {
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
