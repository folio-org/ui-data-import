import React from 'react';

import { render } from '@testing-library/react';

import { BrowserRouter as Router } from 'react-router-dom';

import { noop } from 'lodash';

import {
  buildResources,
  buildMutator,
  Harness,
} from '@folio/stripes-data-transfer-components/test/helpers';

import '../../../test/jest/__mock__';

import { translationsProperties } from '../../../test/jest/helpers';

import ViewAllLogs from './ViewAllLogs';

const mutator = buildMutator({
  initializedFilterConfig: {
    update: jest.fn(),
    replace: jest.fn(),
  },
  query: {
    replace: jest.fn(),
    update: jest.fn(),
  },
  records: {
    DELETE: jest.fn(),
    POST: jest.fn(),
    PUT: jest.fn(),
    cancel: jest.fn(),
  },
  resultCount: {
    replace: jest.fn(),
    update: jest.fn(),
  },
});

const resources = buildResources({
  query: {
    query: '',
    filters: '',
    sort: '-completedDate',
  },
  resultCount: 100,
  records: {
    failed: false,
    records: [],
  },
});

const renderViewAllLogs = () => {
  const component = () => (
    <Harness translations={translationsProperties}>
      <Router>
        <ViewAllLogs
          mutator={mutator}
          resources={resources}
          disableRecordCreation={false}
          history={{ push: noop }}
          intl={{ formatMessage: jest.fn() }}
          stripes={{
            hasPerm: jest.fn(),
            connect: jest.fn(),
            logger: { log: jest.fn() },
          }}
        />
      </Router>
    </Harness>
  );

  return render(component());
};

describe('ViewAllLogs component', () => {
  it('should render search component correctly', () => {
    const { getByText } = renderViewAllLogs();

    expect(getByText('Search & filter')).toBeInTheDocument();
  });
});
