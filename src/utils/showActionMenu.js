import { permissions } from './permissions';
/**
 * Displays Action menu if user has settings.manage permission.
*/
export function showActionMenu({ renderer, stripes }) {
  const hasPerm = stripes.hasPerm(permissions.SETTINGS_MANAGE);
  return hasPerm ? renderer : null;
}
