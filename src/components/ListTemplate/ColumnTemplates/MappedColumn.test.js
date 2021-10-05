import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { MappedColumn } from './MappedColumn';

const renderMappedColumn = record => {
  const component = (
    <MappedColumn
      record={record}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MappedColumn', () => {
  describe('when record exists', () => {
    it('should be rendered', () => {
      const { getByText } = renderMappedColumn({ existingRecordType: 'INSTANCE' });

      expect(getByText('Instance')).toBeDefined();
    });
  });

  describe('when record does not exist', () => {
    it('no value should be rendered', () => {
      const { getByText } = renderMappedColumn(null);

      expect(getByText('-')).toBeDefined();
    });
  });

  describe('when record has no record type', () => {
    it('no value should be rendered', () => {
      const { getByText } = renderMappedColumn({ existingRecordType: null });

      expect(getByText('-')).toBeDefined();
    });
  });
});
