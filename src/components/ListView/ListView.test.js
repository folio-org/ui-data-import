import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { noop } from 'lodash';
import { createMemoryHistory } from 'history';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/test/helpers';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import {
  buildStripes,
  translationsProperties,
} from '../../../test/jest/helpers';

import { ListView } from './ListView';

const stripes = buildStripes();

const mutator = buildMutator({
  query: {
    replace: noop,
    update: noop,
  },
  resultCount: { replace: noop },
  actionProfiles: {
    POST: noop,
    PUT: noop,
  },
  fileExtensions: {
    POST: noop,
    PUT: noop,
    DELETE: noop,
  },
  restoreDefaults: { POST: noop },
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
    selectRecord: noop,
    selectAll: noop,
    deselectAll: noop,
    handleSelectAllCheckbox: noop,
  },
  objectName: 'actionProfiles',
  setList: noop,
  RecordView: noop,
  history: { push: history.push },
  columnWidths: {},
  initialValues: {},
  detailProps: { jsonSchemas: { identifierTypes: [] } },
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
  detailProps,
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
        stripes={stripes}
        detailProps={detailProps}
        ViewRecordComponent={noop}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ListView component', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  describe('when profile type is Action Profiles', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderListView({
        ...listViewProps,
        ...listViewPropsActionProfiles,
      });

      await runAxeTest({ rootNode: container });
    });

    it('should render correct label', () => {
      const { getByText } = renderListView({
        ...listViewProps,
        ...listViewPropsActionProfiles,
      });

      expect(getByText('Action Profiles Label')).toBeDefined();
    });
  });

  describe('when profile type is File extention', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderListView({
        ...listViewProps,
        ...listViewPropsFileExtensions,
      });

      await runAxeTest({ rootNode: container });
    });

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
