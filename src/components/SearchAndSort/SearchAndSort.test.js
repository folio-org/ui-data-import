import React from 'react';
import { Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
  render,
} from '@testing-library/react';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../test/jest/__mock__';

import { buildMutator } from '@folio/stripes-data-transfer-components/test/helpers';

import { Paneset } from '@folio/stripes/components';

import { Harness } from '../../../test/helpers';
import {
  buildStripes,
  translationsProperties,
} from '../../../test/jest/helpers';

import { SearchAndSort } from './SearchAndSort';

const onSubmitSearchMock = jest.fn();
const onSelectRowMock = jest.fn();
const EditRecordComponentMock = jest.fn(() => <span>EditRecordComponent</span>);
const CreateRecordComponentMock = jest.fn(() => <span>CreateRecordComponent</span>);
const onCreateMock = jest.fn(() => Promise.resolve({ id: 'testId' }));
const onEditMock = jest.fn();

jest.useFakeTimers();

const pathname = '/data-import/job-profile';
const getHistory = (route = pathname) => ({
  length: 1,
  action: 'POP',
  location: { pathname: route },
  block: noop,
  push: noop,
  replace: noop,
  listen: noop,
  createHref: noop,
  go: noop,
  goBack: noop,
  goForward: noop,
});

const stripes = buildStripes();

const resources = (
  totalRecords,
  isPending,
) => ({
  query: {
    query: '',
    sort: '-name',
  },
  resultCount: 100,
  jobProfiles: {
    failed: false,
    hasLoaded: true,
    isPending,
    other: { totalRecords },
    records: [
      {
        childProfiles: [],
        parentProfiles: [],
        dataType: 'MARC',
        deleted: false,
        description: 'Test Description 1',
        id: '80898dee-449f-44dd-9c8e-37d5eb469b1d',
        name: 'Test Name 1',
        updated: '3/16/2021',
        updatedBy: 'System',
      },
    ],
    resource: 'jobProfiles',
  },
});

const mutator = buildMutator({
  query: {
    replace: noop,
    update: noop,
  },
  resultCount: { replace: noop },
});

const searchAndSortProps = ({
  parentResources,
  isFullScreen,
  route = pathname,
}) => ({
  history: getHistory(route),
  location: { pathname: route },
  objectName: 'testObjectName',
  resultsLabel: <span>Results Label</span>,
  searchLabelKey: 'ui-data-import.settings.jobProfiles.title',
  resultCountMessageKey: 'ui-data-import.settings.jobProfiles.count',
  fullWidthContainer: <span>fullWidthContainer</span>,
  finishedResourceName: 'jobProfiles',
  actionMenu: jest.fn(() => <span>Add</span>),
  isFullScreen,
  visibleColumns: [
    'name',
    'description',
    'updated',
    'updatedBy',
  ],
  nsParams: 'sort',
  parentResources,
});

const getSearchAndSortComponent = ({
  objectName,
  resultsLabel,
  searchLabelKey,
  resultCountMessageKey,
  finishedResourceName,
  actionMenu,
  isFullScreen,
  fullWidthContainer,
  parentResources,
  visibleColumns,
  nsParams,
  history,
  location,
}) => (
  <Harness translations={translationsProperties}>
    <Router history={history}>
      <Paneset>
        <SearchAndSort
          stripes={stripes}
          objectName={objectName}
          resultsLabel={resultsLabel}
          initialResultCount={100}
          resultCountIncrement={10}
          searchLabelKey={searchLabelKey}
          resultCountMessageKey={resultCountMessageKey}
          showSingleResult
          fullWidthContainer={fullWidthContainer}
          location={location}
          match={{ path: pathname }}
          parentMutator={mutator}
          parentResources={parentResources}
          ViewRecordComponent={noop}
          EditRecordComponent={EditRecordComponentMock}
          CreateRecordComponent={CreateRecordComponentMock}
          finishedResourceName={finishedResourceName}
          actionMenu={actionMenu}
          isFullScreen={isFullScreen}
          visibleColumns={visibleColumns}
          nsParams={nsParams}
          onSubmitSearch={onSubmitSearchMock}
          onSelectRow={onSelectRowMock}
          onCreate={onCreateMock}
          onEdit={onEditMock}
        />
      </Paneset>
    </Router>
  </Harness>
);

const renderSearchAndSort = props => {
  return render(getSearchAndSortComponent(props));
};

