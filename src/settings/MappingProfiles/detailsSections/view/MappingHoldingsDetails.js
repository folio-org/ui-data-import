import React from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';

import {
  AdministrativeData,
  Location,
  HoldingsDetails,
  HoldingsNotes,
  ElectronicAccess,
  ReceivingHistory,
} from './HoldingsDetailsSections';

import { mappingProfileFieldShape } from '../../../../utils';

export const MappingHoldingsDetails = ({ mappingDetails }) => {
  return (
    <AccordionSet>
      <AdministrativeData mappingDetails={mappingDetails} />
      <Location mappingDetails={mappingDetails} />
      <HoldingsDetails mappingDetails={mappingDetails} />
      <HoldingsNotes mappingDetails={mappingDetails} />
      <ElectronicAccess mappingDetails={mappingDetails} />
      <ReceivingHistory mappingDetails={mappingDetails} />
    </AccordionSet>
  );
};

MappingHoldingsDetails.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
