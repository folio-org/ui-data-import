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
  DonorInformation,
} from './OrderDetailSection';

import { TRANSLATION_ID_PREFIX } from '../constants';

export const MappingOrderDetails = ({
  initialFields,
  setReferenceTables,
  okapi,
  requestLimit,
}) => {
  const [vendorAccountNumbers, setVendorAccountNumbers] = useState([]);

  const onOrganizationSelect = organization => {
    if (organization?.accounts?.length) {
      const accountNumbers = organization.accounts.map(account => account.accountNo);

      setVendorAccountNumbers(accountNumbers);
    }
  };

  return (
    <AccordionSet>
      <OrderInformation
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        onOrganizationSelect={onOrganizationSelect}
        okapi={okapi}
        requestLimit={requestLimit}
      />
      <Accordion
        id="order-line-information"
        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderLineInformation.section`} />}
      >
        <ItemDetails
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
          requestLimit={requestLimit}
        />
        <POLineDetails
          setReferenceTables={setReferenceTables}
          okapi={okapi}
          requestLimit={requestLimit}
        />
        <DonorInformation
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
        />
        <Vendor
          accountNumbers={vendorAccountNumbers}
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <CostDetails
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <FundDistribution
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
          requestLimit={requestLimit}
        />
        <Location
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
          requestLimit={requestLimit}
        />
        <PhysicalResourceDetails
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
          requestLimit={requestLimit}
        />
        <EResourcesDetails
          setReferenceTables={setReferenceTables}
          okapi={okapi}
          requestLimit={requestLimit}
        />
      </Accordion>
    </AccordionSet>
  );
};

MappingOrderDetails.propTypes = {
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.object.isRequired,
  requestLimit: PropTypes.number,
};