describe.skip('SearchAndSort component', () => {
  afterEach(() => {
    onSubmitSearchMock.mockClear();
    onSelectRowMock.mockClear();
    EditRecordComponentMock.mockClear();
    onCreateMock.mockClear();
    onEditMock.mockClear();
  });

  it('should be rendered with no axe errors', () => {
    const { container } = renderSearchAndSort(searchAndSortProps({
      parentResources: resources(1, false),
      isFullScreen: true,
      route: `${pathname}/create`,
    }));

    runAxeTest({ rootNode: container });
  });

  it('should be rendered', () => {
    const { getByText } = renderSearchAndSort(searchAndSortProps({
      parentResources: resources(1, false),
      isFullScreen: true,
      route: `${pathname}/create`,
    }));

    expect(getByText('Results Label')).toBeInTheDocument();
    expect(getByText('1 job profile')).toBeInTheDocument();
  });

  describe('after rerender', () => {
    it('single record should be rendered', () => {
      const {
        getByText,
        rerender,
      } = renderSearchAndSort(searchAndSortProps({
        parentResources: resources(2, undefined),
        isFullScreen: false,
        route: `${pathname}/create`,
      }));

      rerender(getSearchAndSortComponent(searchAndSortProps({
        parentResources: resources(1, false),
        isFullScreen: false,
        route: `${pathname}/create`,
      })));

      expect(getByText('Test Name 1')).toBeInTheDocument();
    });
  });

  describe('when click on record', () => {
    it('onSelectRow function should be called', () => {
      const { getByText } = renderSearchAndSort({
        ...searchAndSortProps({
          parentResources: resources(1, false),
          isFullScreen: false,
          route: `${pathname}/create`,
        }),
      });

      fireEvent.click(getByText('name'));
      fireEvent.click(getByText('Test Name 1'));

      expect(onSelectRowMock).toHaveBeenCalled();
    });
  });

  describe('when set search term', () => {
    it('search input should change the value', () => {
      const { getByLabelText } = renderSearchAndSort(searchAndSortProps({
        parentResources: resources(1, false),
        isFullScreen: false,
        route: `${pathname}/create`,
      }));
      const searchInput = getByLabelText('Search Job profiles');

      searchInput.focus();

      fireEvent.change(searchInput, { target: { value: 'test value' } });

      expect(searchInput.value).toEqual('test value');
    });

    describe('when click clean search button', () => {
      it('search input should be empty', () => {
        const { getByLabelText } = renderSearchAndSort(searchAndSortProps({
          parentResources: resources(1, false),
          isFullScreen: true,
          route: `${pathname}/create`,
        }));
        const searchInput = getByLabelText('Search Job profiles');

        searchInput.focus();

        fireEvent.change(searchInput, { target: { value: 'test value' } });

        const clearButton = getByLabelText('Clear this field');

        fireEvent.click(clearButton);

        expect(searchInput.value).toEqual('');
      });
    });

    describe('when click Search button', () => {
      it('search function should be called', () => {
        jest.useFakeTimers();
        const {
          getByLabelText,
          getByText,
        } = renderSearchAndSort(searchAndSortProps({
          parentResources: resources(1, false),
          isFullScreen: true,
          route: `${pathname}/create`,
        }));
        const searchInput = getByLabelText('Search Job profiles');

        searchInput.focus();

        fireEvent.change(searchInput, { target: { value: 'test value' } });
        fireEvent.click(getByText('Search'));
        jest.runOnlyPendingTimers();

        expect(onSubmitSearchMock).toHaveBeenCalled();
      });
    });
  });

  describe('when layer is create', () => {
    it('CreateRecordComponent should be rendered', () => {
      const { getByText } = renderSearchAndSort(searchAndSortProps({
        parentResources: resources(1, false),
        isFullScreen: true,
        route: `${pathname}/create`,
      }));

      expect(getByText('CreateRecordComponent')).toBeInTheDocument();
    });

    describe('when create new record', () => {
      it('function for creating should be called', async () => {
        renderSearchAndSort(searchAndSortProps({
          parentResources: resources(1, false),
          isFullScreen: true,
          route: `${pathname}/create`,
        }));

        await waitFor(() => CreateRecordComponentMock.mock.calls[0][0].onSubmit());

        expect(onCreateMock).toHaveBeenCalled();
      });
    });
  });

  /* describe('when layer is edit', () => {
    it('EditRecordComponent should be rendered', () => {
      const { getByText } = renderSearchAndSort(searchAndSortProps({
        parentResources: resources(1, false),
        isFullScreen: true,
        route: `${pathname}/edit/testid`,
      }));

      expect(getByText('EditRecordComponent')).toBeInTheDocument();
    });

    describe('when edit the record', () => {
      it('function for editing should be called', async () => {
        renderSearchAndSort(searchAndSortProps({
          parentResources: resources(1, false),
          isFullScreen: true,
          route: `${pathname}/edit/testid`,
        }));

        await waitFor(() => EditRecordComponentMock.mock.calls[0][0].onSubmit());

        expect(onEditMock).toHaveBeenCalled();
      });
    });
  }); */

  /* describe('when layer is duplicate', () => {
    it('EditRecordComponent should be rendered', () => {
      const { getByText } = renderSearchAndSort(searchAndSortProps({
        parentResources: resources(1, false),
        isFullScreen: true,
        route: `${pathname}/duplicate/testid`,
      }));

      expect(getByText('EditRecordComponent')).toBeInTheDocument();
    });

    describe('when duplicate the record', () => {
      it('function for creating should be called', async () => {
        renderSearchAndSort(searchAndSortProps({
          parentResources: resources(1, false),
          isFullScreen: true,
          route: `${pathname}/duplicate/testid`,
        }));

        await waitFor(() => EditRecordComponentMock.mock.calls[0][0].onSubmit());

        expect(onCreateMock).toHaveBeenCalled();
      });
    });
  }); */
});
