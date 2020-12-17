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
  CURRENCY_FIELD,
} from '../../../../utils';

export const MappingInvoiceDetails = ({
  mappingDetails,
  initialFields,
  referenceTables,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
}) => {
  const adjustments = referenceTables?.adjustments || [];
  const fundDistributions = referenceTables?.fundDistributions || [];
  const lineAdjustments = referenceTables?.lineAdjustments || [];
  const currencyFromDetails = mappingDetails
    ?.mappingFields
    ?.find(item => (item.name === CURRENCY_FIELD))?.value
    .replace(/['"]+/g, '');

  return (
    <AccordionSet>
      <InvoiceInformation
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <InvoiceAdjustments
        adjustments={adjustments}
        currency={currencyFromDetails}
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
        currency={currencyFromDetails}
        initialFields={initialFields}
        getRepeatableFieldAction={getRepeatableFieldAction}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <InvoiceLineAdjustments
        lineAdjustments={lineAdjustments}
        currency={currencyFromDetails}
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
  mappingDetails: PropTypes.object,
};
