import React from 'react';
import { render } from '@testing-library/react';

import '../../../test/jest/__mock__';

import { ActionIcon } from './ActionIcon';

const component = (
  <ActionIcon>
    <span>child component</span>
  </ActionIcon>
);

describe('ActionIcon', () => {
  it('should be rendered with child component', () => {
    const { getByText } = render(component);

    expect(getByText('child component')).toBeDefined();
  });
});
