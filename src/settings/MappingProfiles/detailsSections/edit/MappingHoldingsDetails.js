import React from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';

import {
  AdministrativeData,
  Location,
  HoldingsDetails,
  HoldingsNotes,
  ElectronicAccess,
  Acquisition,
  ReceivingHistory,
} from './HoldingsDetailsSections';

import {
  mappingHoldingsInitialFieldsShape,
  mappingHoldingsRefTablesShape,
  okapiShape,
} from '../../../../utils';

export const MappingHoldingsDetails = ({
  initialFields,
  referenceTables,
  setReferenceTables,
  okapi,
}) => {
  const formerIds = referenceTables?.formerIds || [];
  const statisticalCodeIds = referenceTables?.statisticalCodeIds || [];
  const holdingStatements = referenceTables?.holdingStatements || [];
  const holdingStatementsForSupplements = referenceTables?.holdingStatementsForSupplements || [];
  const holdingStatementsForIndexes = referenceTables?.holdingStatementsForIndexes || [];
  const notes = referenceTables?.notes || [];
  const electronicAccess = referenceTables?.electronicAccess || [];
  const receivingHistory = referenceTables?.['receivingHistory.entries'] || [];

  return (
    <AccordionSet>
      <AdministrativeData
        formerIds={formerIds}
        statisticalCodeIds={statisticalCodeIds}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <Location okapi={okapi} />
      <HoldingsDetails
        holdingStatements={holdingStatements}
        holdingStatementsForSupplements={holdingStatementsForSupplements}
        holdingStatementsForIndexes={holdingStatementsForIndexes}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <HoldingsNotes
        notes={notes}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <ElectronicAccess
        electronicAccess={electronicAccess}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <Acquisition />
      <ReceivingHistory
        receivingHistory={receivingHistory}
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
  okapi: okapiShape.isRequired,
};
