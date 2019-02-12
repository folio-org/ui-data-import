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
