const path = require('path');
const config = require('@folio/jest-config-stripes');
const acqConfigs = require('@folio/stripes-acq-components/jest.config');

module.exports = {
  ...config,
  transform: {
    ...acqConfigs.transform,
  },
  setupFiles: [path.join(__dirname, './test/jest/setupFiles.js')],
};
