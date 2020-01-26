import setupStripesCore from '@folio/stripes-core/test/bigtest/helpers/setup-application';
import mirageOptions from '../network';
import findImportProfile from './findImportProfileModule';

export function setupApplication({
  scenarios,
  hasAllPerms = true,
} = {}) {
  setupStripesCore({
    mirageOptions,
    modules: [findImportProfile],
    scenarios,
    stripesConfig: { hasAllPerms },
  });
}
