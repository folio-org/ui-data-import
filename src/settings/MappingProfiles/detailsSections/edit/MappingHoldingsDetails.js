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

import {
  mappingHoldingsInitialFieldsShape,
  mappingHoldingsRefTablesShape,
  okapiShape,
} from '../../../../utils';
import { getRefValuesFromTables } from '../utils';

export const MappingHoldingsDetails = ({
  initialFields,
  referenceTables,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
  requestLimit,
}) => {
  const formerIds = getRefValuesFromTables(referenceTables, 'formerIds');
  const statisticalCodeIds = getRefValuesFromTables(referenceTables, 'statisticalCodeIds');
  const administrativeNotes = getRefValuesFromTables(referenceTables, 'administrativeNotes');
  const holdingsStatements = getRefValuesFromTables(referenceTables, 'holdingsStatements');
  const holdingsStatementsForSupplements = getRefValuesFromTables(referenceTables, 'holdingsStatementsForSupplements');
  const holdingsStatementsForIndexes = getRefValuesFromTables(referenceTables, 'holdingsStatementsForIndexes');
  const notes = getRefValuesFromTables(referenceTables, 'notes');
  const electronicAccess = getRefValuesFromTables(referenceTables, 'electronicAccess');
  const receivingHistory = getRefValuesFromTables(referenceTables, 'receivingHistory.entries');

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
        requestLimit={requestLimit}
      />
      <Location
        setReferenceTables={setReferenceTables}
        okapi={okapi}
        requestLimit={requestLimit}
      />
      <HoldingsDetails
        holdingsStatements={holdingsStatements}
        getRepeatableFieldAction={getRepeatableFieldAction}
        holdingsStatementsForSupplements={holdingsStatementsForSupplements}
        holdingsStatementsForIndexes={holdingsStatementsForIndexes}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
        requestLimit={requestLimit}
      />
      <HoldingsNotes
        notes={notes}
        getRepeatableFieldAction={getRepeatableFieldAction}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
        requestLimit={requestLimit}
      />
      <ElectronicAccess
        electronicAccess={electronicAccess}
        getRepeatableFieldAction={getRepeatableFieldAction}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
        requestLimit={requestLimit}
      />
      <ReceivingHistory
        receivingHistory={receivingHistory}
        getRepeatableFieldAction={getRepeatableFieldAction}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
      />
    </AccordionSet>
  );
};

MappingHoldingsDetails.propTypes = {
  initialFields: mappingHoldingsInitialFieldsShape.isRequired,
  referenceTables: mappingHoldingsRefTablesShape.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  requestLimit: PropTypes.number,
};
