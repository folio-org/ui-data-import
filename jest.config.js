const config = require('@folio/jest-config-stripes');
const acqConfigs = require('@folio/stripes-acq-components/jest.config');

const transformIgnorePattern = config.transformIgnorePatterns[0]
  .replace(')', '|keyboardjs)');

module.exports = {
  ...config,
  transform: {
    ...acqConfigs.transform,
  },
  transformIgnorePatterns: [transformIgnorePattern],
};
