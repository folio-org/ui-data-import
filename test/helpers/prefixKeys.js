// mimics the StripesTranslationPlugin in @folio/stripes-core
export function prefixKeys(obj, prefix = 'ui-data-import') {
  const res = {};

  for (const key of Object.keys(obj)) {
    res[`${prefix}.${key}`] = obj[key];
  }

  return res;
}
