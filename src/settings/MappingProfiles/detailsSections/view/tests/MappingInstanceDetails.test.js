import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';
import '../../../../../../test/jest/__mock__';

import { MappingInstanceDetails } from '../MappingInstanceDetails';

const mappingDetailsProp = [];

const renderMappingInstanceDetails = () => {
  const component = (
    <MappingInstanceDetails mappingDetails={mappingDetailsProp} />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MappingInstanceDetails view component', () => {
  it.skip('should be rendered with no axe errors', async () => {
    const { container } = renderMappingInstanceDetails();

    await runAxeTest({ rootNode: container });
  });

  it('should have correct sections', () => {
    const { getByRole } = renderMappingInstanceDetails();

    expect(getByRole('button', { name: /administrative data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /title data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /identifier/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /contributor/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /descriptive data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /instance notes/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /electronic access/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /subject/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /classification/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /instance relationship/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /related instances/i })).toBeInTheDocument();
  });

  it('All sections are expanded by default', () => {
    const { getByRole } = renderMappingInstanceDetails();

    expect(getByRole('button', { name: /administrative data/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /title data/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /identifier/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /contributor/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /descriptive data/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /instance notes/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /electronic access/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /subject/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /classification/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /instance relationship/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /related instances/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('User can collapse sections', () => {
    const { getByRole } = renderMappingInstanceDetails();

    fireEvent.click(getByRole('button', { name: /administrative data/i }));
    fireEvent.click(getByRole('button', { name: /title data/i }));
    fireEvent.click(getByRole('button', { name: /identifier/i }));
    fireEvent.click(getByRole('button', { name: /contributor/i }));
    fireEvent.click(getByRole('button', { name: /descriptive data/i }));
    fireEvent.click(getByRole('button', { name: /instance notes/i }));
    fireEvent.click(getByRole('button', { name: /electronic access/i }));
    fireEvent.click(getByRole('button', { name: /subject/i }));
    fireEvent.click(getByRole('button', { name: /classification/i }));
    fireEvent.click(getByRole('button', { name: /instance relationship/i }));
    fireEvent.click(getByRole('button', { name: /related instances/i }));

    expect(getByRole('button', { name: /administrative data/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /title data/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /identifier/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /contributor/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /descriptive data/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /instance notes/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /electronic access/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /subject/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /classification/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /instance relationship/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /related instances/i })).toHaveAttribute('aria-expanded', 'false');
  });
});
