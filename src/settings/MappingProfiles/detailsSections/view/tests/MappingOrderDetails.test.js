import React from 'react';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../../test/jest/helpers';

import { MappingOrderDetails } from '../MappingOrderDetails';
import ORDER from '../../../initialDetails/ORDER';

expect.extend(toHaveNoViolations);

const renderMappingOrderDetails = () => {
  const component = (
    <MappingOrderDetails mappingDetails={ORDER.mappingFields} />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MappingOrderDetails', () => {
  // TODO: Create separate ticket to fix all the accesibility tests
  it.skip('should be rendered with no axe errors', async () => {
    const { container } = renderMappingOrderDetails();
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should have correct sections', () => {
    const { getByRole } = renderMappingOrderDetails();

    expect(getByRole('button', { name: /order information/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /order line information/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /item details/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /po line details/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /vendor/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /cost details/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /fund distribution/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /location/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /physical resource details/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /e-resources details/i })).toBeInTheDocument();
  });

  it('all sections are expanded by default', () => {
    const { getByRole } = renderMappingOrderDetails();

    expect(getByRole('button', { name: /order information/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /order line information/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /item details/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /po line details/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /vendor/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /cost details/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /fund distribution/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /location/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /physical resource details/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /e-resources details/i })).toHaveAttribute('aria-expanded', 'true');
  });
});
