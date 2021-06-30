import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import {
  renderWithFinalForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { FolioRecordTypeSelect } from './FolioRecordTypeSelect';

const renderFolioRecordTypeSelect = onRecordSelect => {
  const dataOptions = [{
    label: 'option_1',
    value: 'value_1',
  }, {
    label: 'option_2',
    value: 'value_2',
  }];

  const component = () => (
    <FolioRecordTypeSelect
      fieldName="folioRecord"
      dataOptions={dataOptions}
      onRecordSelect={onRecordSelect}
    />
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('FolioRecordTypeSelect component', () => {
  it('should be rendered', () => {
    const { getByText } = renderFolioRecordTypeSelect();

    expect(getByText('FOLIO record type')).toBeDefined();
  });

  describe('when "onRecordSelect" prop is passed', () => {
    it('should be called on field change', () => {
      const onRecordSelect = jest.fn();
      const { getByTestId } = renderFolioRecordTypeSelect(onRecordSelect);

      const selectElement = getByTestId('folio-record-type-select');

      fireEvent.change(selectElement, { target: { value: 'option_1' } });

      expect(onRecordSelect.mock.calls.length).toEqual(1);
    });
  });
});
