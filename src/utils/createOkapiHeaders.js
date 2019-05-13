/**
 * Builds OKAPI headers set
 *
 * @param {Object|okapi} okapi
 * @return {{'X-Okapi-Token': *, 'X-Okapi-Tenant': *}}
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
