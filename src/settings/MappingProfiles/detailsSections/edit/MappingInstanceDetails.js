import React from 'react';
import { get } from 'lodash';

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
} from './InstanceDetailsSections';

export const MappingInstanceDetails = ({
  initialFields,
  referenceTables,
  setReferenceTables,
  okapi,
}) => {
  const statisticalCodes = get(referenceTables, 'statisticalCodeIds', []);
  const alternativeTitles = get(referenceTables, 'alternativeTitles', []);
  const seriesStatements = get(referenceTables, 'series', []);
  const precedingTitles = get(referenceTables, 'precedingTitles', []);
  const succeedingTitles = get(referenceTables, 'succeedingTitles', []);
  const identifiers = get(referenceTables, 'identifiers', []);
  const contributors = get(referenceTables, 'contributors', []);
  const publications = get(referenceTables, 'publication', []);
  const editions = get(referenceTables, 'editions', []);
  const physicalDescriptions = get(referenceTables, 'physicalDescriptions', []);
  const natureOfContentTermIds = get(referenceTables, 'natureOfContentTermIds', []);
  const instanceFormatIds = get(referenceTables, 'instanceFormatIds', []);
  const languages = get(referenceTables, 'languages', []);
  const publicationFrequency = get(referenceTables, 'publicationFrequency', []);
  const publicationRange = get(referenceTables, 'publicationRange', []);
  const notes = get(referenceTables, 'notes', []);
  const electronicAccess = get(referenceTables, 'electronicAccess', []);
  const subjects = get(referenceTables, 'subjects', []);
  const classifications = get(referenceTables, 'classifications', []);
  const parentInstances = get(referenceTables, 'parentInstances', []);
  const childInstances = get(referenceTables, 'childInstances', []);

  return (
    <AccordionSet>
      <AdministrativeData
        statisticalCodes={statisticalCodes}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <TitleData
        alternativeTitles={alternativeTitles}
        seriesStatements={seriesStatements}
        precedingTitles={precedingTitles}
        succeedingTitles={succeedingTitles}
      />
      <Identifier
        identifiers={identifiers}
      />
      <Contributor
        contributors={contributors}
      />
      <DescriptiveData
        publications={publications}
        editions={editions}
        physicalDescriptions={physicalDescriptions}
        natureOfContentTermIds={natureOfContentTermIds}
        languages={languages}
        instanceFormatIds={instanceFormatIds}
        publicationFrequency={publicationFrequency}
        publicationRange={publicationRange}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <InstanceNotes
        notes={notes}
      />
      <ElectronicAccess
        electronicAccess={electronicAccess}
        okapi={okapi}
      />
      <Subject
        subjects={subjects}
      />
      <Classification
        classifications={classifications}
      />
      <InstanceRelationship
        parentInstances={parentInstances}
        childInstances={childInstances}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <RelatedInstances />
    </AccordionSet>
  );
};
