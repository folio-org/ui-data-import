import PropTypes from 'prop-types';

import {
  BOOLEAN_ACTIONS,
  REPEATABLE_ACTIONS,
} from '.';

export const mappingProfileSubfieldShape = PropTypes.shape({
  order: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    value: PropTypes.string,
    enabled: PropTypes.bool,
    booleanFieldAction: PropTypes.oneOf(Object.values(BOOLEAN_ACTIONS)),
    repeatableFieldAction: PropTypes.oneOf(Object.values(REPEATABLE_ACTIONS)),
    acceptedValues: PropTypes.object,
  })),
});

export const mappingProfileFieldShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  path: PropTypes.string,
  value: PropTypes.string,
  enabled: PropTypes.bool,
  booleanFieldAction: PropTypes.oneOf(Object.values(BOOLEAN_ACTIONS)),
  repeatableFieldAction: PropTypes.oneOf(Object.values(REPEATABLE_ACTIONS)),
  acceptedValues: PropTypes.object,
  subfields: PropTypes.arrayOf(mappingProfileSubfieldShape),
});

export const mappingInstanceInitialFieldsShape = PropTypes.shape({
  statisticalCodes: mappingProfileSubfieldShape,
  alternativeTitles: mappingProfileSubfieldShape,
  seriesStatements: mappingProfileSubfieldShape,
  precedingTitles: mappingProfileSubfieldShape,
  succeedingTitles: mappingProfileSubfieldShape,
  identifiers: mappingProfileSubfieldShape,
  contributors: mappingProfileSubfieldShape,
  publications: mappingProfileSubfieldShape,
  editions: mappingProfileSubfieldShape,
  physicalDescriptions: mappingProfileSubfieldShape,
  natureOfContentTermIds: mappingProfileSubfieldShape,
  instanceFormatIds: mappingProfileSubfieldShape,
  languages: mappingProfileSubfieldShape,
  publicationFrequency: mappingProfileSubfieldShape,
  publicationRange: mappingProfileSubfieldShape,
  notes: mappingProfileSubfieldShape,
  electronicAccess: mappingProfileSubfieldShape,
  subjects: mappingProfileSubfieldShape,
  classifications: mappingProfileSubfieldShape,
  parentInstances: mappingProfileSubfieldShape,
  childInstances: mappingProfileSubfieldShape,
});

export const mappingInstanceRefTablesShape = PropTypes.shape({
  statisticalCodes: PropTypes.arrayOf(mappingProfileSubfieldShape),
  alternativeTitles: PropTypes.arrayOf(mappingProfileSubfieldShape),
  seriesStatements: PropTypes.arrayOf(mappingProfileSubfieldShape),
  precedingTitles: PropTypes.arrayOf(mappingProfileSubfieldShape),
  succeedingTitles: PropTypes.arrayOf(mappingProfileSubfieldShape),
  identifiers: PropTypes.arrayOf(mappingProfileSubfieldShape),
  contributors: PropTypes.arrayOf(mappingProfileSubfieldShape),
  publications: PropTypes.arrayOf(mappingProfileSubfieldShape),
  editions: PropTypes.arrayOf(mappingProfileSubfieldShape),
  physicalDescriptions: PropTypes.arrayOf(mappingProfileSubfieldShape),
  natureOfContentTermIds: PropTypes.arrayOf(mappingProfileSubfieldShape),
  instanceFormatIds: PropTypes.arrayOf(mappingProfileSubfieldShape),
  languages: PropTypes.arrayOf(mappingProfileSubfieldShape),
  publicationFrequency: PropTypes.arrayOf(mappingProfileSubfieldShape),
  publicationRange: PropTypes.arrayOf(mappingProfileSubfieldShape),
  notes: PropTypes.arrayOf(mappingProfileSubfieldShape),
  electronicAccess: PropTypes.arrayOf(mappingProfileSubfieldShape),
  subjects: PropTypes.arrayOf(mappingProfileSubfieldShape),
  classifications: PropTypes.arrayOf(mappingProfileSubfieldShape),
  parentInstances: PropTypes.arrayOf(mappingProfileSubfieldShape),
  childInstances: PropTypes.arrayOf(mappingProfileSubfieldShape),
});

export const mappingItemInitialFieldsShape = PropTypes.shape({
  formerIds: mappingProfileSubfieldShape,
  statisticalCodeIds: mappingProfileSubfieldShape,
  yearCaption: mappingProfileSubfieldShape,
  notes: mappingProfileSubfieldShape,
  circulationNotes: mappingProfileSubfieldShape,
  electronicAccess: mappingProfileSubfieldShape,
});

export const mappingItemRefTablesShape = PropTypes.shape({
  formerIds: PropTypes.arrayOf(mappingProfileSubfieldShape),
  statisticalCodeIds: PropTypes.arrayOf(mappingProfileSubfieldShape),
  yearCaption: PropTypes.arrayOf(mappingProfileSubfieldShape),
  notes: PropTypes.arrayOf(mappingProfileSubfieldShape),
  circulationNotes: PropTypes.arrayOf(mappingProfileSubfieldShape),
  electronicAccess: PropTypes.arrayOf(mappingProfileSubfieldShape),
});

export const mappingHoldingsInitialFieldsShape = PropTypes.shape({
  formerIds: mappingProfileSubfieldShape,
  statisticalCodeIds: mappingProfileSubfieldShape,
  holdingStatements: mappingProfileSubfieldShape,
  holdingsStatementsForSupplements: mappingProfileSubfieldShape,
  holdingsStatementsForIndexes: mappingProfileSubfieldShape,
  notes: mappingProfileSubfieldShape,
  electronicAccess: mappingProfileSubfieldShape,
  receivingHistory: mappingProfileSubfieldShape,
});

export const mappingHoldingsRefTablesShape = PropTypes.shape({
  formerIds: PropTypes.arrayOf(mappingProfileSubfieldShape),
  statisticalCodeIds: PropTypes.arrayOf(mappingProfileSubfieldShape),
  holdingStatements: PropTypes.arrayOf(mappingProfileSubfieldShape),
  holdingsStatementsForSupplements: PropTypes.arrayOf(mappingProfileSubfieldShape),
  holdingsStatementsForIndexes: PropTypes.arrayOf(mappingProfileSubfieldShape),
  notes: PropTypes.arrayOf(mappingProfileSubfieldShape),
  electronicAccess: PropTypes.arrayOf(mappingProfileSubfieldShape),
  receivingHistory: PropTypes.arrayOf(mappingProfileSubfieldShape),
});

export const okapiShape = PropTypes.shape({
  tenant: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
});
