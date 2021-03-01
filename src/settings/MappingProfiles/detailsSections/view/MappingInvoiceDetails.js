import React from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';

import {
  InvoiceAdjustments,
  InvoiceInformation,
  VendorInformation,
  ExtendedInformation,
  InvoiceLineInformation,
  InvoiceLineFundDistribution,
  InvoiceLineAdjustments,
} from './InvoiceDetailsSection';

import { mappingProfileFieldShape } from '../../../../utils';
import { getFieldValue } from '../utils';

export const MappingInvoiceDetails = ({ mappingDetails }) => {
  const invoiceLineMappingDetails = getFieldValue(mappingDetails, 'invoiceLines', 'subfields')?.[0]?.fields;

  return (
    <AccordionSet>
      <InvoiceInformation mappingDetails={mappingDetails} />
      <InvoiceAdjustments mappingDetails={mappingDetails} />
      <VendorInformation
        mappingDetails={mappingDetails}
        vendorId={getFieldValue(mappingDetails, 'vendorId', 'value')}
      />
      <ExtendedInformation mappingDetails={mappingDetails} />
      <InvoiceLineInformation invoiceLineMappingDetails={invoiceLineMappingDetails} />
      <InvoiceLineFundDistribution
        mappingDetails={mappingDetails}
        invoiceLineMappingDetails={invoiceLineMappingDetails}
      />
      <InvoiceLineAdjustments
        mappingDetails={mappingDetails}
        invoiceLineMappingDetails={invoiceLineMappingDetails}
      />
    </AccordionSet>
  );
};

MappingInvoiceDetails.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
