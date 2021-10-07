import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { MatchColumn } from './MatchColumn';

const matchColumnProps = ({
  existingRecordType,
  field,
}) => ({
  existingRecordType,
  field,
  matchDetails: [{ existingMatchExpression: { fields: ['field1, field2'] } }],
});

const renderMatchColumn = record => {
  const component = (
    <MatchColumn
      record={record}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MatchColumn', () => {
  describe('when record doesn`t exist', () => {
    it('no value should be rendered', () => {
      const { getByText } = renderMatchColumn(null);

      expect(getByText('-')).toBeDefined();
    });
  });

  describe('when record has no field and record type', () => {
    it('no value should be rendered', () => {
      const { getByText } = renderMatchColumn(matchColumnProps({
        existingRecordType: null,
        field: null,
      }));

      expect(getByText('-')).toBeDefined();
    });
  });

  describe('when text direction is rtl', () => {
    it('should be rendered correctly', () => {
      document.dir = 'rtl';
      const { getByText } = renderMatchColumn(matchColumnProps({
        existingRecordType: 'INSTANCE',
        field: 'field1',
      }));
      const firstContainer = getByText('Field1');
      const secondContainer = getByText('Instance');

      expect(firstContainer.nextElementSibling).toEqual(secondContainer);
    });
  });

  describe('when text direction is ltr', () => {
    it('should be rendered correctly', () => {
      document.dir = 'ltr';
      const { getByText } = renderMatchColumn(matchColumnProps({
        existingRecordType: 'INSTANCE',
        field: 'field1',
      }));
      const firstContainer = getByText('Instance');
      const secondContainer = getByText('Field1');

      expect(firstContainer.nextElementSibling).toEqual(secondContainer);
    });
  });

  describe('when record has no field', () => {
    it('should be rendered correctly', () => {
      const { getAllByText } = renderMatchColumn(matchColumnProps({
        existingRecordType: 'INSTANCE',
        field: null,
      }));

      expect(getAllByText('Instance')).toBeDefined();
    });
  });
});
