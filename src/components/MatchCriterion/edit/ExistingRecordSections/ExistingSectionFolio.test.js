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
  afterEach(() => {
    onChangeFormStateMock.mockClear();
  });

  it('should render data options', () => {
    const { getByText } = renderExistingSectionFolio(existingSectionFolioWithCorrectData);

    expect(getByText('test label1')).toBeDefined();
    expect(getByText('test label2')).toBeDefined();
  });

  describe('when clicking on options element', () => {
    it('with correct data, single value shouldn`t be added', () => {
      const {
        container,
        getByText,
      } = renderExistingSectionFolio(existingSectionFolioWithCorrectData);
      const optionsElement = getByText('test label1');

      fireEvent.click(optionsElement);

      const singleValueContainer = container.querySelector('.singleValue');

      expect(singleValueContainer).not.toHaveTextContent('test label1');
      expect(onChangeFormStateMock).toHaveBeenCalledTimes(1);
    });

    it('with incorrect data, single value should be added', () => {
      const {
        container,
        getByText,
      } = renderExistingSectionFolio(existingSectionFolioWithWrongData);
      const optionsElement = getByText('test label2');

      fireEvent.click(optionsElement);

      const singleValueContainer = container.querySelector('.singleValue');

      expect(singleValueContainer).toHaveTextContent('test label2');
      expect(onChangeFormStateMock).toHaveBeenCalledTimes(1);
    });
  });

  describe.skip('when searching for an option', () => {
    it('should filter data options', () => {
      const {
        getByRole,
        getByLabelText,
      } = renderExistingSectionFolio(existingSectionFolioWithCorrectData);
      const filterElement = getByLabelText('options filter');

      expect(filterElement).toHaveValue('');

      fireEvent.change(filterElement, { target: { value: 'test label1' } });

      const dropdownOptionsAmount = getByRole('listbox').children.length;

      expect(filterElement).toHaveValue('test label1');
      expect(dropdownOptionsAmount).toEqual(1);
    });
  });
});
