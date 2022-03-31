import { noop } from 'lodash';

export const buildStripes = (otherProperties = {}) => ({
  actionNames: [],
  clone: buildStripes,
  connect: component => component,
  config: {},
  currency: 'USD',
  hasInterface: () => true,
  hasPerm: jest.fn(() => true),
  locale: 'en-US',
  logger: { log: noop },
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  setBindings: noop,
  setCurrency: noop,
  setLocale: noop,
  setSinglePlugin: noop,
  setTimezone: noop,
  setToken: noop,
  store: {
    getState: noop,
    dispatch: noop,
    subscribe: noop,
    replaceReducer: noop,
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
  ...otherProperties,
});
