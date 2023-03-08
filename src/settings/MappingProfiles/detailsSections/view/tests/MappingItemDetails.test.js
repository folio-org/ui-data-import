import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../../test/jest/helpers';

import { MappingItemDetails } from '../MappingItemDetails';

const mappingDetailsProp = [{
  enabled: 'true',
  name: 'vendorId',
  path: 'invoice.vendorId',
  subfields: [],
  value: '',
}];

const renderMappingItemDetails = () => {
  const component = (
    <MappingItemDetails mappingDetails={mappingDetailsProp} />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('<MappingItemDetails>', () => {
  // TODO: Create separate ticket to fix all the accesibility tests
  it.skip('should be rendered with no axe errors', async () => {
    const { container } = renderMappingItemDetails();

    await runAxeTest({ rootNode: container });
  });

  it('should have correct sections', () => {
    const { getByRole } = renderMappingItemDetails();

    expect(getByRole('button', { name: /administrative data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /item data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /enumeration data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /condition/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /item notes/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /loan and availability/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /location/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /electronic access/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /administrative data/i })).toBeInTheDocument();
  });

  it('All sections are expanded by default', () => {
    const { getByRole } = renderMappingItemDetails();

    expect(getByRole('button', { name: /administrative data/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /item data/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /enumeration data/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /condition/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /item notes/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /loan and availability/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /location/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /electronic access/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /administrative data/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('User can collapse sections', () => {
    const { getByRole } = renderMappingItemDetails();

    fireEvent.click(getByRole('button', { name: /administrative data/i }));
    fireEvent.click(getByRole('button', { name: /item data/i }));
    fireEvent.click(getByRole('button', { name: /enumeration data/i }));
    fireEvent.click(getByRole('button', { name: /condition/i }));
    fireEvent.click(getByRole('button', { name: /item notes/i }));
    fireEvent.click(getByRole('button', { name: /loan and availability/i }));
    fireEvent.click(getByRole('button', { name: /location/i }));
    fireEvent.click(getByRole('button', { name: /electronic access/i }));

    expect(getByRole('button', { name: /administrative data/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /item data/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /enumeration data/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /condition/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /item notes/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /loan and availability/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /location/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /electronic access/i })).toHaveAttribute('aria-expanded', 'false');
  });
});
