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

export const MappingItemDetails = ({
  initialFields,
  referenceTables,
  setReferenceTables,
  okapi,
}) => {
  const formerIds = referenceTables?.formerIds || [];
  const statisticalCodeIds = referenceTables?.statisticalCodeIds || [];
  const yearCaption = referenceTables?.yearCaption || [];
  const notes = referenceTables?.notes || [];
  const circulationNotes = referenceTables?.circulationNotes || [];
  const electronicAccess = referenceTables?.electronicAccess || [];

  return (
    <AccordionSet>
      <AdministrativeData
        formerIds={formerIds}
        statisticalCodeIds={statisticalCodeIds}
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
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
      />
      <Condition okapi={okapi} />
      <ItemNotes
        notes={notes}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <LoanAndAvailability
        circulationNotes={circulationNotes}
        initialFields={initialFields}
        setReferenceTables={setReferenceTables}
        okapi={okapi}
      />
      <Location okapi={okapi} />
      <ElectronicAccess
        electronicAccess={electronicAccess}
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
  okapi: okapiShape.isRequired,
};
