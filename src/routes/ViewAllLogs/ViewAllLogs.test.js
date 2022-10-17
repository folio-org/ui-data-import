import React from 'react';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { noop } from 'lodash';

import '../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { buildMutator } from '@folio/stripes-data-transfer-components/test/helpers';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import {
  translationsProperties,
  buildStripes,
} from '../../../test/jest/helpers';

import ViewAllLogs, { ViewAllLogsManifest } from './ViewAllLogs';

import { SORT_MAP } from './constants';
import {
  OCLC_CREATE_INSTANCE_JOB_ID,
  OCLC_UPDATE_INSTANCE_JOB_ID,
} from '../../utils';
import * as utils from '../../utils/deleteJobExecutions';

const mockedQueryUpdate = jest.fn();

const mutator = buildMutator({
  initializedFilterConfig: {
    update: noop,
    replace: noop,
  },
  query: {
    replace: noop,
    update: mockedQueryUpdate,
  },
  records: {
    DELETE: noop,
    POST: noop,
    PUT: noop,
    cancel: noop,
  },
  users: {
    GET: noop,
  },
  jobProfiles: {
    GET: noop,
  }
});

const defaultQuery = {
  filters: '',
  query: '',
  sort: '-completedDate',
};

const getResources = query => ({
  resourceName: 'jobLogs',
  resultOffset: 0,
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
    jobProfiles: {
      records: [
        { name: 'test1' },
        { name: 'test2' },
        { name: 'test3' },
      ],
    },
    totalRecords: 100,
  },
});


jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  ConfirmationModal: jest.fn(({
    open,
    onCancel,
    onConfirm,
  }) => (open ? (
    <div>
      <span>Confirmation modal</span>
      <button
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="button"
        id="confirmButton"
        onClick={onConfirm}
      >
        Confirm
      </button>
    </div>
  ) : null)),
}));
const deleteJobExecutionsSpy = jest.spyOn(utils, 'deleteJobExecutions');

const stripes = buildStripes();
stripes.hasPerm = jest.fn(() => true);
stripes.logger.log = jest.fn();
stripes.connect = jest.fn(() => component => component);

