import { showActionMenu } from '../showActionMenu';
import { permissions } from '../permissions';

describe('showActionMenu function', () => {
  const renderer = jest.fn();

  it('should render action menu when user has correct permission', () => {
    const stripes = {
      hasPerm: perm => perm === permissions.SETTINGS_MANAGE
    };

    expect(showActionMenu(renderer, stripes, permissions.SETTINGS_MANAGE)).toEqual(renderer);
  });

  it('should return null when user does not have correct permission', () => {
    const stripes = {
      hasPerm: perm => perm === permissions.SETTINGS_MANAGE
    };

    expect(showActionMenu(renderer, stripes, 'test.permission')).toBeNull();
  });
});
