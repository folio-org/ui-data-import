import { showActionMenu } from '../showActionMenu';
import { permissions } from '../permissions';

describe('showActionMenu function', () => {
  const renderer = jest.fn();
  const perm = permissions.SETTINGS_MANAGE;

  it('should render action menu when user has correct permission', () => {
    const stripes = {
      hasPerm: permission => permission === permissions.SETTINGS_MANAGE
    };

    expect(showActionMenu({ renderer, stripes, perm })).toEqual(renderer);
  });

  it('should return null when user does not have correct permission', () => {
    const stripes = {
      hasPerm: permission => permission === 'test.permission'
    };

    expect(showActionMenu({ renderer, stripes, perm })).toBeNull();
  });
});
