import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../../test/jest/helpers';

import { MappingInvoiceDetails } from '../MappingInvoiceDetails';

const mappingDetailsProp = [
  {
    enabled: 'true',
    name: 'invoiceDate',
    path: 'invoice.invoiceDate',
    subfields: [],
  },
  {
    enabled: 'true',
    name: 'status',
    path: 'invoice.status',
    subfields: [],
    value: '"Open"',
  },
  {
    enabled: 'true',
    name: 'vendorId',
    path: 'invoice.vendorId',
    subfields: [],
    value: '',
  },
  {
    enabled: 'true',
    name: 'invoiceLines',
    path: 'invoice.invoiceLines[]',
    repeatableFieldAction: 'EXTEND_EXISTING',
    subfields: [{
      fields: [],
      order: 0,
      path: 'invoice.invoiceLines[]',
    }],
    value: '',
  },
  {
    enabled: 'true',
    name: 'adjustments',
    path: 'invoice.adjustments[]',
    subfields: [{
      order: 1,
      path: 'invoice.adjustments[]',
      fields: [{
        name: 'description',
        value: 'a',
        order: 0,
      }, {
        name: 'value',
        value: 'b',
      }, {
        name: 'relationToTotal',
        value: '',
      }, {
        name: 'exportToAccounting',
        booleanFieldAction: 'ALL_TRUE',
      }, {
        name: 'fundDistributions',
        subfields: [{
          order: 0,
          path: 'fundDistributions',
          fields: [{
            name: 'fundId',
            value: '',
          }],
        }, {
          order: 1,
          path: 'fundDistributions',
          fields: [{
            name: 'expenseClassId',
            value: '',
          }],
        }, {
          order: 2,
          path: 'fundDistributions',
          fields: [{
            name: 'amount',
            value: '',
          }],
        }, {
          order: 3,
          path: 'fundDistributions',
          fields: [{
            name: 'value',
            value: 'testValue',
          }],
        }, {
          order: 4,
          path: 'fundDistributions',
          fields: [{
            name: 'distributionType',
            value: '',
          }],
        }],
      }, {
        name: 'type',
        value: '',
      }, {
        name: 'prorate',
        value: '',
      }],
    }],
    value: '',
  }, {
    enabled: 'true',
    name: 'currency',
    path: 'invoice.currency',
    subfields: [],
    value: 'CUX+2[2]',
  }, {
    enabled: 'true',
    name: 'invoiceLines',
    path: 'invoice.invoiceLines[]',
    subfields: [{
      fields: [],
      order: 0,
      path: 'invoice.invoiceLines[]',
    }],
  }];

const renderMappingInvoiceDetails = () => {
  const component = (
    <MappingInvoiceDetails mappingDetails={mappingDetailsProp} />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MappingInvoiceDetails view component', () => {
  // TODO: Create separate ticket to fix all the accesibility tests
  it.skip('should be rendered with no axe errors', async () => {
    const { container } = renderMappingInvoiceDetails();

    await runAxeTest({ rootNode: container });
  });

  it('should have correct sections', () => {
    const { getByRole } = renderMappingInvoiceDetails();

    expect(getByRole('button', { name: /invoice information/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /invoice adjustments/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /vendor information/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /extended information/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /invoice line information/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /invoice line fund distribution/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /invoice line adjustments/i })).toBeInTheDocument();
  });

  it('All sections are expanded by default', () => {
    const { getByRole } = renderMappingInvoiceDetails();

    expect(getByRole('button', { name: /invoice information/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /invoice adjustments/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /vendor information/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /extended information/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /invoice line information/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /invoice line fund distribution/i })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: /invoice line adjustments/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('User can collapse sections', () => {
    const { getByRole } = renderMappingInvoiceDetails();

    fireEvent.click(getByRole('button', { name: /invoice information/i }));
    fireEvent.click(getByRole('button', { name: /invoice adjustments/i }));
    fireEvent.click(getByRole('button', { name: /vendor information/i }));
    fireEvent.click(getByRole('button', { name: /extended information/i }));
    fireEvent.click(getByRole('button', { name: /invoice line information/i }));
    fireEvent.click(getByRole('button', { name: /invoice line fund distribution/i }));
    fireEvent.click(getByRole('button', { name: /invoice line adjustments/i }));

    expect(getByRole('button', { name: /invoice information/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /invoice adjustments/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /vendor information/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /extended information/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /invoice line information/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /invoice line fund distribution/i })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('button', { name: /invoice line adjustments/i })).toHaveAttribute('aria-expanded', 'false');
  });
});
