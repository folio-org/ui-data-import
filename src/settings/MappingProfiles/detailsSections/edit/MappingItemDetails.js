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

import {
  mappingItemInitialFieldsShape,
  mappingItemRefTablesShape,
  okapiShape,
} from '../../../../utils';
import { getRefValuesFromTables } from '../utils';

export const MappingItemDetails = ({
  initialFields,
  referenceTables,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
}) => {
  const formerIds = getRefValuesFromTables(referenceTables, 'formerIds');
  const statisticalCodeIds = getRefValuesFromTables(referenceTables, 'statisticalCodeIds');
  const administrativeNotes = getRefValuesFromTables(referenceTables, 'administrativeNotes');
  const yearCaption = getRefValuesFromTables(referenceTables, 'yearCaption');
  const notes = getRefValuesFromTables(referenceTables, 'notes');
  const circulationNotes = getRefValuesFromTables(referenceTables, 'circulationNotes');
  const electronicAccess = getRefValuesFromTables(referenceTables, 'electronicAccess');

  return (
    <AccordionSet>
      <AdministrativeData
        formerIds={formerIds}
        statisticalCodeIds={statisticalCodeIds}
        administrativeNotes={administrativeNotes}
        getRepeatableFieldAction={getRepeatableFieldAction}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <ItemData
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <EnumerationData
        yearCaption={yearCaption}
        getRepeatableFieldAction={getRepeatableFieldAction}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
      />
      <Condition
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <ItemNotes
        notes={notes}
        getRepeatableFieldAction={getRepeatableFieldAction}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <LoanAndAvailability
        circulationNotes={circulationNotes}
        getRepeatableFieldAction={getRepeatableFieldAction}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <Location
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <ElectronicAccess
        electronicAccess={electronicAccess}
        getRepeatableFieldAction={getRepeatableFieldAction}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
    </AccordionSet>
  );
};

MappingItemDetails.propTypes = {
  initialFields: mappingItemInitialFieldsShape.isRequired,
  referenceTables: mappingItemRefTablesShape.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
