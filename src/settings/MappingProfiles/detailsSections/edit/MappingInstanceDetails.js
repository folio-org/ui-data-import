import React from 'react';
import { FormattedMessage } from 'react-intl';
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
} from './InstanceDetailsSections';

import {
  mappingInstanceInitialFieldsShape,
  mappingInstanceRefTablesShape,
  okapiShape,
} from '../../../../utils';

export const MappingInstanceDetails = ({
  initialFields,
  referenceTables,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
}) => {
  const statisticalCodes = referenceTables?.statisticalCodeIds || [];
  const administrativeNotes = referenceTables?.administrativeNotes || [];
  const alternativeTitles = referenceTables?.alternativeTitles || [];
  const seriesStatements = referenceTables?.series || [];
  const precedingTitles = referenceTables?.precedingTitles || [];
  const succeedingTitles = referenceTables?.succeedingTitles || [];
  const identifiers = referenceTables?.identifiers || [];
  const contributors = referenceTables?.contributors || [];
  const publications = referenceTables?.publication || [];
  const editions = referenceTables?.editions || [];
  const physicalDescriptions = referenceTables?.physicalDescriptions || [];
  const natureOfContentTermIds = referenceTables?.natureOfContentTermIds || [];
  const instanceFormatIds = referenceTables?.instanceFormatIds || [];
  const languages = referenceTables?.languages || [];
  const publicationFrequency = referenceTables?.publicationFrequency || [];
  const publicationRange = referenceTables?.publicationRange || [];
  const notes = referenceTables?.notes || [];
  const electronicAccess = referenceTables?.electronicAccess || [];
  const subjects = referenceTables?.subjects || [];
  const classifications = referenceTables?.classifications || [];
  const parentInstances = referenceTables?.parentInstances || [];
  const childInstances = referenceTables?.childInstances || [];

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <FormattedMessage id="ui-data-import.settings.mappingProfiles.map.instance.subheader" />
      </div>
      <AccordionSet>
        <AdministrativeData
          statisticalCodes={statisticalCodes}
          administrativeNotes={administrativeNotes}
          getRepeatableFieldAction={getRepeatableFieldAction}
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <TitleData
          alternativeTitles={alternativeTitles}
          getRepeatableFieldAction={getRepeatableFieldAction}
          setReferenceTables={setReferenceTables}
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
          getRepeatableFieldAction={getRepeatableFieldAction}
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
          getRepeatableFieldAction={getRepeatableFieldAction}
          childInstances={childInstances}
          initialFields={initialFields}
          setReferenceTables={setReferenceTables}
          okapi={okapi}
        />
        <RelatedInstances />
      </AccordionSet>
    </>
  );
};

MappingInstanceDetails.propTypes = {
  initialFields: mappingInstanceInitialFieldsShape.isRequired,
  referenceTables: mappingInstanceRefTablesShape.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
