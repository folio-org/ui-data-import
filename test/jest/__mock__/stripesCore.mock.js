import React from 'react';

import { buildStripes as mockBuildStripes } from '../helpers/stripesMock';

const mockStripesCore = () => {
  const STRIPES = mockBuildStripes();

  const stripesConnect = Component => ({
    mutator, resources, stripes, ...rest
  }) => {
    const fakeMutator = mutator || Object.keys(Component.manifest || {}).reduce((acc, mutatorName) => {
      const returnValue = Component.manifest[mutatorName].records ? [] : {};

      acc[mutatorName] = {
        GET: jest.fn().mockReturnValue(Promise.resolve(returnValue)),
        PUT: jest.fn().mockReturnValue(Promise.resolve()),
        POST: jest.fn().mockReturnValue(Promise.resolve()),
        DELETE: jest.fn().mockReturnValue(Promise.resolve()),
        reset: jest.fn(),
      };

      return acc;
    }, {});

    const fakeResources = resources || Object.keys(Component.manifest || {}).reduce((acc, resourceName) => {
      acc[resourceName] = { records: [] };

      return acc;
    }, {});

    const fakeStripes = stripes || STRIPES;

    return (
      <Component
        {...rest}
        mutator={fakeMutator}
        resources={fakeResources}
        stripes={fakeStripes}
      />
    );
  };

  const withStripes = Component => ({
    stripes, ...rest
  }) => {
    const fakeStripes = stripes || STRIPES;

    return (
      <Component
        {...rest}
        stripes={fakeStripes}
      />
    );
  };

  const withRoot = Component => props => {
    return (
      <Component
        {...props}
        root={{
          addReducer: () => {
          }
        }}
      />
    );
  };

  const useStripes = () => STRIPES;

  const IfPermission = props => <>{props.children}</>;

  const AppContextMenu = props => <>{props.children()}</>;

  STRIPES.connect = stripesConnect;

  const useOkapiKy = jest.fn();

  const useNamespace = () => ['@folio/data-import'];

  return {
    stripesConnect,
    withStripes,
    withRoot,
    IfPermission,
    AppContextMenu,
    useStripes,
    useOkapiKy,
    useNamespace,
    Pluggable: jest.fn(props => <>{props.children}</>),
  };
};

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  ...mockStripesCore(),
}), { virtual: true });

jest.mock('@folio/stripes-core', () => ({
  ...jest.requireActual('@folio/stripes-core'),
  ...mockStripesCore(),
}), { virtual: true });
