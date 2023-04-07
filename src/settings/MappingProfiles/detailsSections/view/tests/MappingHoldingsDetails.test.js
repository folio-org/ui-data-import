import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';
import '../../../../../../test/jest/__mock__';

import { MappingHoldingsDetails } from '../MappingHoldingsDetails';

const mappingDetailsProp = [];

const renderMappingHoldingsDetails = () => {
  const component = (
    <MappingHoldingsDetails mappingDetails={mappingDetailsProp} />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MappingHoldingsDetails view component', () => {
  // TODO: Create separate ticket to fix all the accesibility tests
  it.skip('should be rendered with no axe errors', async () => {
    const { container } = renderMappingHoldingsDetails();

    await runAxeTest({ rootNode: container });
  });

  it('should have correct sections', () => {
    const { getByRole } = renderMappingHoldingsDetails();

    expect(getByRole('button', { name: /administrative data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /location/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /holdings details/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /holdings notes/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /electronic access/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /receiving history/i })).toBeInTheDocument();
  });

  it('All sections are expanded by default', () => {
    const { getByRole } = renderMappingHoldingsDetails();

    expect(getByRole('button', { name: /administrative data/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /location/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /holdings details/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /holdings notes/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /electronic access/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /receiving history/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('User can collapse sections', () => {
    const { getByRole } = renderMappingHoldingsDetails();

    fireEvent.click(getByRole('button', { name: /administrative data/i }));
    fireEvent.click(getByRole('button', { name: /location/i }));
    fireEvent.click(getByRole('button', { name: /holdings details/i }));
    fireEvent.click(getByRole('button', { name: /holdings notes/i }));
    fireEvent.click(getByRole('button', { name: /electronic access/i }));
    fireEvent.click(getByRole('button', { name: /receiving history/i }));

    expect(getByRole('button', { name: /administrative data/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /location/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /holdings details/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /holdings notes/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /electronic access/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /receiving history/i })).toHaveAttribute('aria-expanded', 'false');
  });
});
