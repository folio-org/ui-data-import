import React from 'react';

import { IfPermission } from '@folio/stripes/core';

import { permissions } from '../../utils';

import {
  LinkTo,
  GroupAction,
  Default,
} from './ItemTemplates';

/**
 * Retrieves and returns list of Column Templates renderProps
 *
 * @param {Component} entity
 * @param {object} menu
 * @param {string} baseUrl
 * @param {boolean} isDefaultProfile
 * @param {boolean} isDuplicateButtonDisabled
 */
export const menuTemplate = ({
  entity,
  menu,
  baseUrl,
  isDefaultProfile,
  isDuplicateButtonDisabled = false,
}) => {
  const {
    props: {
      ENTITY_KEY,
      checkboxList,
      location = {},
      match = {},
    },
  } = entity;
  const { search } = location;
  const { params = {} } = match;

  return {
    addNew: key => (
      <LinkTo
        key={key}
        caption={`ui-data-import.settings.${ENTITY_KEY}.new`}
        icon="plus-sign"
        menu={menu}
        location={`${baseUrl}/create${search}`}
        dataAttributes={{ 'data-test-new-item-menu-button': '' }}
      />
    ),
    edit: key => (
      <LinkTo
        key={key}
        caption="ui-data-import.edit"
        icon="edit"
        menu={menu}
        isDisabled={isDefaultProfile}
        location={`${baseUrl}/edit/${params.id}${search}`}
        dataAttributes={{ 'data-test-edit-item-menu-button': '' }}
      />
    ),
    duplicate: key => (
      <LinkTo
        key={key}
        caption="ui-data-import.duplicate"
        icon="duplicate"
        menu={menu}
        isDisabled={isDuplicateButtonDisabled}
        location={`${baseUrl}/duplicate/${params.id}${search}`}
        dataAttributes={{ 'data-test-duplicate-item-menu-button': '' }}
      />
    ),
    run: key => {
      const handleRun = () => {
        menu.onToggle();
        entity.showRunConfirmation();
      };

      return (
        <Default
          key={key}
          caption="ui-data-import.run"
          icon="play"
          dataAttributes={{ 'data-test-run-item-menu-button': '' }}
          onClick={handleRun}
        />
      );
    },
    exportSelected: key => {
      const { selectedRecords: { size: selectedCount } } = checkboxList;

      return (
        <GroupAction
          key={key}
          menu={menu}
          caption="ui-data-import.exportSelected"
          icon="arrow-down"
          selectedCount={selectedCount}
          dataAttributes={{ 'data-test-export-selected-items-menu-button': '' }}
        />
      );
    },
    selectAll: key => {
      const { selectAll } = checkboxList;

      const handleSelectAllButton = () => {
        menu.onToggle();
        selectAll();
      };

      return (
        <Default
          key={key}
          caption="ui-data-import.selectAll"
          icon="select-all"
          dataAttributes={{ 'data-test-select-all-items-menu-button': '' }}
          onClick={handleSelectAllButton}
        />
      );
    },
    deselectAll: key => {
      const { deselectAll } = checkboxList;

      const handleDeselectAllButton = () => {
        menu.onToggle();
        deselectAll();
      };

      return (
        <Default
          key={key}
          caption="ui-data-import.deselectAll"
          icon="deselect-all"
          dataAttributes={{ 'data-test-deselect-all-items-menu-button': '' }}
          onClick={handleDeselectAllButton}
        />
      );
    },
    delete: key => {
      const handleDelete = () => {
        menu.onToggle();
        entity.showDeleteConfirmation();
      };

      return (
        <Default
          key={key}
          caption="ui-data-import.delete"
          icon="trash"
          dataAttributes={{ 'data-test-delete-item-menu-button': '' }}
          isDisabled={isDefaultProfile}
          onClick={handleDelete}
        />
      );
    },
    restoreDefaults: key => {
      const handleRestoreDefaults = () => {
        menu.onToggle();
        entity.showRestoreConfirmation();
      };

      return (
        <Default
          key={key}
          caption="ui-data-import.settings.fileExtensions.reset"
          icon="replace"
          dataAttributes={{ 'data-test-restore-default-file-extensions-button': '' }}
          onClick={handleRestoreDefaults}
        />
      );
    },
    viewAllLogs: key => {
      return (
        <LinkTo
          key={key}
          caption="ui-data-import.viewAllLogs"
          menu={menu}
          icon="eye-open"
          location="/data-import/job-logs?sort=-completedDate"
        />
      );
    },
    deleteSelectedLogs: key => {
      const handleDelete = () => {
        menu.onToggle();
        entity.showDeleteConfirmation();
      };

      return (
        <IfPermission
          perm={permissions.DELETE_LOGS}
          key={key}
        >
          <Default
            caption="ui-data-import.deleteSelectedLogs"
            icon="trash"
            isDisabled={entity.isDeleteAllLogsDisabled()}
            onClick={handleDelete}
          />
        </IfPermission>
      );
    },
  };
};
