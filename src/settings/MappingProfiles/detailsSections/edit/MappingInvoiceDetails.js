import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

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
  VENDOR_ID_FIELD,
} from '../../../../utils';

import {
  getFieldName,
  getAccountingCodeOptions,
  getAccountingNumberOptions,
  getFieldEnabled,
  getSubfieldName,
} from '../utils';
import {
  useFieldMappingValueFromLookup,
  useOrganizationValue,
} from '../hooks';

export const MappingInvoiceDetails = ({
  mappingDetails,
  initialFields,
  setReferenceTables,
  getMappingSubfieldsFieldValue,
  okapi,
}) => {
  const [selectedVendor, setSelectedVendor] = useState({});
  const [accountingCodeOptions, setAccountingCodeOptions] = useState([]);
  const [accountingNumberOptions, setAccountingNumberOptions] = useState([]);

  const [filledVendorId] = useFieldMappingValueFromLookup(VENDOR_ID_FIELD);
  const { organization } = useOrganizationValue(filledVendorId ? `"${filledVendorId}"` : '');

  useEffect(() => {
    if (!isEmpty(organization)) {
      setAccountingCodeOptions(getAccountingCodeOptions(organization));
      setAccountingNumberOptions(getAccountingNumberOptions(organization));
    }
  }, [organization]);

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
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <InvoiceAdjustments
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
        setReferenceTables={setReferenceTables}
        mappingFields={mappingDetails?.mappingFields}
        okapi={okapi}
      />
      <InvoiceLineInformation
        invoiceLinesFieldIndex={INVOICE_LINES_FIELD_INDEX}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
        accountingNumberOptions={accountingNumberOptions}
        mappingFields={mappingDetails?.mappingFields}
      />
      <InvoiceLineFundDistribution
        invoiceLinesFieldIndex={INVOICE_LINES_FIELD_INDEX}
        initialFields={initialFields}
        getMappingSubfieldsFieldValue={getMappingSubfieldsFieldValue}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <InvoiceLineAdjustments
        invoiceLinesFieldIndex={INVOICE_LINES_FIELD_INDEX}
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
  setReferenceTables: PropTypes.func.isRequired,
  getMappingSubfieldsFieldValue: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  mappingDetails: PropTypes.object,
};
