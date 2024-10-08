import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
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
} from './OrderDetailsSection';

import { mappingProfileFieldShape } from '../../../../utils';
import { TRANSLATION_ID_PREFIX } from '../constants';
import { getFieldValue } from '../utils';

export const MappingOrderDetails = ({ mappingDetails }) => {
  const vendorId = getFieldValue(mappingDetails, 'vendor', 'value');
  const userId = getFieldValue(mappingDetails, 'assignedTo', 'value').replace(/['"]+/g, '');
  const materialSupplierId = getFieldValue(mappingDetails, 'materialSupplier', 'value');
  const accessProviderId = getFieldValue(mappingDetails, 'accessProvider', 'value');

  return (
    <AccordionSet>
      <OrderInformation
        mappingDetails={mappingDetails}
        vendorId={vendorId}
        userId={userId}
      />
      <Accordion
        id="view-order-line-information"
        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderLineInformation.section`} />}
      >
        <ItemDetails mappingDetails={mappingDetails} />
        <POLineDetails mappingDetails={mappingDetails} />
        <DonorInformation mappingDetails={mappingDetails} />
        <Vendor mappingDetails={mappingDetails} />
        <CostDetails mappingDetails={mappingDetails} />
        <FundDistribution mappingDetails={mappingDetails} />
        <Location mappingDetails={mappingDetails} />
        <PhysicalResourceDetails
          mappingDetails={mappingDetails}
          materialSupplierId={materialSupplierId}
        />
        <EResourcesDetails
          mappingDetails={mappingDetails}
          accessProviderId={accessProviderId}
        />
      </Accordion>
    </AccordionSet>
  );
};

MappingOrderDetails.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
