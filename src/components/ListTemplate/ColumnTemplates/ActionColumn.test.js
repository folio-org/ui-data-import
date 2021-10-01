import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { ActionColumn } from './ActionColumn';

const recordWithActionAndRecordType = {
  action: 'CREATE',
  folioRecord: 'INSTANCE',
};
const recordWithRecordType = { folioRecord: 'INSTANCE' };
const recordWithAction = { action: 'CREATE' };

const renderActionColumn = record => {
  const component = (
    <ActionColumn record={record} />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ActionColumn', () => {
  describe('when record has action and record type', () => {
    it('should be rendered', () => {
      const { getByText } = renderActionColumn(recordWithActionAndRecordType);

      expect(getByText('Create instance')).toBeDefined();
    });
  });

  describe('when record doesn`t exist', () => {
    it('no value should be rendered', () => {
      const { getByText } = renderActionColumn(null);

      expect(getByText('-')).toBeDefined();
    });
  });

  describe('when record has no action', () => {
    it('no value should be rendered', () => {
      const { getByText } = renderActionColumn(recordWithRecordType);

      expect(getByText('-')).toBeDefined();
    });
  });

  describe('when record has no type', () => {
    it('no value should be rendered', () => {
      const { getByText } = renderActionColumn(recordWithAction);

      expect(getByText('-')).toBeDefined();
    });
  });
});
