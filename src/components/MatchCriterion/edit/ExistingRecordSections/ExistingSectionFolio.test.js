import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
  renderWithFinalForm,
} from '../../../../../test/jest/helpers';
import '../../../../../test/jest/__mock__';

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
  formValues: [{ existingMatchExpression: { fields: [{ value: 'instance.identifiers[].value' }] } }],
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
    id: 'contributors.items.properties.name',
  }],
  existingRecordType: 'INSTANCE',
  changeFormState: onChangeFormStateMock,
  formValues: [{ existingMatchExpression: { fields: [{ value: 'instance.contributors[].name' }] } }],
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

describe('ExistingSectionFolio edit component', () => {
  afterEach(() => {
    onChangeFormStateMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderExistingSectionFolio(existingSectionFolioWithCorrectData);

    await runAxeTest({ rootNode: container });
  });

  it('should render data options', () => {
    const { getByText } = renderExistingSectionFolio(existingSectionFolioWithCorrectData);

    expect(getByText('test label1')).toBeDefined();
    expect(getByText('test label2')).toBeDefined();
  });

  describe('when clicking on options element', () => {
    it('with correct data, single value shouldn\'t be added', () => {
      const fieldToChangePath = 'profile.matchDetails[0].existingMatchExpression.fields';
      const fieldToChangeValue = [{
        label: 'field',
        value: 'instance.identifiers[].value',
      }, {
        label: 'identifierTypeId',
        value: 'test value1',
      }];

      const {
        container,
        getByText,
      } = renderExistingSectionFolio(existingSectionFolioWithCorrectData);
      const optionsElement = getByText('test label1');

      fireEvent.click(optionsElement);

      const singleValueContainer = container.querySelector('.singleValue');

      expect(singleValueContainer).not.toHaveTextContent('test label1');
      expect(onChangeFormStateMock).toHaveBeenCalledWith(fieldToChangePath, fieldToChangeValue);
    });

    it('with incorrect data, single value should be added', () => {
      const fieldToChangePath = 'profile.matchDetails[0].existingMatchExpression.fields';
      const fieldToChangeValue = [{
        label: 'field',
        value: 'instance.contributors[].name',
      }];
      const { getByText } = renderExistingSectionFolio(existingSectionFolioWithWrongData);

      const optionsElement = getByText('test label2');
      fireEvent.click(optionsElement);

      expect(onChangeFormStateMock).toHaveBeenCalledWith(fieldToChangePath, fieldToChangeValue);
    });
  });

  describe('when searching for an option', () => {
    it('should filter data options', () => {
      const {
        container,
        getByPlaceholderText,
      } = renderExistingSectionFolio(existingSectionFolioWithCorrectData);
      const filterElement = getByPlaceholderText('Filter options list');

      expect(filterElement).toHaveValue('');

      fireEvent.change(filterElement, { target: { value: 'test label1' } });

      const dropdownOptionsAmount = container.querySelector('.selectionList').children.length;

      expect(filterElement).toHaveValue('test label1');
      expect(dropdownOptionsAmount).toEqual(1);
    });
  });
});
