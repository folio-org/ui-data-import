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
import { getRefValuesFromTables } from '../utils';

export const MappingInstanceDetails = ({
  initialFields,
  referenceTables,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
}) => {
  const statisticalCodes = getRefValuesFromTables(referenceTables, 'statisticalCodeIds');
  const administrativeNotes = getRefValuesFromTables(referenceTables, 'administrativeNotes');
  const alternativeTitles = getRefValuesFromTables(referenceTables, 'alternativeTitles');
  const seriesStatements = getRefValuesFromTables(referenceTables, 'series');
  const precedingTitles = getRefValuesFromTables(referenceTables, 'precedingTitles');
  const succeedingTitles = getRefValuesFromTables(referenceTables, 'succeedingTitles');
  const identifiers = getRefValuesFromTables(referenceTables, 'identifiers');
  const contributors = getRefValuesFromTables(referenceTables, 'contributors');
  const publications = getRefValuesFromTables(referenceTables, 'publication');
  const editions = getRefValuesFromTables(referenceTables, 'editions');
  const physicalDescriptions = getRefValuesFromTables(referenceTables, 'physicalDescriptions');
  const natureOfContentTermIds = getRefValuesFromTables(referenceTables, 'natureOfContentTermIds');
  const instanceFormatIds = getRefValuesFromTables(referenceTables, 'instanceFormatIds');
  const languages = getRefValuesFromTables(referenceTables, 'languages');
  const publicationFrequency = getRefValuesFromTables(referenceTables, 'publicationFrequency');
  const publicationRange = getRefValuesFromTables(referenceTables, 'publicationRange');
  const notes = getRefValuesFromTables(referenceTables, 'notes');
  const electronicAccess = getRefValuesFromTables(referenceTables, 'electronicAccess');
  const subjects = getRefValuesFromTables(referenceTables, 'subjects');
  const classifications = getRefValuesFromTables(referenceTables, 'classifications');
  const parentInstances = getRefValuesFromTables(referenceTables, 'parentInstances');
  const childInstances = getRefValuesFromTables(referenceTables, 'childInstances');

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
          setReferenceTables={setReferenceTables}
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
          setReferenceTables={setReferenceTables}
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
