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
  EXCHANGE_RATE_FIELD,
} from '../../../../utils';

import {
  getRefValuesFromTables,
  getFieldName,
  getFieldValueFromDetails,
  getAccountingCodeOptions,
  getAccountingNumberOptions,
  getFieldEnabled,
  getSubfieldName,
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

  const vendorReferenceNumbers = getRefValuesFromTables(referenceTables, 'invoiceLines.[0].fields[4].subfields');
  const adjustments = getRefValuesFromTables(referenceTables, 'adjustments');
  const fundDistributions = getRefValuesFromTables(referenceTables, 'invoiceLines.[0].fields[14].subfields');
  const lineAdjustments = getRefValuesFromTables(referenceTables, 'invoiceLines.[0].fields[15].subfields');

  const currencyFromDetails = getFieldValueFromDetails(mappingDetails?.mappingFields, CURRENCY_FIELD);
  const lockTotalFromDetails = getFieldValueFromDetails(mappingDetails?.mappingFields, LOCK_TOTAL_FIELD);
  const exchangeRateFromDetails = getFieldValueFromDetails(mappingDetails?.mappingFields, EXCHANGE_RATE_FIELD);
  const filledVendorId = getFieldValueFromDetails(mappingDetails?.mappingFields, VENDOR_ID_FIELD);

  const ACCOUNTING_CODE_FIELD_INDEX = 18;
  const INVOICE_LINES_FIELD_INDEX = 26;
  const ACCOUNT_NUMBER_FIELD_INDEX = 10;

  const selectVendor = useCallback(vendor => {
    if (selectedVendor?.id !== vendor.id) {
      setSelectedVendor(vendor);
      setAccountingCodeOptions(getAccountingCodeOptions(vendor));
      setAccountingNumberOptions(getAccountingNumberOptions(vendor));

      const erpCode = vendor.erpCode || '';
      const hasAnyAccountingCode = vendor.accounts?.some(({ appSystemNo }) => Boolean(appSystemNo));
      const defaultVendorAccountingCode = !hasAnyAccountingCode ? erpCode : '';

      setReferenceTables(getFieldName(ACCOUNTING_CODE_FIELD_INDEX), defaultVendorAccountingCode ? `"${defaultVendorAccountingCode}"` : '');
      setReferenceTables(getSubfieldName(INVOICE_LINES_FIELD_INDEX, ACCOUNT_NUMBER_FIELD_INDEX, 0), '');

      if (defaultVendorAccountingCode) {
        setReferenceTables(getFieldEnabled(ACCOUNTING_CODE_FIELD_INDEX), true);
      }
    }
  }, [selectedVendor, setReferenceTables]);

  const onClearVendor = () => {
    setSelectedVendor(null);
    setAccountingCodeOptions([]);
    setAccountingNumberOptions([]);

    setReferenceTables(getFieldName(ACCOUNTING_CODE_FIELD_INDEX), '');
    setReferenceTables(getFieldEnabled(ACCOUNTING_CODE_FIELD_INDEX), false);
    setReferenceTables(getSubfieldName(INVOICE_LINES_FIELD_INDEX, ACCOUNT_NUMBER_FIELD_INDEX, 0), '');
  };

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
        onClearVendor={onClearVendor}
        okapi={okapi}
      />
      <ExtendedInformation
        hasExchangeRate={!!exchangeRateFromDetails}
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
