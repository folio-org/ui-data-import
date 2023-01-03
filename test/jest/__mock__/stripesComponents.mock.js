import React from 'react';

// jest.mock('@folio/stripes-components/lib/Icon', () => {
//   return (props) => (
//     <span data-testid={props?.['data-testid']}>Icon</span>
//   );
// });

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  Headline: jest.fn(({ children }) => <div>{children}</div>),
  Icon: jest.fn((props) => (props && props.children ? props.children : <span />)),
}));
