/**
 * Displays Action menu if user has appropriate permission(s).
 *
 * @param {{renderer: Function | null, stripes: Object, permission: String}} options
*/
export function showActionMenu(renderer, stripes, permission) {
  const hasPerm = stripes.hasPerm(permission);

  return hasPerm ? renderer : null;
}
