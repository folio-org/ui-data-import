import React from 'react';
import { noop } from 'lodash';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import {
  buildMutator, buildResources,
} from '@folio/stripes-data-transfer-components/test/helpers';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  renderWithReduxForm, translationsProperties,
} from '../../../test/jest/helpers';

import { ViewContainer } from './ViewContainer';

const resources = buildResources({
  resourceName: 'values',
  records: [{
    id: '2d706874-8a10-4d3e-a190-33c301d157e3',
    field: '001',
    indicator1: '',
    indicator2: '',
    subfield: '',
    data: '*',
    source: 'SYSTEM',
    override: false,
    metadata: {
      createdDate: '2020-08-13T14:44:00.000+00:00',
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdByUsername: 'System',
      updatedDate: '2020-08-13T14:44:00.000+00:00',
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedByUsername: 'System',
    },
  }, {
    id: '82d0b904-f8b0-4cc2-b238-7d8cddef7b7e',
    field: '999',
    indicator1: 'f',
    indicator2: 'f',
    subfield: '*',
    data: '*',
    source: 'SYSTEM',
    override: false,
    metadata: {
      createdDate: '2020-08-13T14:44:00.000+00:00',
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdByUsername: 'System',
      updatedDate: '2020-08-13T14:44:00.000+00:00',
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedByUsername: 'System',
    },
  }, {
    id: '82d0b904-f8b0-4cc2-b238-7d8cddef7b7e',
    field: '*',
    indicator1: '/',
    indicator2: '/',
    subfield: '*',
    data: '',
    source: 'SYSTEM',
    override: false,
    metadata: {
      createdDate: '2020-08-13T14:44:00.000+00:00',
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdByUsername: 'System',
      updatedDate: '2020-08-13T14:44:00.000+00:00',
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedByUsername: 'System',
    },
  },
  ],
});

const mutator = buildMutator({
  query: {
    replace: noop,
    update: noop,
  },
  resultCount: { replace: noop },
  actionProfiles: {
    POST: jest.fn(),
    PUT: jest.fn(),
    DELETE: jest.fn(),
  },
  fileExtensions: {
    POST: noop,
    PUT: noop,
    DELETE: noop,
  },
  restoreDefaults: { POST: noop },
});

const viewContainerProps = {
  entityKey: 'actionProfiles',
  children: props => {
  },
  mutator: { mutator },
  location: '',
  history: {
    push: () => {
    },
  },
  match: { path: '/' },
  selectedRecords: new Set(),
  selectRecord: () => {
  },
};

const history = createMemoryHistory();

history.push = jest.fn();
const renderViewContainer = props => {
  const component = () => (
    <Router>
      <ViewContainer
        {...props}
      >
        {() => {
        }}
      </ViewContainer>
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('ViewContainer Component', () => {
  it('should have not an element with ref attribute', () => {
    const { container } = renderViewContainer(viewContainerProps);
    const elementWithRefAttr = container.querySelector('[ref]');

    expect(elementWithRefAttr)
      .toBeNull();
  });
  it('should not render ExceptionModal component by default (renders only when an error occurs)', () => {
    const { container } = renderViewContainer(viewContainerProps);
    const exceptionModalDiv = container.querySelector('#delete-test-actionProfiles-exception-modal');

    expect(exceptionModalDiv)
      .toBeNull();
  });

  it('should have \'fullWidthAndHeightContainer\' class', () => {
    const { container } = renderViewContainer(viewContainerProps);
    const fullWidthAndHeightContainerClass = container.querySelector('.fullWidthAndHeightContainer');

    expect(fullWidthAndHeightContainerClass)
      .toBeInTheDocument();
  });
});
