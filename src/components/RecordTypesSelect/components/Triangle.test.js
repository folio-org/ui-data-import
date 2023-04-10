import React from 'react';
import { render } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { Triangle } from './Triangle';

describe('Triangle component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = render(<Triangle />);

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered', () => {
    const { container } = render(<Triangle />);

    expect(container.querySelector('.triangle')).toBeDefined();
  });
});
