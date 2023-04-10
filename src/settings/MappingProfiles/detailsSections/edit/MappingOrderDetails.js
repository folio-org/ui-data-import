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

export const MappingOrderDetails = ({
  initialFields,
  setReferenceTables,
  okapi,
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
      />
      <Accordion
        id="order-line-information"
        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderLineInformation.section`} />}
      >
        <ItemDetails
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <POLineDetails
          setReferenceTables={setReferenceTables}
          okapi={okapi}
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
        />
        <Location
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <PhysicalResourceDetails
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <EResourcesDetails
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
      </Accordion>
    </AccordionSet>
  );
};

MappingOrderDetails.propTypes = {
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.object.isRequired,
};
