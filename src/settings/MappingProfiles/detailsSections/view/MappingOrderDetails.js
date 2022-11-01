import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
} from '@folio/stripes/components';

import {
  OrderInformation,
  OrderDetails,
  POLineDetails,
  Vendor,
  CostDetails,
  FundDistribution,
  Location,
  PhysicalResourceDetails,
  EResourcesDetails,
} from './OrderDetailsSection';

import { mappingProfileFieldShape } from '../../../../utils';
import { TRANSLATION_ID_PREFIX } from '../constants';
import { getFieldValue } from '../utils';

export const MappingOrderDetails = ({ mappingDetails }) => {
  const vendorId = getFieldValue(mappingDetails, 'vendor', 'value').replace(/['"]+/g, '');

  return (
    <AccordionSet>
      <OrderInformation
        mappingDetails={mappingDetails}
        vendorId={vendorId}
      />
      <Accordion
        id="view-order-line-information"
        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderLineInformation.section`} />}
      >
        <OrderDetails mappingDetails={mappingDetails} />
        <POLineDetails mappingDetails={mappingDetails} />
        <Vendor mappingDetails={mappingDetails} />
        <CostDetails mappingDetails={mappingDetails} />
        <FundDistribution mappingDetails={mappingDetails} />
        <Location mappingDetails={mappingDetails} />
        <PhysicalResourceDetails mappingDetails={mappingDetails} />
        <EResourcesDetails mappingDetails={mappingDetails} />
      </Accordion>
    </AccordionSet>
  );
};

MappingOrderDetails.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
