import React from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';

import {
  InvoiceInformation,
  InvoiceAdjustments,
  VendorInformation,
  ExtendedInformation,
  InvoiceLineInformation,
  InvoiceLineFundDistribution,
  InvoiceLineAdjustments,
} from './InvoiceDetailSection';

import {
  mappingItemInitialFieldsShape,
  mappingItemRefTablesShape,
  okapiShape,
} from '../../../../utils';

export const MappingInvoiceDetails = ({
  initialFields,
  referenceTables,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
}) => {
  const adjustments = referenceTables?.adjustments || [];
  const fundDistributions = referenceTables?.fundDistributions || [];
  const lineAdjustments = referenceTables?.lineAdjustments || [];

  return (
    <AccordionSet>
      <InvoiceInformation
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <InvoiceAdjustments
        adjustments={adjustments}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <VendorInformation />
      <ExtendedInformation
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <InvoiceLineInformation
        okapi={okapi}
      />
      <InvoiceLineFundDistribution
        fundDistributions={fundDistributions}
        initialFields={initialFields}
        getRepeatableFieldAction={getRepeatableFieldAction}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <InvoiceLineAdjustments
        lineAdjustments={lineAdjustments}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
    </AccordionSet>
  );
};

MappingInvoiceDetails.propTypes = {
  initialFields: mappingItemInitialFieldsShape.isRequired,
  referenceTables: mappingItemRefTablesShape.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
