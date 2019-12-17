import {
  instanceJsonSchema,
  holdingsJsonSchema,
  itemJsonSchema,
  orderJsonSchema,
  notesJsonSchema,
  invoiceJsonSchema,
} from '../../mocks/json-schemas';

export default server => {
  server.get('_/jsonSchemas', (schema, request) => {
    const {
      requestHeaders: { 'x-okapi-module-id': moduleId },
      queryParams: { path },
    } = request;

    if (moduleId.includes('inventory') && path.includes('instance.json')) {
      return { properties: instanceJsonSchema };
    }

    if (moduleId.includes('inventory') && path.includes('holdingsrecord.json')) {
      return { properties: holdingsJsonSchema };
    }

    if (moduleId.includes('inventory') && path.includes('item.json')) {
      return { properties: itemJsonSchema };
    }

    if (moduleId.includes('orders')) {
      return { properties: orderJsonSchema };
    }

    if (moduleId.includes('notes')) {
      return { properties: notesJsonSchema };
    }

    if (moduleId.includes('invoice')) {
      return { properties: invoiceJsonSchema };
    }

    return { properties: {} };
  });
};
