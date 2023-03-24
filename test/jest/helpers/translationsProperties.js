import componentsTranslations from '@folio/stripes-components/translations/stripes-components/en';
import smartComponentsTranslations from '@folio/stripes-smart-components/translations/stripes-smart-components/en';
import stripesCoreTranslations from '@folio/stripes-core/translations/stripes-core/en';
import stripesAcqComponentsTranslations from '@folio/stripes-acq-components/translations/stripes-acq-components/en';
import dataImportTranslations from '../../../translations/ui-data-import/en';

export const translationsProperties = [
  {
    prefix: 'stripes-components',
    translations: componentsTranslations,
  },
  {
    prefix: 'stripes-smart-components',
    translations: smartComponentsTranslations,
  },
  {
    prefix: 'stripes-core',
    translations: stripesCoreTranslations,
  },
  {
    prefix: 'stripes-acq-components',
    translations: stripesAcqComponentsTranslations,
  },
  {
    prefix: 'ui-data-import',
    translations: dataImportTranslations,
  },
];
