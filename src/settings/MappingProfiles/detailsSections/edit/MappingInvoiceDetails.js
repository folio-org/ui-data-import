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
  mappingItemInitialFieldsShape,
  mappingItemRefTablesShape,
  okapiShape,
  CURRENCY_FIELD,
  VENDOR_ID_FIELD,
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
  getRepeatableFieldAction,
  okapi,
}) => {
  const [selectedVendor, setSelectedVendor] = useState({});
  const [accountingCodeOptions, setAccountingCodeOptions] = useState([]);
  const [accountingNumberOptions, setAccountingNumberOptions] = useState([]);

  const adjustments = referenceTables?.adjustments || [];
  const fundDistributions = referenceTables?.fundDistributions || [];
  const lineAdjustments = referenceTables?.lineAdjustments || [];
  const currencyFromDetails = getFieldValueFromDetails(mappingDetails?.mappingFields, CURRENCY_FIELD);
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
      <VendorInformation
        filledVendorId={filledVendorId}
        setReferenceTables={setReferenceTables}
        accountingCodeOptions={accountingCodeOptions}
        onSelectVendor={selectVendor}
        okapi={okapi}
      />
      <ExtendedInformation
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <InvoiceLineInformation
        okapi={okapi}
        accountingNumberOptions={accountingNumberOptions}
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
