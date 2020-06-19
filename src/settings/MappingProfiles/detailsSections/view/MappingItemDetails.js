import React from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';

import {
  AdministrativeData,
  ItemData,
  EnumerationData,
  Condition,
  ItemNotes,
  LoanAndAvailability,
  Location,
  ElectronicAccess,
} from './ItemDetailSection';

import { mappingProfileFieldShape } from '../../../../utils';

export const MappingItemDetails = ({ mappingDetails }) => {
  return (
    <AccordionSet>
      <AdministrativeData mappingDetails={mappingDetails} />
      <ItemData mappingDetails={mappingDetails} />
      <EnumerationData mappingDetails={mappingDetails} />
      <Condition mappingDetails={mappingDetails} />
      <ItemNotes mappingDetails={mappingDetails} />
      <LoanAndAvailability mappingDetails={mappingDetails} />
      <Location mappingDetails={mappingDetails} />
      <ElectronicAccess mappingDetails={mappingDetails} />
    </AccordionSet>
  );
};

MappingItemDetails.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
