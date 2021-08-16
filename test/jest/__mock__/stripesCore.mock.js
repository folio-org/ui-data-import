import React from 'react';

import { buildStripes } from '../helpers';

const mockStripes = buildStripes();

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  stripesConnect: Component => props => <Component {...props} />,
  withStripes: Component => props => (
    <Component
      stripes={mockStripes}
      {...props}
    />
  ),
  Pluggable: jest.fn(props => <>{props.children}</>),
}), { virtual: true });
