import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet } from '@folio/stripes/components';

import { OrderInformation } from './OrderDetailsSection/OrderInformation';
import { OrderDetails } from './OrderDetailsSection/OrderDetails';
import { POLineDetails } from './OrderDetailsSection/POLineDetails';
import { Vendor } from './OrderDetailsSection/Vendor';
import { CostDetails } from './OrderDetailsSection/CostDetails';
import { FundDistribution } from './OrderDetailsSection/FundDistribution';
import { Location } from './OrderDetailsSection/Location';
import { PhysicalResourceDetails } from './OrderDetailsSection/PhysicalResourceDetails';
import { EResourcesDetails } from './OrderDetailsSection/EResourcesDetails';

import { mappingProfileFieldShape } from '../../../../utils';
import { TRANSLATION_ID_PREFIX } from '../constants';

export const MappingOrderDetails = ({ mappingDetails }) => {
  return (
    <AccordionSet>
      <OrderInformation mappingDetails={mappingDetails} />
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