const renderViewAllLogs = query => {
  const component = (
    <Router>
      <ModuleHierarchyProvider module="@folio/data-import">
        <ViewAllLogs
          mutator={mutator}
          resources={getResources(query)}
          disableRecordCreation={false}
          history={{ push: noop }}
          intl={{ formatMessage: jest.fn(() => 'test') }}
          stripes={stripes}
          setList={jest.fn()}
          checkboxList={{
            isAllSelected: false,
            handleSelectAllCheckbox: noop,
            selectedRecords: [],
            selectRecord: noop,
          }}
          location={{
            pathname: '/job-logs',
            search: '?sort=-completedDate',
          }}
          match={{ params: {} }}
          refreshRemote={noop}
        />
      </ModuleHierarchyProvider>
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ViewAllLogs component', () => {
  afterAll(() => {
    deleteJobExecutionsSpy.mockClear();
  });

  it('should render correct number of records', () => {
    const { getByText } = renderViewAllLogs(defaultQuery);

    expect(getByText(/3 logs found/i)).toBeInTheDocument();
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

      describe('when resetAll button is clicked', () => {
        it('should invoke correct handler', () => {
          const { container } = renderViewAllLogs({
            filters: 'completedDate.2021-10-01:2021-10-28,jobProfileInfo.test123,userId.test123',
            query: '',
            sort: 'completedDate',
          });

          const resetAllButton = container.querySelector('#clickable-reset-all');

          fireEvent.click(resetAllButton);

          expect(mockedQueryUpdate).toBeCalledWith({ filters: '', sort: '-completedDate', query: '', qindex: '' });
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

        expect(await findByText(/3 logs found/i)).toBeInTheDocument();
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
    it('should have valid links', () => {
      const { getByText } = renderViewAllLogs(defaultQuery);

      const fileLink = getByText(/testfile1/i);

      expect(fileLink).toHaveAttribute('href');
    });

    describe('when select logs', () => {
      it('should render a subheading with the number of selected logs', async () => {
        const {
          getAllByLabelText,
          getByText
        } = renderViewAllLogs(defaultQuery);

        fireEvent.click(getAllByLabelText('select item')[0]);
        fireEvent.click(getAllByLabelText('select item')[1]);

        expect(getByText('2 logs selected')).toBeDefined();
      });

      it('should select all logs when click select all', async () => {
        const {
          getByLabelText,
          getAllByLabelText
        } = renderViewAllLogs(defaultQuery);

        const selectAllCheckbox = getByLabelText('select all items');
        const allItemCheckboxes = getAllByLabelText('select item');

        fireEvent.click(selectAllCheckbox);

        expect(selectAllCheckbox.checked).toBe(true);
        expect(allItemCheckboxes.every(checkbox => checkbox.checked)).toBe(true);
      });
    });
  });

  describe('Delete Modal', () => {
    describe('when deleting selected logs', () => {
      it('confirmation modal should appear', () => {
        const {
          getAllByLabelText,
          getByText,
        } = renderViewAllLogs(defaultQuery);

        fireEvent.click(getAllByLabelText('select item')[0]);
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));

        expect(getByText('Confirmation modal')).toBeDefined();
      });
    });

    describe('when confirming logs deletion', () => {
      it('confirmation modal should disappear', async () => {
        deleteJobExecutionsSpy.mockResolvedValue({ jobExecutionDetails: [{}] });

        const {
          getAllByLabelText,
          getByText,
          queryByText,
        } = renderViewAllLogs(defaultQuery);

        fireEvent.click(getAllByLabelText('select item')[0]);
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(queryByText('Confirm'));
        await waitFor(() => expect(queryByText('Confirmation modal')).toBeNull());
      });

      it('is not completed, all checkboxes should be disabled', async () => {
        deleteJobExecutionsSpy.mockResolvedValue({ jobExecutionDetails: [{}] });

        const {
          getAllByLabelText,
          getByLabelText,
          getByText,
        } = renderViewAllLogs(defaultQuery);

        fireEvent.click(getByLabelText('select all items'));
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(getByText('Confirm'));

        expect(getAllByLabelText('select item').every(checkbox => checkbox.disabled)).toBe(true);
      });

      it('is completed, all checkboxes should be enabled', async () => {
        deleteJobExecutionsSpy.mockResolvedValue({ jobExecutionDetails: [{}] });

        const {
          getAllByLabelText,
          getByLabelText,
          getByText,
        } = renderViewAllLogs(defaultQuery);

        fireEvent.click(getByLabelText('select all items'));
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(getByText('Confirm'));

        await waitFor(() => expect(deleteJobExecutionsSpy).toHaveBeenCalled());
        getAllByLabelText('select item').forEach(checkbox => expect(checkbox.disabled).toBeTruthy());
      });

      it('and successful callout should be displayed', async () => {
        deleteJobExecutionsSpy.mockResolvedValue({ jobExecutionDetails: [{}] });

        const {
          getAllByLabelText,
          getByText,
          queryByText,
        } = renderViewAllLogs(defaultQuery);

        fireEvent.click(getAllByLabelText('select item')[0]);
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(getByText('Confirm'));

        await waitFor(() => expect(queryByText('1 data import logs have been successfully deleted.')).toBeDefined());
      });
    });

    describe('when deleting logs failed', () => {
      it('should show callout with error message', async () => {
        deleteJobExecutionsSpy.mockRejectedValueOnce('Cannot delete jobExecutions');

        const {
          getAllByLabelText,
          getByText,
          queryByText,
        } = renderViewAllLogs(defaultQuery);

        fireEvent.click(getAllByLabelText('select item')[0]);
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(getByText('Confirm'));

        await waitFor(() => expect(queryByText('Server communication problem. Please try again')).toBeDefined());
      });
    });

    describe('when canceling logs deletion', () => {
      it('confirmation modal should disappear', async () => {
        const {
          getByLabelText,
          getByText,
          queryByText,
        } = renderViewAllLogs(defaultQuery);

        fireEvent.click(getByLabelText('select all items'));
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(getByText('Cancel'));

        expect(queryByText('Confirmation modal')).toBeNull();
      });

      it('should deselect all logs', () => {
        const {
          getByLabelText,
          getAllByLabelText,
          getByText,
        } = renderViewAllLogs(defaultQuery);

        fireEvent.click(getByLabelText('select all items'));
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(getByText('Cancel'));

        expect(getAllByLabelText('select item').every(checkbox => !checkbox.checked)).toBe(true);
      });
    });
  });

  describe('when filtering logs', () => {
    describe('by query', () => {
      it('should return hrId with the given query', () => {
        const expectedQuery = 'testQuery';
        const queryData = {
          query: {
            query: 'testQuery',
            qindex: 'hrId',
          },
        };

        const query = ViewAllLogsManifest.records.params(null, null, queryData);
        expect(query.hrId).toEqual(expectedQuery);
      });
    });

    describe('by date, status and singleRecordImports', () => {
      it('should return an object as specified', () => {
        const expected = {
          profileIdAny: [OCLC_CREATE_INSTANCE_JOB_ID, OCLC_UPDATE_INSTANCE_JOB_ID],
          statusAny: ['ERROR'],
          completedAfter: ['2022-04-24'],
          completedBefore: ['2022-04-26'],
        };

        const queryData = {
          query: {
            filters: 'singleRecordImports.yes,statusAny.ERROR,completedDate.2022-04-24:2022-04-26',
          },
        };

        const query = ViewAllLogsManifest.records.params(null, null, queryData);
        expect(query).toMatchObject(expected);
      });
    });
  });

  describe('when sorting logs', () => {
    it('should return sortBy object in desc order', () => {
      const expectedSortBy = [`${SORT_MAP.completedDate},desc`];
      const queryData = {
        query: {
          sort: '-completedDate',
        },
      };

      const query = ViewAllLogsManifest.records.params(null, null, queryData);
      expect(expectedSortBy).toEqual(query.sortBy);
    });

    it('should return sortBy object in asc order', () => {
      const expectedSortBy = [`${SORT_MAP.jobProfileName},asc`];
      const queryData = {
        query: {
          sort: 'jobProfileName',
        },
      };

      const query = ViewAllLogsManifest.records.params(null, null, queryData);
      expect(expectedSortBy).toEqual(query.sortBy);
    });
  });
});
