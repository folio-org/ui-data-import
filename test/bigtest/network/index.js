import { camelize } from '@bigtest/mirage';

// auto-import all mirage submodules
const req = require.context('./', true, /\.js$/);
const modules = req.keys().reduce((acc, modulePath) => {
  const [, moduleType, moduleName] = modulePath.split('/');

  if (moduleName) {
    const moduleKey = camelize(moduleName.replace('.js', ''));

    return Object.assign(acc, {
      [moduleType]: {
        ...(acc[moduleType] || {}),
        [moduleKey]: req(modulePath).default,
      },
    });
  }

  if (modulePath === './config.js') {
    return Object.assign(acc, { baseConfig: req(modulePath).default });
  }

  return acc;
}, {});

export default modules;
