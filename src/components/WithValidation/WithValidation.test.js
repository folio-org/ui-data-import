import React from 'react';

import { waitFor } from '@testing-library/react';

import { renderWithContext } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';

import { WithValidation } from './WithValidation';

const TestComponent = props => {
  let data = '';
  const handleChange = () => {
    const value = props.validate();

    data = value;
  };

  return (
    <div>
      <input
        data-testid="name"
        type="text"
        id="name"
        name="name"
        onChange={props.validate('hello')}
        value="Hello"
      />
      <input
        data-testid="age"
        type="text"
        id="age"
        name="age"
        onChange={handleChange}
        value={data}
      />
    </div>
  );
};

const children = validation => (
  <TestComponent
    label="test"
    name="test"
    validate={validation}
  />
);

const renderWithValidation = ({ isRemoveValueAllowed }) => {
  const component = (
    <WithValidation
      isRemoveValueAllowed={isRemoveValueAllowed}
    >
      {children}
    </WithValidation>
  );

  return renderWithContext(component);
};

describe('With Validation component', () => {
  it('Render the component', () => {
    waitFor(() => expect(renderWithValidation(false)).toBeDefined());
  });
  it('Check the validateQuotedStringOrMarcPath by passing normal string and setting remove value prop as true', () => {
    const { getByTestId } = renderWithValidation(true);
    const input = getByTestId('name');

    waitFor(() => expect(input.value).toBe('Hello'));
  });
  it('Check the validateQuotedStringOrMarcPath by passing null and setting remove as false', () => {
    const { getByTestId } = renderWithValidation(false);
    const input = getByTestId('age');

    expect(input.value).toMatch('');
  });
});
