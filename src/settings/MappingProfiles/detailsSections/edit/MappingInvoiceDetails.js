import React, {
  useState,
  useCallback,
} from 'react';
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
  okapiShape,
  CURRENCY_FIELD,
  VENDOR_ID_FIELD,
  LOCK_TOTAL_FIELD,
} from '../../../../utils';

import {
  getFieldName,
  getFieldValueFromDetails,
  getAccountingCodeOptions,
  getAccountingNumberOptions,
} from '../utils';

export const MappingInvoiceDetails = ({
  mappingDetails,
  initialFields,
  referenceTables,
  setReferenceTables,
  getMappingSubfieldsFieldValue,
  okapi,
}) => {
  const [selectedVendor, setSelectedVendor] = useState({});
  const [accountingCodeOptions, setAccountingCodeOptions] = useState([]);
  const [accountingNumberOptions, setAccountingNumberOptions] = useState([]);

  const vendorReferenceNumbers = referenceTables?.invoiceLines?.[0].fields[4]?.subfields || [];
  const adjustments = referenceTables?.adjustments || [];
  const fundDistributions = referenceTables?.invoiceLines?.[0].fields[14]?.subfields || [];
  const lineAdjustments = referenceTables?.invoiceLines?.[0].fields[15]?.subfields || [];
  const currencyFromDetails = getFieldValueFromDetails(mappingDetails?.mappingFields, CURRENCY_FIELD);
  const lockTotalFromDetails = getFieldValueFromDetails(mappingDetails?.mappingFields, LOCK_TOTAL_FIELD);
  const filledVendorId = getFieldValueFromDetails(mappingDetails?.mappingFields, VENDOR_ID_FIELD);

  const selectVendor = useCallback(vendor => {
    if (selectedVendor?.id !== vendor.id) {
      setSelectedVendor(vendor);
      setAccountingCodeOptions(getAccountingCodeOptions(vendor));
      setAccountingNumberOptions(getAccountingNumberOptions(vendor));

      const erpCode = vendor.erpCode || '';
      const hasAnyAccountingCode = vendor.accounts?.some(({ appSystemNo }) => Boolean(appSystemNo));
      const vendorAccountingCode = !hasAnyAccountingCode ? erpCode : '';

      setReferenceTables(getFieldName(18), vendorAccountingCode ? `"${vendorAccountingCode}"` : '');
      setReferenceTables(getFieldName(36), '');
    }
  }, [selectedVendor, setReferenceTables]);

  return (
    <AccordionSet>
      <InvoiceInformation
        hasLockTotal={!!lockTotalFromDetails}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <InvoiceAdjustments
        adjustments={adjustments}
        currency={currencyFromDetails}
        initialFields={initialFields}
        mappingFields={mappingDetails?.mappingFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <VendorInformation
        filledVendorId={filledVendorId}
        setReferenceTables={setReferenceTables}
        accountingCodeOptions={accountingCodeOptions}
        onSelectVendor={selectVendor}
        okapi={okapi}
      />
      <ExtendedInformation
        setReferenceTables={setReferenceTables}
        mappingFields={mappingDetails?.mappingFields}
        okapi={okapi}
      />
      <InvoiceLineInformation
        vendorReferenceNumbers={vendorReferenceNumbers}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
        accountingNumberOptions={accountingNumberOptions}
        mappingFields={mappingDetails?.mappingFields}
      />
      <InvoiceLineFundDistribution
        fundDistributions={fundDistributions}
        currency={currencyFromDetails}
        initialFields={initialFields}
        getMappingSubfieldsFieldValue={getMappingSubfieldsFieldValue}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <InvoiceLineAdjustments
        lineAdjustments={lineAdjustments}
        currency={currencyFromDetails}
        initialFields={initialFields}
        mappingFields={mappingDetails?.mappingFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
    </AccordionSet>
  );
};

MappingInvoiceDetails.propTypes = {
  initialFields: PropTypes.object.isRequired,
  referenceTables: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getMappingSubfieldsFieldValue: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  mappingDetails: PropTypes.object,
};
