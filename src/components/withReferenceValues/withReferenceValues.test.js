import React from 'react';

import { fireEvent } from '@testing-library/react';

import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';

import {
  renderWithReduxForm, translationsProperties,
} from '../../../test/jest/helpers';

import { withReferenceValues } from './withReferenceValues';

const withReferenceValuesProps = {
  label: 'withReferenceValues label',
  value: 'test value',
  id: null,
  input: <input />,
  onFieldChange: noop,
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
  wrapperLabel,
  dataOptions,
  disabled,
  isMultiSelection,
  optionLabel,
  optionValue,
  hasLoaded,
  required,
  readOnly,
}) => {
  const WithReferenceValues = withReferenceValues;

  const wrappedComponent = ({ onChange }) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );

  const component = () => (
    <WithReferenceValues
      label={label}
      value={value}
      id={id}
      wrappedComponent={wrappedComponent}
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
  it('should render wrapped component correctly', () => {
    const { container } = renderWithReferenceValues(withReferenceValuesProps);

    expect(container.querySelector('input')).toBeDefined();
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
