import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { RecordTypesSelect } from './RecordTypesSelect';

window.ResizeObserver = jest.fn(() => ({
  observe() {},
  unobserve() {},
}));

const renderRecordTypesSelect = ({
  incomingRecordType,
  existingRecordType,
}) => {
  const component = (
    <RecordTypesSelect
      incomingRecordType={incomingRecordType}
      existingRecordType={existingRecordType}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('RecordTypesSelect', () => {
  afterAll(() => {
    delete window.ResizeObserver;
  });

  it('should be rendered', () => {
    const { getByText } = renderRecordTypesSelect({
      incomingRecordType: 'MARC_AUTHORITY',
      existingRecordType: 'INSTANCE',
    });

    expect(getByText('You are comparing to this record'));
    expect(getByText('Incoming records'));
    expect(getByText('Existing records'));
  });

  describe('when clicking on record item', () => {
    it('appropriate record type should be chosen', () => {
      const {
        container,
        getByText,
      } = renderRecordTypesSelect({
        incomingRecordType: 'MARC_AUTHORITY',
        existingRecordType: null,
      });

      fireEvent.click(getByText('Instance'));
      const compareRecordValue = container.querySelector('.container').getAttribute('data-test-compare-record');

      expect(compareRecordValue).toEqual('INSTANCE');
    });
  });
});