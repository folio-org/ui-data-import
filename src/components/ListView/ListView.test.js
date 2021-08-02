import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { fireEvent, waitFor } from '@testing-library/react';

import { createMemoryHistory } from 'history';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { ListView } from './ListView';

const history = createMemoryHistory();

history.push = jest.fn();

jest.mock('../ViewContainer/getCRUDActions', () => ({
  getCRUDActions: () => ({
    onCreate: () => 'success!',
    onEdit: () => 'success!',
    onDelete: () => 'success!',
    onRestoreDefaults: () => 'success!',
  }),
}));

const testSet = new Set();

testSet.add('testId1');

const listViewPropsActionProfiles = {
  resources: {
    query: {
      filters: 'actionProfilesFilter',
      notes: true,
    },
    records: {
      hasLoaded: true,
      isPending: false,
      other: { totalRecords: 1 },
      successfulMutations: [{ record: { id: 'testId1' } }],
    },
    actionProfiles: {
      records: [{
        fileName: 'test name',
        name: 'test name',
        id: 'testId1',
        description: 'test description',
        extension: 'test extension',
        dataTypes: '',
        importBlocked: false,
        metadata: { updatedDate: '2021-03-31' },
        status: 'COMMITTED',
        progress: {
          current: 0,
          total: 0,
        },
        userInfo: {
          firstName: 'firstName',
          lastName: 'lastName',
          userName: 'userName',
        },
        runBy: {
          firstName: 'firstName',
          lastName: 'lastName',
        },
        completedDate: '2021-03-31',
        jobProfileInfo: { name: 'test name' },
      }],
    },
  },
  objectName: 'actionProfiles',
  mutator: {
    query: {
      replace: jest.fn(),
      update: jest.fn(),
    },
    resultCount: { replace: jest.fn() },
    actionProfiles: {
      POST: jest.fn(),
      PUT: jest.fn(),
    },
  },
  location: {
    search: '/action-profiles-search',
    pathname: '/action-profiles-path',
  },
  match: { path: '/action-profiles-path' },
  selectedRecord: {
    record: {
      id: 'testId1',
      parentProfiles: 'testParent',
      childProfiles: 'testChild',
    },
    hasLoaded: true,
  },
  setList: jest.fn(),
  RecordView: jest.fn(),
  history: { push: history.push },
  checkboxList: {
    selectedRecords: testSet,
    isAllSelected: false,
    selectRecord: jest.fn(),
    selectAll: jest.fn(),
    deselectAll: jest.fn(),
    handleSelectAllCheckbox: jest.fn(),
  },
  actionMenuItems: [
    'addNew',
    'exportSelected',
    'selectAll',
    'deselectAll',
  ],
  label: <span>Action Profiles Label</span>,
  ENTITY_KEY: 'actionProfiles',
  visibleColumns: [
    'name',
    'action',
    'tags',
    'updated',
    'updatedBy',
  ],
  columnWidths: {
    isChecked: '35px',
    name: '300px',
    action: '200px',
    tags: '150px',
    updated: '100px',
    updatedBy: '250px',
  },
  initialValues: {
    name: '',
    description: '',
  },
  renderHeaders: () => {
    return {
      name: 'Name',
      action: 'Action',
      tags: 'Tags',
      updated: 'Updated',
      updatedBy: 'Updated By',
    };
  },
};

