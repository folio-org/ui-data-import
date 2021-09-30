import React from 'react';
import { render } from '@testing-library/react';

import { Triangle } from './Triangle';

describe('Triangle', () => {
  it('should be rendered', () => {
    const { container } = render(<Triangle />);

    expect(container.querySelector('.triangle')).toBeDefined();
  });
});
