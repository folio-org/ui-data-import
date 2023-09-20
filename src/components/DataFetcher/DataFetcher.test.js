import React, { useContext } from 'react';
import {
  render,
  waitFor,
} from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { buildResources } from '@folio/stripes-data-transfer-components/test/helpers';

import '../../../test/jest/__mock__';

import {
  DataFetcher,
  DataFetcherContext,
  getJobSplittingURL,
} from '.';

const reset = () => {};
const successGET = () => new Promise((resolve, _) => process.nextTick(() => resolve()));
const errorGET = () => new Promise((_, reject) => process.nextTick(() => reject()));

const buildMutator = (resetFn, getFn) => ({
  jobs: {
    reset: resetFn,
    GET: getFn,
  },
  logs: {
    reset: resetFn,
    GET: getFn,
  },
});

const resources = buildResources({
  resourceName: 'logs',
  records: [{
    jobExecutions: [{
      id: '1',
      hrId: 1,
      jobProfileInfo: {},
      subordinationType: 'test',
      sourcePath: 'test',
      runBy: {
        firstName: 'testFirstName',
        lastName: 'testLastName',
      },
      progress: {
        current: 1,
        total: 1,
      },
      startedDate: 'test date',
      status: 'test',
      uiStatus: 'test',
      fileName: 'testFileName',
    }],
  }],
  otherResources: {
    splitStatus: {
      hasLoaded: true,
      records: [{ splitStatus: true }]
    }
  }
});

const TestComponent = () => {
  const { logs } = useContext(DataFetcherContext);

  return (
    <div>{logs?.[0]?.fileName || 'error'}</div>
  );
};

const renderDataFetcher = mutator => render(
  <DataFetcher
    resources={resources}
    mutator={mutator}
  >
    <TestComponent />
  </DataFetcher>,
);

describe('DataFetcher component', () => {
  it('should be rendered with no axe errors', async () => {
    const mutator = buildMutator(reset, successGET);
    const { container } = await renderDataFetcher(mutator);

    await runAxeTest({ rootNode: container });
  });

  describe('when data is received successfully', () => {
    it('then child component should be rendered with correct data', async () => {
      const mutator = buildMutator(reset, successGET);

      const { getByText } = await renderDataFetcher(mutator);

      await waitFor(() => expect(getByText('testFileName')).toBeDefined());
    });
  });

  describe('when error appears during getting the data', () => {
    it('then child component should be rendered with correct data', async () => {
      const mutator = buildMutator(reset, errorGET);

      const { getByText } = await renderDataFetcher(mutator);

      await waitFor(() => expect(getByText('error')).toBeDefined());
    });
  });

  describe('getJobSplittingURL', () => {
    const trueResources = { split_status: { isPending: false, records: [{ splitStatus: true }] } };
    const falseResources = { split_status: { isPending: false, records: [{ splitStatus: false }] } };
    const pendingResources = { split_status: { isPending: true, records: [] } };
    it('given a splitStatus of true, it provides the "trueUrl" parameter', () => {
      expect(getJobSplittingURL(trueResources, 'trueUrl', 'falseUrl')).toBe('trueUrl');
    });

    it('given a splitStatus of true, it provides the "falseUrl" parameter', () => {
      expect(getJobSplittingURL(falseResources, 'trueUrl', 'falseUrl')).toBe('falseUrl');
    });

    it('given a pending split status, it returns undefined', () => {
      expect(getJobSplittingURL(pendingResources, 'trueUrl', 'falseUrl')).toBeUndefined();
    });
  });
});
