import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { Pluggable } from '@folio/stripes/core';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { FieldOrganization } from '.';

const organizationMock = {
  id: '1',
  name: 'org 1',
};

const mutator = {
  fieldOrganizationOrg: {
    GET: jest.fn().mockResolvedValue(organizationMock),
    reset: jest.fn(),
  },
};
const setReferenceTablesMock = jest.fn();

const renderFieldOrganization = ({
  id,
  onSelect,
}) => {
  const component = () => (
    <FieldOrganization
      id={id}
      name="org"
      mutator={mutator}
      setReferenceTables={setReferenceTablesMock}
      onSelect={onSelect}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('FieldOrganization component', () => {
  afterEach(() => {
    Pluggable.mockClear();
    setReferenceTablesMock.mockClear();
  });

  describe('when vendor id is provided', () => {
    it('should render selected organization', async () => {
      const { findByDisplayValue } = renderFieldOrganization({ id: '1' });

      const inputValue = await findByDisplayValue('org 1');

      expect(inputValue).toBeDefined();
    });
  });

  describe('when vendor id is not provided', () => {
    it('should render an empty input', () => {
      const { container } = renderFieldOrganization({});

      const input = container.querySelector('[id="org"]');

      expect(input.value).toBe('');
    });
  });

  describe('when clear icon clicked', () => {
    it('should clear the input', async () => {
      const {
        getByText,
        findByDisplayValue,
        container,
      } = renderFieldOrganization({ id: '1' });

      const inputValue = await findByDisplayValue('org 1');

      expect(inputValue).toBeDefined();

      const input = container.querySelector('[id="org"]');
      const clearIcon = getByText('Icon');

      fireEvent.click(clearIcon);

      expect(input.value).toBe('');
      expect(setReferenceTablesMock).toHaveBeenCalled();
    });
  });

  describe('when vendor is selected', () => {
    it('should display an organization', async () => {
      const onSelect = jest.fn();
      const { findByDisplayValue } = renderFieldOrganization({ onSelect });

      Pluggable.mock.calls[0][0].selectVendor({ name: 'org 2' });

      const inputValue = await findByDisplayValue('org 2');

      expect(inputValue).toBeDefined();
      expect(onSelect).toHaveBeenCalled();
    });
  });
});