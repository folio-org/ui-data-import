import React, { createRef } from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { LinkerTrigger } from './LinkerTrigger';

const onClick = jest.fn();

const linkerTriggerProps = {
  triggerRef: createRef(),
  ariaProps: {},
  keyHandler: jest.fn(),
  id: 'testId',
};

const renderLinkerTrigger = ({
  title,
  triggerRef,
  ariaProps,
  keyHandler,
  id,
}) => {
  const component = (
    <LinkerTrigger
      title={title}
      triggerRef={triggerRef}
      ariaProps={ariaProps}
      keyHandler={keyHandler}
      id={id}
      onClick={onClick}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('LinkerTrigger component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderLinkerTrigger(linkerTriggerProps);

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered with node type title', () => {
    const { getByText } = renderLinkerTrigger({
      ...linkerTriggerProps,
      title: 'test node title',
    });

    expect(getByText('test node title')).toBeDefined();
  });

  it('should be rendered with FormattedMessage type title', () => {
    const { getByText } = renderLinkerTrigger(linkerTriggerProps);

    expect(getByText('Click here to get started')).toBeDefined();
  });
});
