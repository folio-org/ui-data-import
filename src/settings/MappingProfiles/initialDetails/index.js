import ITEM from './ITEM';
import INSTANCE from './INSTANCE';
import HOLDINGS from './HOLDINGS';
import ORDER from './ORDER';
import INVOICE from './INVOICE';
import MARC_BIBLIOGRAPHIC from './MARC_BIBLIOGRAPHIC';
import MARC_HOLDINGS from './MARC_HOLDINGS';
import MARC_AUTHORITY from './MARC_AUTHORITY';

import { isMARCType } from '../../../utils';
import { FOLIO_RECORD_TYPES } from '../../../components';

const initialValues = {
  ITEM,
  INSTANCE,
  HOLDINGS,
  ORDER,
  INVOICE,
  MARC_BIBLIOGRAPHIC,
  MARC_HOLDINGS,
  MARC_AUTHORITY,
};

const modifyInvoiceLinesFieldDetails = field => {
  const invoiceLineSubfield = { ...field.subfields[0] };

  invoiceLineSubfield.fields = invoiceLineSubfield.fields.map(subfieldsField => {
    if (subfieldsField.subfields) {
      return {
        ...subfieldsField,
        subfields: [],
      };
    }

    return subfieldsField;
  });

  return {
    ...field,
    subfields: [invoiceLineSubfield],
  };
};

/**
 * Retrieves and returns initial mapping details object
 * for the given entity (record type)
 *
 * @param {string} entity record type for which we want to retrieve initial values object
 * @param {boolean} stripRepeatableFields indicates whether we need strip repeatable fields subfields props
 * @returns {*}
 */
export const getInitialDetails = (entity, stripRepeatableFields = false) => {
  if (!entity) {
    return {};
  }

  const entityIsMARC = isMARCType(entity);
  const entityIsInvoice = entity === FOLIO_RECORD_TYPES.INVOICE.type;
  const currentEntity = initialValues[entity];

  if (entityIsMARC || !stripRepeatableFields) {
    return currentEntity;
  }

  const fields = currentEntity.mappingFields.map(field => {
    if (entityIsInvoice) {
      if (field.name === 'invoiceLines') {
        return modifyInvoiceLinesFieldDetails(field);
      }

      if (field.name === 'acqUnitIds') {
        return field;
      }
    }

    return {
      ...field,
      subfields: [],
    };
  });

  return {
    ...currentEntity,
    mappingFields: fields,
  };
};

/**
 * Retrieves and returns initial subfields objects for the given entities repeatable fields
 *
 * @param {string} entity record type for which we want to retrieve initial values object
 * @returns {{}}
 */
export const getInitialFields = entity => {
  let initialFields = {};

  if (!entity) {
    return initialFields;
  }

  const initialDetails = getInitialDetails(entity);
  const fields = initialDetails.mappingFields?.filter(field => field.subfields?.length) || [];

  fields.forEach(field => {
    initialFields = {
      ...initialFields,
      [field.name]: field.subfields[0],
    };
  });

  return initialFields;
};

/**
 * Retrieves, forms and returns reference tables object from
 * mapping details fields list/array given
 *
 * @param {array} fields
 * @returns {{}}
 */
export const getReferenceTables = fields => {
  let referenceTables = {};
  const fieldsWithSubfields = fields.filter(field => field.subfields?.length);

  fieldsWithSubfields.forEach(field => {
    referenceTables = {
      ...referenceTables,
      [field.name]: field.subfields,
    };
  });

  return referenceTables;
};
