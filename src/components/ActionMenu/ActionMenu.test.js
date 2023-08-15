import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../test/jest/__mock__';

import { ActionMenu } from './ActionMenu';

jest.mock('./menuTemplate', () => ({
  menuTemplate: () => ({
    addNew: () => <span key="1">addNew</span>,
    edit: () => <span key="2">edit</span>,
  }),
}));

const entity = { props: { actionMenuItems: ['addNew', 'edit'] } };
const menu = { onToggle: jest.fn() };

const renderActionMenu = () => {
  const component = (
    <ActionMenu
      entity={entity}
      menu={menu}
    />
  );

  return render(component);
};

describe('Action menu component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderActionMenu();

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered', () => {
    expect(renderActionMenu()).toBeDefined();
  });

  it('with defined menu items', () => {
    const { getByText } = renderActionMenu();

    expect(getByText('addNew')).toBeDefined();
    expect(getByText('edit')).toBeDefined();
  });
});
