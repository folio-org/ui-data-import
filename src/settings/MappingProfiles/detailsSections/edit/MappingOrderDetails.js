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

import { TRANSLATION_ID_PREFIX } from '../constants';
import {
  getFieldValueFromDetails,
  getBoolFieldValueFromDetails,
} from '../utils';
import {
  ACCESS_PROVIDER_FIELD,
  ACTIVATION_STATUS_FIELD,
  APPROVED_FIELD,
  ASSIGNED_TO_FIELD,
  AUTOMATIC_EXPORT_FIELD,
  CURRENCY_FIELD,
  MANUAL_PO_FIELD,
  MATERIAL_SUPPLIER_FIELD,
  TRIAL_FIELD,
  USE_EXCHANGE_RATE_FIELD,
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

  const notes = referenceTables?.notes || [];
  const contributors = referenceTables?.contributors || [];
  const productIds = referenceTables?.productIds || [];
  const vendorRefNumbers = referenceTables?.vendorDetail || [];
  const fundDistributions = referenceTables?.fundDistribution || [];
  const locations = referenceTables?.locations || [];
  const volumes = referenceTables?.volumes || [];
  const approvedCheckbox = getBoolFieldValueFromDetails(mappingDetails?.mappingFields, APPROVED_FIELD);
  const manualPOCheckbox = getBoolFieldValueFromDetails(mappingDetails?.mappingFields, MANUAL_PO_FIELD);
  const automaticExportCheckbox = getBoolFieldValueFromDetails(mappingDetails?.mappingFields, AUTOMATIC_EXPORT_FIELD);
  const activationStatusCheckbox = getBoolFieldValueFromDetails(mappingDetails?.mappingFields, ACTIVATION_STATUS_FIELD);
  const trialCheckbox = getBoolFieldValueFromDetails(mappingDetails?.mappingFields, TRIAL_FIELD);
  const currencyFromDetails = getFieldValueFromDetails(mappingDetails?.mappingFields, CURRENCY_FIELD);
  const filledVendorId = getFieldValueFromDetails(mappingDetails?.mappingFields, VENDOR_FIELD);
  const assignedToId = getFieldValueFromDetails(mappingDetails?.mappingFields, ASSIGNED_TO_FIELD);
  const materialSupplierId = getFieldValueFromDetails(mappingDetails?.mappingFields, MATERIAL_SUPPLIER_FIELD);
  const accessProviderId = getFieldValueFromDetails(mappingDetails?.mappingFields, ACCESS_PROVIDER_FIELD);
  const useSetExchangeFromDetails = getBoolFieldValueFromDetails(mappingDetails?.mappingFields, USE_EXCHANGE_RATE_FIELD);
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
        manualPOCheckbox={manualPOCheckbox}
        notes={notes}
        filledVendorId={filledVendorId}
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
          useSetExchange={useSetExchangeFromDetails}
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
