export function renderActionMenuWithPermission(renderer, stripes) {
  const hasPerm = stripes.hasPerm('ui-data-import.settings.manage');
  return hasPerm ? renderer : null;
}
