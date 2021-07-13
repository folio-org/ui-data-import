import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import {
  translationsProperties,
  renderWithFinalForm,
} from '../../../../../test/jest/helpers';

import { ExistingSectionFolio } from './ExistingSectionFolio';

const onChangeFormStateMock = jest.fn(value => value);
const existingSectionFolioWithCorrectData = {
  repeatableIndex: 0,
  existingRecordFieldLabel: 'test field label',
  existingRecordFields: [{
    value: 'test value1',
    label: 'test label1',
    id: 'identifiers.items.properties.value',
  }, {
    value: 'test value2',
    label: 'test label2',
    id: 'createdDate',
  }],
  existingRecordType: 'INSTANCE',
  changeFormState: onChangeFormStateMock,
  formValues: { profile: { matchDetails: [{ existingMatchExpression: { fields: [{ value: 'instance.identifiers[].value' }] } }] } },
};

const existingSectionFolioWithWrongData = {
  repeatableIndex: 0,
  existingRecordFieldLabel: 'test field label',
  existingRecordFields: [{
    value: 'test value1',
    label: 'test label1',
    id: 'test id11',
  }, {
    value: 'test value2',
    label: 'test label2',
    id: 'test id2',
  }],
  existingRecordType: 'HOLDINGS',
  changeFormState: onChangeFormStateMock,
  formValues: { profile: { matchDetails: [{ existingMatchExpression: { fields: [{ value: 'test value' }] } }] } },
};

const renderExistingSectionFolio = ({
  repeatableIndex,
  existingRecordFieldLabel,
  existingRecordFields,
  existingRecordType,
  changeFormState,
  formValues,
}) => {
  const component = () => (
    <ExistingSectionFolio
      repeatableIndex={repeatableIndex}
      existingRecordFieldLabel={existingRecordFieldLabel}
      existingRecordFields={existingRecordFields}
      existingRecordType={existingRecordType}
      changeFormState={changeFormState}
      formValues={formValues}
    />
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('ExistingSectionFolio edit', () => {
  afterAll(() => {
    onChangeFormStateMock.mockClear();
  });

  it('should be rendered with options', () => {
    const { getByText } = renderExistingSectionFolio(existingSectionFolioWithCorrectData);

    expect(getByText('test label1')).toBeDefined();
    expect(getByText('test label2')).toBeDefined();
  });

  describe('when clicking on options element', () => {
    it('with correct data', () => {
      const { getByText } = renderExistingSectionFolio(existingSectionFolioWithCorrectData);
      const element = getByText('test label1');

      fireEvent.click(element);

      expect(element).toBeDefined();
    });

    it('with incorrect data', () => {
      const { getByText } = renderExistingSectionFolio(existingSectionFolioWithWrongData);
      const element = getByText('test label2');

      fireEvent.click(element);

      expect(element).toBeDefined();
    });
  });

  describe('when input text to search', () => {
    it('input change its value', () => {
      const { getByLabelText } = renderExistingSectionFolio(existingSectionFolioWithCorrectData);
      const element = getByLabelText('options filter');

      expect(element).toHaveValue('');

      fireEvent.change(element, { target: { value: 'test value1' } });

      expect(element).toHaveValue('test value1');
    });
  });
});
