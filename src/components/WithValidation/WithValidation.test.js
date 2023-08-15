import React from 'react';

import {
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { renderWithContext } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';

import { WithValidation } from './WithValidation';

const TestComponent = props => {
  let data = '';
  const handleChange = () => {
    data = props.validate();
  };

  return (
    <div>
      <input
        data-testid="name"
        type="text"
        id="name"
        name="name"
        onChange={() => props.validate('hello')}
        value=""
        aria-label="Name"
      />
      <input
        data-testid="age"
        type="text"
        id="age"
        name="age"
        onChange={handleChange}
        value={data}
        aria-label="Age"
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
  it('should be rendered with no axe errors', async () => {
    const { container } = renderWithValidation(false);

    await runAxeTest({ rootNode: container });
  });

  it('Render the component', () => {
    waitFor(() => expect(renderWithValidation(false)).toBeDefined());
  });
});

describe('Check the validateQuotedStringOrMarcPath by', () => {
  it('passing normal string and setting remove value prop as true', async () => {
    const { getByTestId } = renderWithValidation(true);
    const input = getByTestId('name');

    fireEvent.change(input, { target: { value: 'Hello' } });

    waitFor(() => expect(input.value).toBe('Hello'));
  });
  it('passing null and setting remove as false', () => {
    const { getByTestId } = renderWithValidation(false);
    const input = getByTestId('age');

    expect(input.value).toMatch('');
  });
});
