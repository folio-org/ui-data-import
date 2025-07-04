import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes-smart-components'),
  LocationLookup: () => <div>LocationLookup</div>,
  withTags: (Component) => props => <Component {...props} tagsEnabled={true} />,
}), { virtual: true });
