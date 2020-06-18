import React from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';

import {
  AdministrativeData,
  TitleData,
  Identifier,
  Contributor,
  DescriptiveData,
  InstanceNotes,
  ElectronicAccess,
  Subject,
  Classification,
  InstanceRelationship,
  RelatedInstances,
} from './InstanceDetailsSection';

import { mappingProfileFieldShape } from '../../../../utils';

export const MappingInstanceDetails = ({ mappingDetails }) => {
  return (
    <AccordionSet>
      <AdministrativeData mappingDetails={mappingDetails} />
      <TitleData mappingDetails={mappingDetails} />
      <Identifier mappingDetails={mappingDetails} />
      <Contributor mappingDetails={mappingDetails} />
      <DescriptiveData mappingDetails={mappingDetails} />
      <InstanceNotes mappingDetails={mappingDetails} />
      <ElectronicAccess mappingDetails={mappingDetails} />
      <Subject mappingDetails={mappingDetails} />
      <Classification mappingDetails={mappingDetails} />
      <InstanceRelationship mappingDetails={mappingDetails} />
      <RelatedInstances mappingDetails={mappingDetails} />
    </AccordionSet>
  );
};

MappingInstanceDetails.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape) };
