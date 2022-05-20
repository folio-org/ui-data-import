import { permissions } from './permissions';

/**
 * Displays Action menu if user has ui-data-import.settings.manage permission.
 *
 * @param {{renderer: Function | null, stripes: Object}} options
*/
export function showActionMenu({ renderer, stripes }) {
  const hasPerm = stripes.hasPerm(permissions.SETTINGS_MANAGE);
  return hasPerm ? renderer : null;
}
