import React from 'react';
import { Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
  render,
} from '@testing-library/react';
import { noop } from 'lodash';

import {
  buildMutator,
  Harness,
} from '@folio/stripes-data-transfer-components/test/helpers';

import '../../../test/jest/__mock__';
import { Paneset } from '@folio/stripes/components';
import {
  buildStripes,
  translationsProperties,
} from '../../../test/jest/helpers';

import { SearchAndSort } from './SearchAndSort';

const onSubmitSearchMock = jest.fn();
const onSelectRowMock = jest.fn();
const EditRecordComponentMock = jest.fn(() => <span>EditRecordComponent</span>);
const onCreateMock = jest.fn(() => Promise.resolve({ id: 'testId' }));
const onEditMock = jest.fn();

jest.useFakeTimers();

const getHistory = search => ({
  length: 1,
  action: 'POP',
  location: {
    pathname: '/data-import/job-profile',
    search,
  },
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
  layer,
}) => ({
  history: getHistory(layer),
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
          match={{ path: '' }}
          parentMutator={mutator}
          parentResources={parentResources}
          ViewRecordComponent={noop}
          finishedResourceName={finishedResourceName}
          actionMenu={actionMenu}
          isFullScreen={isFullScreen}
          EditRecordComponent={EditRecordComponentMock}
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

// eslint-disable-next-line no-only-tests/no-only-tests
describe.skip('SearchAndSort component', () => {
  afterEach(() => {
    onSubmitSearchMock.mockClear();
    onSelectRowMock.mockClear();
    EditRecordComponentMock.mockClear();
    onCreateMock.mockClear();
    onEditMock.mockClear();
  });

  it('should be rendered', () => {
    const { getByText } = renderSearchAndSort(searchAndSortProps({
      parentResources: resources(1, false),
      isFullScreen: true,
      layer: '?layer=create',
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
        layer: '?layer=create',
      }));

      rerender(getSearchAndSortComponent(searchAndSortProps({
        parentResources: resources(1, false),
        isFullScreen: false,
        layer: '?layer=create',
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
          layer: '?layer=create',
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
        layer: '?layer=create',
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
          layer: '?layer=create',
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
          layer: '?layer=create',
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

  describe('EditRecordComponent', () => {
    describe('when layer is create', () => {
      it('should be rendered', () => {
        const { getByText } = renderSearchAndSort(searchAndSortProps({
          parentResources: resources(1, false),
          isFullScreen: true,
          layer: '?layer=create',
        }));

        expect(getByText('EditRecordComponent')).toBeInTheDocument();
      });

      describe('when create new record', () => {
        it('function for creating should be called', async () => {
          renderSearchAndSort(searchAndSortProps({
            parentResources: resources(1, false),
            isFullScreen: true,
            layer: '?layer=create',
          }));

          await waitFor(() => EditRecordComponentMock.mock.calls[0][0].onSubmit());

          expect(onCreateMock).toHaveBeenCalled();
        });
      });
    });

    describe('when layer is edit', () => {
      it('should be rendered', () => {
        const { getByText } = renderSearchAndSort(searchAndSortProps({
          parentResources: resources(1, false),
          isFullScreen: true,
          layer: '?layer=edit',
        }));

        expect(getByText('EditRecordComponent')).toBeInTheDocument();
      });

      describe('when edit the record', () => {
        it('function for editing should be called', async () => {
          renderSearchAndSort(searchAndSortProps({
            parentResources: resources(1, false),
            isFullScreen: true,
            layer: '?layer=edit',
          }));

          await waitFor(() => EditRecordComponentMock.mock.calls[0][0].onSubmit());

          expect(onEditMock).toHaveBeenCalled();
        });
      });
    });

    describe('when layer is duplicate', () => {
      it('should be rendered', () => {
        const { getByText } = renderSearchAndSort(searchAndSortProps({
          parentResources: resources(1, false),
          isFullScreen: true,
          layer: '?layer=duplicate',
        }));

        expect(getByText('EditRecordComponent')).toBeInTheDocument();
      });

      describe('when duplicate the record', () => {
        it('function for creating should be called', async () => {
          renderSearchAndSort(searchAndSortProps({
            parentResources: resources(1, false),
            isFullScreen: true,
            layer: '?layer=duplicate',
          }));

          await waitFor(() => EditRecordComponentMock.mock.calls[0][0].onSubmit());

          expect(onCreateMock).toHaveBeenCalled();
        });
      });
    });
  });
});
