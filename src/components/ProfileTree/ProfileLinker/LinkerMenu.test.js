import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { LinkerMenu } from './LinkerMenu';

const onClick = jest.fn();
const onToggle = jest.fn();

const linkerMenuProps = {
  id: 'testId',
  open: false,
  entityKeys: [
    'matchProfiles',
    'actionProfiles',
  ],
  disabledOptions: ['matchProfiles'],
  keyHandler: jest.fn(),
};

const renderLinkerMenu = ({
  id,
  open,
  entityKeys,
  disabledOptions,
  keyHandler,
}) => {
  const component = (
    <LinkerMenu
      id={id}
      open={open}
      entityKeys={entityKeys}
      onClick={onClick}
      onToggle={onToggle}
      disabledOptions={disabledOptions}
      keyHandler={keyHandler}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('LinkerMenu', () => {
  afterEach(() => {
    onClick.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderLinkerMenu(linkerMenuProps);

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered with label', () => {
    const { getByText } = renderLinkerMenu(linkerMenuProps);

    expect(getByText('Add')).toBeDefined();
  });

  it('should be rendered with dropdown buttons', () => {
    const { getByText } = renderLinkerMenu(linkerMenuProps);

    expect(getByText('Match')).toBeDefined();
    expect(getByText('Action')).toBeDefined();
  });
});