const listViewPropsFileExtensions = {
  resources: {
    query: {
      filters: 'fileExtensionsFilter',
      notes: true,
    },
    records: {
      hasLoaded: true,
      isPending: false,
      other: { totalRecords: 1 },
      successfulMutations: [{ record: { id: 'testId1' } }],
    },
    actionProfiles: { records: ['test1', 'test2'] },
  },
  objectName: 'fileExtensions',
  mutator: {
    query: {
      replace: jest.fn(),
      update: jest.fn(),
    },
    resultCount: { replace: jest.fn() },
    fileExtensions: {
      POST: jest.fn(),
      PUT: jest.fn(),
      DELETE: jest.fn(),
    },
    restoreDefaults: { POST: jest.fn() },
  },
  location: {
    search: '/file-extensions-search',
    pathname: '/file-extensions-path',
  },
  match: { path: '/file-extensions-path' },
  selectedRecord: {
    record: {
      id: 'testId1',
      parentProfiles: 'testParent',
      childProfiles: 'testChild',
    },
    hasLoaded: true,
  },
  setList: jest.fn(),
  RecordView: jest.fn(),
  history: { push: history.push },
  checkboxList: {
    selectedRecords: testSet,
    isAllSelected: false,
    selectRecord: jest.fn(),
    selectAll: jest.fn(),
    deselectAll: jest.fn(),
    handleSelectAllCheckbox: jest.fn(),
  },
  actionMenuItems: [
    'addNew',
    'restoreDefaults',
  ],
  label: <span>File Extensions Label</span>,
  ENTITY_KEY: 'fileExtensions',
  visibleColumns: [
    'extension',
    'importBlocked',
    'dataTypes',
    'updated',
    'updatedBy',
  ],
  columnWidths: {},
  initialValues: {
    importBlocked: false,
    description: '',
    extension: '',
    dataTypes: [],
  },
  renderHeaders: () => {
    return {
      extension: 'Extensions',
      importBlocked: 'Import Blocked',
      dataTypes: 'Data types',
      updated: 'Updated',
      updatedBy: 'Updated By',
    };
  },
};

const renderListView = ({
  resources,
  mutator,
  location,
  match,
  checkboxList,
  actionMenuItems,
  label,
  setList,
  RecordView,
  ENTITY_KEY,
  visibleColumns,
  columnWidths,
  initialValues,
  renderHeaders,
}) => {
  const component = (
    <Router>
      <ListView
        resources={resources}
        mutator={mutator}
        location={location}
        match={match}
        history={history}
        checkboxList={checkboxList}
        actionMenuItems={actionMenuItems}
        label={label}
        setList={setList}
        RecordView={RecordView}
        ENTITY_KEY={ENTITY_KEY}
        visibleColumns={visibleColumns}
        columnWidths={columnWidths}
        initialValues={initialValues}
        renderHeaders={renderHeaders}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ListView', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  it('should be rendered as File Extensions', () => {
    const { getByText } = renderListView(listViewPropsFileExtensions);

    expect(getByText('File Extensions Label')).toBeDefined();
  });

  it('should be rendered as Action Profiles', () => {
    const { getByText } = renderListView(listViewPropsActionProfiles);

    expect(getByText('Action Profiles Label')).toBeDefined();
  });

  describe('when click on show Restore Modal', () => {
    describe('when click on Actions button', () => {
      it('dropdown should be shown', () => {
        const { getByText } = renderListView(listViewPropsFileExtensions);
        const actionsButton = getByText('Actions');

        const resetAll = getByText('Reset all extension mappings to system defaults');

        fireEvent.click(actionsButton);

        expect(resetAll).toBeDefined();
      });
    });

    describe('when click on Reset All File Extensions', () => {
      it('modal should be shown', () => {
        const {
          container,
          getByText,
        } = renderListView(listViewPropsFileExtensions);
        const actionsButton = getByText('Actions');

        fireEvent.click(actionsButton);

        const resetAll = getByText('Reset all extension mappings to system defaults');

        fireEvent.click(resetAll);

        const modalContent = getByText('This will reset the file extension mappings to the system defaults');

        expect(modalContent).toBeDefined();
      });

      describe('when modal is opened', () => {
        it('should close modal', () => {
          const { getByText, debug } = renderListView(listViewPropsFileExtensions);
          const actionsButton = getByText('Actions');

          fireEvent.click(actionsButton);

          const resetAll = getByText('Reset all extension mappings to system defaults');

          fireEvent.click(resetAll);

          const modalHeading = getByText('Reset all file extension mappings');
          const closeModal = getByText('Reset all');

          fireEvent.click(closeModal);
debug();
          expect(modalHeading).toBeNull();
        });
      });
    });
  });
});
