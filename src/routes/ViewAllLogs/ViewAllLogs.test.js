import React from 'react';
import { fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { buildMutator } from '@folio/stripes-data-transfer-components/test/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import ViewAllLogs from './ViewAllLogs';

const mutator = buildMutator({
  initializedFilterConfig: {
    update: noop,
    replace: noop,
  },
  query: {
    replace: noop,
    update: noop,
  },
  records: {
    DELETE: noop,
    POST: noop,
    PUT: noop,
    cancel: noop,
  },
});

const defaultQuery = {
  filters: '',
  query: '',
  sort: '-completedDate',
};

const getResources = query => ({
  resourceName: 'jobLogs',
  query,
  resultCount: 100,
  records: {
    hasLoaded: true,
    isPending: false,
    failed: false,
    other: { totalRecords: 3 },
    records: [
      {
        completedDate: '2021-10-10T08:30:56.946+0000',
        id: 'testId1',
        fileName: 'testFile1',
        jobProfileInfo: { name: 'test1' },
        progress: {
          current: 0,
          total: 100,
        },
        userId: 'test1',
        runBy: {
          firstName: 'testFirstname1',
          lastName: 'testLastname1',
        },

      },
      {
        completedDate: '2021-10-11T07:42:56.946+0000',
        id: 'testId2',
        fileName: '',
        jobProfileInfo: { name: 'test2' },
        progress: {
          current: 1,
          total: 100,
        },
        userId: 'test2',
        runBy: {
          firstName: '',
          lastName: 'testLastname2',
        },
      },
      {
        completedDate: '2021-10-12T09:46:56.946+0000',
        id: 'testId3',
        fileName: 'testFile3',
        jobProfileInfo: { name: 'test3' },
        progress: {
          current: 2,
          total: 100,
        },
        userId: 'test3',
        runBy: {
          firstName: 'testFirstname1',
          lastName: 'testLastname3',
        },
        status: 'ERROR',
      },
    ],
    totalRecords: 100,
  },
});

const renderViewAllLogs = query => {
  const component = (
    <Router>
      <ViewAllLogs
        mutator={mutator}
        resources={getResources(query)}
        disableRecordCreation={false}
        history={{ push: noop }}
        intl={{ formatMessage: noop }}
        stripes={{
          hasPerm: noop,
          connect: noop,
          logger: { log: noop },
        }}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

// eslint-disable-next-line no-only-tests/no-only-tests
describe.skip('ViewAllLogs component', () => {
  it('should render correct number of records', () => {
    const { getByText } = renderViewAllLogs(defaultQuery);

    expect(getByText(/3 records found/i)).toBeInTheDocument();
  });

  describe('SearchAndSort pane', () => {
    it('should contain Search and filter section', () => {
      const { getByText } = renderViewAllLogs(defaultQuery);

      expect(getByText('Search & filter')).toBeInTheDocument();
    });

    it('should have a resetAll button', () => {
      const { getByText } = renderViewAllLogs(defaultQuery);

      expect(getByText('Reset all')).toBeInTheDocument();
    });

    it('should have resetAll button is disabled by default', () => {
      const { container } = renderViewAllLogs(defaultQuery);

      const resetAllButton = container.querySelector('#clickable-reset-all');

      expect(resetAllButton).toBeDisabled();
    });

    describe('Search pane', () => {
      describe('when default "filters" provided', () => {
        it('resetAll button is active by default', () => {
          const { container } = renderViewAllLogs({
            filters: 'completedDate.2021-10-01:2021-10-28,jobProfileInfo.test123,userId.test123',
            query: '',
            sort: '-completedDate',
          });

          const resetAllButton = container.querySelector('#clickable-reset-all');

          expect(resetAllButton).toBeEnabled();
        });
      });

      describe('when filled search input', () => {
        it('resetAll button is active', () => {
          const {
            getByRole,
            container,
          } = renderViewAllLogs(defaultQuery);

          const searchInput = getByRole('searchbox', { name: /search/i });

          const resetAllButton = container.querySelector('#clickable-reset-all');

          fireEvent.change(searchInput, { target: { value: 'test value' } });

          expect(resetAllButton).toBeEnabled();
        });
      });
    });
  });

  describe('"Log filters" is not displayed', () => {
    it('when no query filters provided', () => {
      const { queryByText } = renderViewAllLogs();

      expect(queryByText(/errors in import/i)).toBeNull();
      expect(queryByText(/date/i)).toBeNull();
      expect(queryByText(queryByText(/job profile/i))).toBeNull();
      expect(queryByText(/user/i)).toBeNull();
      expect(queryByText(/inventory single record imports/i)).toBeNull();
    });
  });

  describe('Filter pane', () => {
    it('"Errors in import" section is opened by default', () => {
      const { getByRole } = renderViewAllLogs(defaultQuery);

      const errorsFilterButton = getByRole('button', {
        name: /errors in import filter list/i,
        expanded: true,
      });

      expect(errorsFilterButton).toBeInTheDocument();
    });
  });

  describe('"Date" section', () => {
    describe('when entered invalid value to date fields', () => {
      it('should have error messages', () => {
        const {
          getByRole,
          getAllByText,
        } = renderViewAllLogs(defaultQuery);

        const dateFrom = getByRole('textbox', { name: /from/i });
        const dateTo = getByRole('textbox', { name: /to/i });
        const applyButton = getByRole('button', { name: /apply/i });

        fireEvent.change(dateFrom, { target: { value: '2021-44-01' } });
        fireEvent.change(dateTo, { target: { value: '2021-56-01' } });
        fireEvent.click(applyButton);

        expect(getAllByText(/please enter a valid date/i).length).toBe(2);
      });
    });

    describe('when entered valid value to date fields', () => {
      it('should load without errors', async () => {
        const {
          getByRole,
          findByText,
        } = renderViewAllLogs(defaultQuery);

        const dateFrom = getByRole('textbox', { name: /from/i });
        const dateTo = getByRole('textbox', { name: /to/i });
        const applyButton = getByRole('button', { name: /apply/i });

        fireEvent.change(dateFrom, { target: { value: '2021-10-01' } });
        fireEvent.change(dateTo, { target: { value: '2021-10-12' } });
        fireEvent.click(applyButton);

        expect(await findByText(/3 records found/i)).toBeInTheDocument();
      });
    });
  });

  describe('"Job profiles" selection', () => {
    it('renders dropdown button', () => {
      const { getByRole } = renderViewAllLogs(defaultQuery);

      expect(getByRole('button', { name: /choose job profile/i })).toBeInTheDocument();
    });
  });

  describe('"Users" selection', () => {
    it('should render dropdown button', () => {
      const { getByRole } = renderViewAllLogs(defaultQuery);

      expect(getByRole('button', { name: /choose user/i })).toBeInTheDocument();
    });
  });

  describe('Logs section', () => {
    it('should have clickable file names', () => {
      const { getByRole } = renderViewAllLogs(defaultQuery);

      const fileLink = getByRole('button', { name: /testfile1/i });

      fireEvent.click(fileLink);

      expect(fileLink).toHaveAttribute('href');
    });
  });
});
