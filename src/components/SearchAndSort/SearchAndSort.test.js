import React from 'react';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';

import { buildMutator } from '@folio/stripes-data-transfer-components/test/helpers';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import {
  buildStripes,
  translationsProperties,
} from '../../../test/jest/helpers';

import { ViewJobProfile } from '../../settings/JobProfiles/ViewJobProfile';
import { SearchAndSort } from './SearchAndSort';

const history = createMemoryHistory();

const onSubmitSearchMock = jest.fn();
const onSelectRowMock = jest.fn();

jest.useFakeTimers();

const stripes = buildStripes();

const resources = {
  query: {
    query: '',
    sort: '-name',
  },
  resultCount: 100,
  jobProfiles: {
    failed: false,
    hasLoaded: true,
    isPending: false,
    other: { totalRecords: 1 },
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
};
const mutator = buildMutator({
  query: {
    replace: noop,
    update: noop,
  },
  resultCount: { replace: noop },
});

const searchAndSortProps = ({
  isFullScreen,
}) => ({
  objectName: 'testObjectName',
  resultsLabel: <span>Results Label</span>,
  searchLabelKey: 'ui-data-import.settings.jobProfiles.title',
  resultCountMessageKey: 'ui-data-import.settings.jobProfiles.count',
  location: {
    search: '?layer=create',
    pathname: '',
  },
  fullWidthContainer: <span>fullWidthContainer</span>,
  finishedResourceName: 'jobProfiles',
  actionMenu: jest.fn(() => <span>Add</span>),
  isFullScreen,
  EditRecordComponent: jest.fn(() => <span>EditRecordComponent</span>),
  visibleColumns: [
    'name',
    'description',
    'updated',
    'updatedBy',
  ],
  nsParams: 'sort',
  onSelectRow: onSelectRowMock,
});

const renderSearchAndSort = ({
  objectName,
  resultsLabel,
  searchLabelKey,
  resultCountMessageKey,
  location,
  finishedResourceName,
  actionMenu,
  isFullScreen,
  fullWidthContainer,
  EditRecordComponent,
  visibleColumns,
  nsParams,
  onSelectRow,
}) => {
  const component = (
    <Router>
      <SearchAndSort
        stripes={stripes}
        history={history}
        objectName={objectName}
        resultsLabel={resultsLabel}
        initialResultCount={100}
        resultCountIncrement={10}
        searchLabelKey={searchLabelKey}
        resultCountMessageKey={resultCountMessageKey}
        location={location}
        fullWidthContainer={fullWidthContainer}
        match={{ path: '/settings/data-import/job-profiles' }}
        parentMutator={mutator}
        parentResources={resources}
        ViewRecordComponent={() => <div>ViewRecordComponent</div>}
        finishedResourceName={finishedResourceName}
        actionMenu={actionMenu}
        isFullScreen={isFullScreen}
        EditRecordComponent={EditRecordComponent}
        visibleColumns={visibleColumns}
        nsParams={nsParams}
        onSubmitSearch={onSubmitSearchMock}
        onSelectRow={onSelectRow}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('SearchAndSort component', () => {
  afterEach(() => {
    onSubmitSearchMock.mockClear();
    onSelectRowMock.mockClear();
  });

  it('should be rendered2', () => {
    const { getByText, debug } = renderSearchAndSort(searchAndSortProps({ isFullScreen: false }));
    debug()
  });

  describe('when click on record', () => {
    it('onSelectRow function should be called', () => {
      const { getByText } = renderSearchAndSort({
        ...searchAndSortProps({ isFullScreen: false }),
        onSelectRow: onSelectRowMock,
      });

      fireEvent.click(getByText('name'));
      fireEvent.click(getByText('Test Name 1'));

      expect(onSelectRowMock).toHaveBeenCalled();
    });

    /* describe('when should fallback to regular record display', () => {
      it('onSelectRow function should not be called', () => {
        const { getByText } = renderSearchAndSort({
          ...searchAndSortProps({ isFullScreen: false }),
          onSelectRow: null,
        });

        fireEvent.click(getByText('Test Name 1'));

        expect(onSelectRowMock).not.toHaveBeenCalled();
      });
    }); */
  });

  it('should be rendered', () => {
    const { getByText } = renderSearchAndSort(searchAndSortProps({isFullScreen: true}));

    expect(getByText('Results Label')).toBeDefined();
    expect(getByText('1 job profile')).toBeDefined();
  });

  describe('when set search term', () => {
    it('search input should change the value', () => {
      const { getByLabelText } = renderSearchAndSort(searchAndSortProps({isFullScreen: false}));
        const searchInput = getByLabelText('Search Job profiles');
        searchInput.focus();

        fireEvent.change(searchInput, { target: { value: 'test value' } });

        expect(searchInput.value).toEqual('test value');
    });

    describe('when click clean search button', () => {
      it('search input should be empty', () => {
        const { getByLabelText } = renderSearchAndSort(searchAndSortProps({isFullScreen: true}));
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
        const { getByLabelText, getByText, } = renderSearchAndSort(searchAndSortProps({isFullScreen: true}));
        const searchInput = getByLabelText('Search Job profiles');
        searchInput.focus();

        fireEvent.change(searchInput, { target: { value: 'test value' } });
        fireEvent.click(getByText('Search'));
        jest.runAllTimers();

        expect(onSubmitSearchMock).toHaveBeenCalled;
      });
    });
  });
});
