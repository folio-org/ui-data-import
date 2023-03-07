import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Triangle } from './Triangle';

describe('Triangle', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = render(<Triangle />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should be rendered', () => {
    const { container } = render(<Triangle />);

    expect(container.querySelector('.triangle')).toBeDefined();
  });
});
