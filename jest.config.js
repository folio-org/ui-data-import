const config = require('@folio/jest-config-stripes');
const acqConfigs = require('@folio/stripes-acq-components/jest.config');

module.exports = {
  ...config,
  transform: {
    ...acqConfigs.transform,
  },
};
