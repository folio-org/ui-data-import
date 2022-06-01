import { permissions } from './permissions';

/**
 * Displays Action menu if user has appropriate permission(s).
 *
 * @param {{renderer: Function | null, stripes: Object, perm?: string}} options
 */
export function showActionMenu({ renderer, stripes, perm = permissions.SETTINGS_MANAGE }) {
  const hasPerm = stripes.hasPerm(perm);

  return hasPerm ? renderer : null;
}
