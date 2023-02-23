import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Accordion,
} from '@folio/stripes/components';

import {
  OrderInformation,
  ItemDetails,
  POLineDetails,
  Vendor,
  CostDetails,
  FundDistribution,
  Location,
  PhysicalResourceDetails,
  EResourcesDetails,
} from './OrderDetailSection';

import {
  TRANSLATION_ID_PREFIX,
  UUID_IN_QUOTES_PATTERN,
} from '../constants';
import {
  getRefValuesFromTables,
  getFieldValueFromDetails,
  getBoolFieldValueFromDetails,
} from '../utils';
import {
  ACCESS_PROVIDER_FIELD,
  ACTIVATION_STATUS_FIELD,
  APPROVED_FIELD,
  ASSIGNED_TO_FIELD,
  AUTOMATIC_EXPORT_FIELD,
  BILL_TO_FIELD,
  CURRENCY_FIELD,
  MANUAL_PO_FIELD,
  MATERIAL_SUPPLIER_FIELD,
  SET_EXCHANGE_RATE_FIELD,
  SHIP_TO_FIELD,
  TRIAL_FIELD,
  VENDOR_FIELD,
} from '../../../../utils';

export const MappingOrderDetails = ({
  mappingDetails,
  initialFields,
  referenceTables,
  setReferenceTables,
  okapi,
}) => {
  const [vendorAccountNumbers, setVendorAccountNumbers] = useState([]);

  const billToValue = getFieldValueFromDetails(mappingDetails?.mappingFields, BILL_TO_FIELD);
  const shipToValue = getFieldValueFromDetails(mappingDetails?.mappingFields, SHIP_TO_FIELD);

  const notes = getRefValuesFromTables(referenceTables, 'notes');
  const contributors = getRefValuesFromTables(referenceTables, 'contributors');
  const productIds = getRefValuesFromTables(referenceTables, 'productIds');
  const vendorRefNumbers = getRefValuesFromTables(referenceTables, 'vendorDetail');
  const fundDistributions = getRefValuesFromTables(referenceTables, 'fundDistribution');
  const locations = getRefValuesFromTables(referenceTables, 'locations');
  const volumes = getRefValuesFromTables(referenceTables, 'volumes');

  const approvedCheckbox = getBoolFieldValueFromDetails(mappingDetails?.mappingFields, APPROVED_FIELD);
  const manualPOCheckbox = getBoolFieldValueFromDetails(mappingDetails?.mappingFields, MANUAL_PO_FIELD);
  const automaticExportCheckbox = getBoolFieldValueFromDetails(mappingDetails?.mappingFields, AUTOMATIC_EXPORT_FIELD);
  const activationStatusCheckbox = getBoolFieldValueFromDetails(mappingDetails?.mappingFields, ACTIVATION_STATUS_FIELD);
  const trialCheckbox = getBoolFieldValueFromDetails(mappingDetails?.mappingFields, TRIAL_FIELD);

  const setExchangeRateValue = getFieldValueFromDetails(mappingDetails?.mappingFields, SET_EXCHANGE_RATE_FIELD);
  const currencyFromDetails = getFieldValueFromDetails(mappingDetails?.mappingFields, CURRENCY_FIELD);
  const vendorFromDetails = getFieldValueFromDetails(mappingDetails?.mappingFields, VENDOR_FIELD, false);
  const vendorIdMatch = vendorFromDetails?.match(UUID_IN_QUOTES_PATTERN);
  const filledVendorId = vendorIdMatch ? vendorIdMatch[1] : null;
  const mapping = vendorFromDetails?.substring(0, vendorFromDetails.indexOf('"'));
  const assignedToId = getFieldValueFromDetails(mappingDetails?.mappingFields, ASSIGNED_TO_FIELD);
  const materialSupplierFromDetails = getFieldValueFromDetails(mappingDetails?.mappingFields, MATERIAL_SUPPLIER_FIELD, false);
  const materialSupplierMatch = materialSupplierFromDetails?.match(UUID_IN_QUOTES_PATTERN);
  const materialSupplierId = materialSupplierMatch ? materialSupplierMatch[1] : null;
  const accessProviderFromDetails = getFieldValueFromDetails(mappingDetails?.mappingFields, ACCESS_PROVIDER_FIELD, false);
  const accessProviderMatch = accessProviderFromDetails?.match(UUID_IN_QUOTES_PATTERN);
  const accessProviderId = accessProviderMatch ? accessProviderMatch[1] : null;

  const onOrganizationSelect = organization => {
    if (organization?.accounts?.length) {
      const accountNumbers = organization.accounts.map(account => account.accountNo);

      setVendorAccountNumbers(accountNumbers);
    }
  };

  return (
    <AccordionSet>
      <OrderInformation
        approvedCheckbox={approvedCheckbox}
        billToValue={billToValue}
        shipToValue={shipToValue}
        manualPOCheckbox={manualPOCheckbox}
        notes={notes}
        filledVendorId={filledVendorId}
        mappingValue={mapping}
        assignedToId={assignedToId}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        onOrganizationSelect={onOrganizationSelect}
        okapi={okapi}
      />
      <Accordion
        id="order-line-information"
        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderLineInformation.section`} />}
      >
        <ItemDetails
          contributors={contributors}
          productIdentifiers={productIds}
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <POLineDetails
          automaticExportCheckbox={automaticExportCheckbox}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <Vendor
          vendorRefNumbers={vendorRefNumbers}
          accountNumbers={vendorAccountNumbers}
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <CostDetails
          currency={currencyFromDetails}
          setExchangeRateValue={setExchangeRateValue}
          setReferenceTables={setReferenceTables}
        />
        <FundDistribution
          fundDistributions={fundDistributions}
          currency={currencyFromDetails}
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <Location
          locations={locations}
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <PhysicalResourceDetails
          volumes={volumes}
          materialSupplierId={materialSupplierId}
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <EResourcesDetails
          activationStatusCheckbox={activationStatusCheckbox}
          trialCheckbox={trialCheckbox}
          accessProviderId={accessProviderId}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
      </Accordion>
    </AccordionSet>
  );
};

MappingOrderDetails.propTypes = {
  initialFields: PropTypes.object.isRequired,
  referenceTables: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.object.isRequired,
  mappingDetails: PropTypes.object,
};

MappingOrderDetails.defaultProps = { mappingDetails: {} };
