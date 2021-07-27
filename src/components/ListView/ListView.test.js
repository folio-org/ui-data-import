import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';

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
  })
}));

const func = jest.fn();
let mySet = new Set();
mySet.add('testId1');

const listViewPropsActionProfiles = {
  resources: {
    query: {
      filters: 'actionProfilesFilter',
      notes: true,
    },
    records: {
      hasLoaded: true,
      isPending: false,
      other: {
        totalRecords: 1,
      },
      successfulMutations: [{
        record: {
          id: 'testId1'
        }
      }]
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
      },]
    }
  },
  objectName: 'actionProfiles',
  mutator: {
    query: {
      replace: func,
      update: func,
    },
    resultCount: {
      replace: func,
    },
    actionProfiles: {
      POST: func,
      PUT: func,
    },
  },
  location: {
    search: '/action-profiles-search',
    pathname: '/action-profiles-path',
  },
  match: { path: '/action-profiles-path' },
  history: history.push,
  selectedRecord: {
    record: {
      id: 'testId1',
      parentProfiles: 'testParent',
      childProfiles: 'testChild',
    },
    hasLoaded: true,
  },
  checkboxList: {
    selectedRecords: mySet,
    isAllSelected: false,
    selectRecord: func,
    selectAll: func,
    deselectAll: func,
    handleSelectAllCheckbox: func,
  },
  actionMenuItems: [
    'addNew',
    'exportSelected',
    'selectAll',
    'deselectAll',
  ],
  label: <span>Action Profiles Label</span>,
  setList: func,
  RecordView: func,
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
  renderHeaders: func,
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
      other: {
        totalRecords: 1,
      },
      successfulMutations: [{
        record: {
          id: 'testId1'
        }
      }]
    },
    actionProfiles: {
      records: ['test1', 'test2']
    }
  },
  objectName: 'fileExtensions',
  mutator: {
    query: {
      replace: func,
      update: func,
    },
    resultCount: {
      replace: func,
    },
    fileExtensions: {
      POST: func,
      PUT: func,
      DELETE: func,
    },
    restoreDefaults: {
      POST: func,
    }
  },
  location: {
    search: '/file-extensions-search',
    pathname: '/file-extensions-path',
  },
  match: { path: '/file-extensions-path' },
  history: history.push,
  selectedRecord: {
    record: {
      id: 'testId1',
      parentProfiles: 'testParent',
      childProfiles: 'testChild',
    },
    hasLoaded: true,
  },
  checkboxList: {
    selectedRecords: mySet,
    isAllSelected: false,
    selectRecord: func,
    selectAll: func,
    deselectAll: func,
    handleSelectAllCheckbox: func,
  },
  actionMenuItems: [
    'addNew',
    'restoreDefaults',
  ],
  label: <span>File Extensions Label</span>,
  setList: func,
  RecordView: func,
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
  renderHeaders: func,
};

const renderListView = ({
  resources,
  mutator,
  location,
  match,
  history,
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
        const { container, getByText, debug } = renderListView(listViewPropsFileExtensions);
        const actionsButton = getByText('Actions');
        const resetAll = container.querySelector('button.button.dropdownItem');
        
        fireEvent.click(actionsButton);
  
        fireEvent.click(resetAll);
        
        const modalHeading = container.querySelector('.modalLabel');

        expect(modalHeading).toBeDefined();
      });

      describe('when modal is opened', () => {
        it('should close modal', () => {
          const { container, getByText, debug } = renderListView(listViewPropsFileExtensions);
          const actionsButton = getByText('Actions');
          const resetAll = container.querySelector('button.button.dropdownItem');
          
          fireEvent.click(actionsButton);
    
          fireEvent.click(resetAll);
          debug();
          const modalHeading = container.querySelector('.modalLabel');
          const closeModal = getByText('Reset all');
          
          fireEvent.click(closeModal);

          expect(modalHeading).toBeNull();
        });
      });
    });
  });
});
