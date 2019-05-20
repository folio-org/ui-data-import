/**
 * Builds OKAPI headers set
 *
 * @param {Object} okapi
 * @return {{ 'X-Okapi-Token': any, 'X-Okapi-Tenant': any }}
 */
export const createOkapiHeaders = okapi => {
  const {
    token,
    tenant,
  } = okapi;

  return {
    'X-Okapi-Tenant': tenant,
    'X-Okapi-Token': token,
  };
};
