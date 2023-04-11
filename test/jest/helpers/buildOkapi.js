export const buildOkapi = (otherProperties = {}) => ({
  tenant: 'diku',
  token: '',
  url: 'https://folio-testing-okapi.dev.folio.org',
  ...otherProperties,
});
