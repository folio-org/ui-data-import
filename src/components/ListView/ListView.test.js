import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/test/helpers';

import { createMemoryHistory } from 'history';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { ListView } from './ListView';

const mutator = buildMutator({
  query: {
    replace: jest.fn(),
    update: jest.fn(),
  },
  resultCount: { replace: jest.fn() },
  actionProfiles: {
    POST: jest.fn(),
    PUT: jest.fn(),
  },
  fileExtensions: {
    POST: jest.fn(),
    PUT: jest.fn(),
    DELETE: jest.fn(),
  },
  restoreDefaults: { POST: jest.fn().mockImplementation() },
});

const resources = buildResources({
  query: {
    filters: 'testFilter',
    notes: true,
  },
  records: {
    hasLoaded: true,
    isPending: false,
    other: { totalRecords: 1 },
    successfulMutations: [{ record: { id: 'testId1' } }],
  },
  actionProfiles: { records: ['test1', 'test2'] },
});

const history = createMemoryHistory();

history.push = jest.fn();

jest.mock('../ViewContainer/getCRUDActions', () => ({ getCRUDActions: () => ({ onRestoreDefaults: jest.fn() }) }));
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

const testSet = new Set(['testId1']);

const listViewProps = {
  selectedRecord: {
    record: {
      id: 'testId1',
      parentProfiles: 'testParent',
      childProfiles: 'testChild',
    },
    hasLoaded: true,
  },
  checkboxList: {
    selectedRecords: testSet,
    isAllSelected: false,
    selectRecord: jest.fn(),
    selectAll: jest.fn(),
    deselectAll: jest.fn(),
    handleSelectAllCheckbox: jest.fn(),
  },
  objectName: 'actionProfiles',
  setList: jest.fn(),
  RecordView: jest.fn(),
  history: { push: history.push },
  columnWidths: {},
  initialValues: {},
};

const listViewPropsActionProfiles = {
  location: {
    search: '/action-profiles-search',
    pathname: '/action-profiles-path',
  },
  match: { path: '/action-profiles-path' },
  label: <span>Action Profiles Label</span>,
  ENTITY_KEY: 'actionProfiles',
  visibleColumns: [
    'name',
    'action',
    'tags',
    'updated',
    'updatedBy',
  ],
  renderHeaders: () => ({
    name: 'Name',
    action: 'Action',
    tags: 'Tags',
    updated: 'Updated',
    updatedBy: 'Updated By',
  }),
};

const listViewPropsFileExtensions = {
  location: {
    search: '/file-extensions-search',
    pathname: '/file-extensions-path',
  },
  match: { path: '/file-extensions-path' },
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
  renderHeaders: () => ({
    extension: 'Extensions',
    importBlocked: 'Import Blocked',
    dataTypes: 'Data types',
    updated: 'Updated',
    updatedBy: 'Updated By',
  }),
};

const renderListView = ({
  location,
  match,
  checkboxList,
  actionMenuItems,
  label,
  setList,
  RecordView,
  ENTITY_KEY,
  visibleColumns,
  renderHeaders,
  initialValues,
  columnWidths,
  objectName,
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
        renderHeaders={renderHeaders}
        initialValues={initialValues}
        columnWidths={columnWidths}
        objectName={objectName}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ListView', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  describe('when profile type is Action Profiles', () => {
    it('should render correct label', () => {
      const { getByText } = renderListView({
        ...listViewProps,
        ...listViewPropsActionProfiles,
      });

      expect(getByText('Action Profiles Label')).toBeDefined();
    });
  });

  describe('when profile type is File extention', () => {
    it('should render correct label', () => {
      const { getByText } = renderListView({
        ...listViewProps,
        ...listViewPropsFileExtensions,
      });

      expect(getByText('File Extensions Label')).toBeDefined();
    });
  });

  describe('when clicking on show Restore Modal', () => {
    describe('when clicking on Actions button', () => {
      it('dropdown should be shown', () => {
        const { getByText } = renderListView({
          ...listViewProps,
          ...listViewPropsFileExtensions,
        });
        const actionsButton = getByText('Actions');

        const resetAllItem = getByText('Reset all extension mappings to system defaults');

        fireEvent.click(actionsButton);

        expect(resetAllItem).toBeDefined();
      });
    });

    describe('when click on Reset All File Extensions', () => {
      it('modal window should be shown', () => {
        const { getByText } = renderListView({
          ...listViewProps,
          ...listViewPropsFileExtensions,
        });
        const actionsButton = getByText('Actions');

        fireEvent.click(actionsButton);

        const resetAllItem = getByText('Reset all extension mappings to system defaults');

        fireEvent.click(resetAllItem);

        const modalContent = getByText('Confirmation modal');

        expect(modalContent).toBeDefined();
      });

      describe('when clicking on modal close button', () => {
        it('modal window should be closed', async () => {
          const { getByText } = renderListView({
            ...listViewProps,
            ...listViewPropsFileExtensions,
          });
          const actionsButton = getByText('Actions');

          fireEvent.click(actionsButton);

          const resetAllItem = getByText('Reset all extension mappings to system defaults');

          fireEvent.click(resetAllItem);

          const modalHeading = getByText('Confirmation modal');
          const closeModal = getByText('Confirm');

          await waitFor(() => fireEvent.click(closeModal));

          expect(modalHeading).not.toBeVisible();
        });
      });
    });
  });
});
