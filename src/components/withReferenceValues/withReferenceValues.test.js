import React from 'react';
import { fireEvent } from '@testing-library/react';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { withReferenceValues } from './withReferenceValues';

const mockOnFieldChange = jest.fn();

const mockInputOnchange = jest.fn();

const withReferenceValuesProps = {
  label: 'withReferenceValues label',
  value: 'test value',
  id: null,
  input: { onChange: mockInputOnchange },
  onFieldChange: mockOnFieldChange,
  dataOptions: [{
    optionValue: 'value1',
    optionLabel: 'name1',
  }, {
    optionValue: 'value2',
    optionLabel: 'name2',
  }],
  optionValue: 'optionValue',
  optionLabel: 'optionLabel',
  wrapperLabel: 'ui-data-import.settings.mappingProfiles.map.wrapper.acceptedValues',
  disabled: false,
  isMultiSelection: false,
  hasLoaded: true,
  required: false,
  readOnly: false,
};

const renderWithReferenceValues = ({
  label,
  value,
  id,
  input,
  wrapperLabel,
  dataOptions,
  onFieldChange,
  disabled,
  isMultiSelection,
  optionLabel,
  optionValue,
  hasLoaded,
  required,
  readOnly,
}) => {
  const WithReferenceValuesElement = withReferenceValues;

  const wrappedComponent = ({ onChange }) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-label="wrappedComponent label"
    />
  );

  const component = () => (
    <WithReferenceValuesElement
      label={label}
      value={value}
      input={input}
      id={id}
      wrappedComponent={wrappedComponent}
      onFieldChange={onFieldChange}
      dataOptions={dataOptions}
      wrapperLabel={wrapperLabel}
      optionLabel={optionLabel}
      optionValue={optionValue}
      disabled={disabled}
      isMultiSelection={isMultiSelection}
      hasLoaded={hasLoaded}
      required={required}
      readOnly={readOnly}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('withReferenceValues component', () => {
  afterAll(() => {
    mockOnFieldChange.mockClear();

    mockInputOnchange.mockClear();
  });

  it('should render wrapped component correctly', () => {
    const { getByRole } = renderWithReferenceValues(withReferenceValuesProps);

    expect(getByRole('textbox')).toBeInTheDocument();
  });

  describe('when type into input field', () => {
    it('should invoke onFieldChange prop', () => {
      const { getByRole } = renderWithReferenceValues(withReferenceValuesProps);

      fireEvent.change(getByRole('textbox'), { target: { value: 'test input' } });
      expect(mockOnFieldChange).toHaveBeenCalled();
    });

    it('should invoke onChange method of input prop', () => {
      const { getByRole } = renderWithReferenceValues(withReferenceValuesProps);

      fireEvent.change(getByRole('textbox'), { target: { value: 'test input' } });

      expect(mockInputOnchange).toHaveBeenCalled();
    });
  });

  describe('when clicked on dropdown', () => {
    it('should render dropdown', () => {
      const { getByText } = renderWithReferenceValues(withReferenceValuesProps);

      const dropdown = getByText('Accepted values');

      expect(getByText('name1')).not.toBeVisible();

      fireEvent.click(dropdown);

      expect(getByText('name1')).toBeVisible();
    });

    describe('when clicked on open dropdown', () => {
      it('should be closed after clicking on element button with value and label', () => {
        const { getByText } = renderWithReferenceValues(withReferenceValuesProps);

        const dropdown = getByText('Accepted values');

        fireEvent.click(dropdown);

        expect(getByText('name2')).toBeVisible();

        fireEvent.click(getByText('name2'));

        expect(getByText('name2')).not.toBeVisible();
      });
    });
  });
});
