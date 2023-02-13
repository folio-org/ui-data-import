import React, {
  memo,
  useState,
  useEffect,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  noop,
  camelCase,
} from 'lodash';

import { Pluggable } from '@folio/stripes/core';
import { ConfirmationModal } from '@folio/stripes/components';

import { useCheckboxList } from '../../utils';
import { AssociatedList } from './AssociatedList';

import css from './ProfileAssociator.css';

export const AssociatorEditable = memo(({
  intl,
  entityKey,
  namespaceKey,
  parentId,
  parentType,
  masterType,
  detailType,
  profileType,
  profileName,
  contentData,
  dataAttributes,
  isMultiSelect,
  isMultiLink,
  profileShape,
  relationsToAdd,
  relationsToDelete,
  onLink,
  onUnlink,
  isEditMode,
}) => {
  const [currentData, setCurrentData] = useState([]);
  const [current, setCurrent] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [pluginDisabled, setPluginDisabled] = useState(false);

  const isPluginDisabled = curData => !isMultiSelect && curData && curData.length > 0;

  useEffect(() => {
    setCurrentData(contentData);
    setPluginDisabled(isPluginDisabled(contentData));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkboxList = useCheckboxList(currentData);
  const columnWidths = {
    name: '250px',
    updated: '100px',
    tags: '150px',
    unlink: '65px',
  };

  const findRelIndex = (relations, line) => {
    const masterId = masterType === parentType ? parentId : line.id;
    const detailId = masterType === parentType ? line.id : parentId;

    return relations.findIndex(rel => rel.masterProfileId === masterId && rel.detailProfileId === detailId);
  };

  const composeRelations = lines => lines.map(item => ({
    masterProfileId: masterType === parentType ? parentId : item.id,
    masterProfileType: masterType,
    detailProfileId: masterType === parentType ? item.id : parentId,
    detailProfileType: detailType,
  }));

  const link = lines => {
    const uniqueLines = lines.filter(line => currentData.findIndex(item => item.id === line.id) === -1);
    const newData = [...currentData, ...uniqueLines];
    const linesToAdd = uniqueLines.filter(line => findRelIndex(relationsToDelete, line) === -1);

    if (linesToAdd && linesToAdd.length) {
      const relsToAdd = [...relationsToAdd, ...composeRelations(linesToAdd)];

      onLink(relsToAdd);
    }

    setCurrentData(newData);
    setPluginDisabled(isPluginDisabled(newData));
  };

  const remove = row => {
    const index = currentData.findIndex(item => item.id === row.id);
    const newIdx = findRelIndex(relationsToAdd, row);
    const needsToBeUnlinked = newIdx < 0;

    if (needsToBeUnlinked) {
      const relsToDel = [...relationsToDelete, ...composeRelations([row])];

      onUnlink(relsToDel);
    }

    const newData = [...currentData];

    newData.splice(index, 1);
    setCurrentData(newData);
    onLink(composeRelations(newData));
    setPluginDisabled(isPluginDisabled(newData));
  };

  return (
    <>
      <AssociatedList
        intl={intl}
        entityKey={entityKey}
        namespaceKey={namespaceKey}
        checkboxList={checkboxList}
        columnWidths={columnWidths}
        profileShape={profileShape}
        contentData={currentData}
        onSort={noop}
        onRemove={cur => {
          setCurrent(cur);
          setConfirmationOpen(true);
        }}
        className={css['list-editable']}
        isStatic={false}
        isEditMode={isEditMode}
        isMultiSelect
        {...dataAttributes}
      />
      <br />
      <Pluggable
        aria-haspopup="true"
        type="find-import-profile"
        id="clickable-find-import-profile"
        searchLabel={<FormattedMessage id="ui-data-import.settings.profile.select" />}
        searchButtonStyle="default"
        onLink={link}
        entityKey={entityKey}
        parentType={parentType}
        masterType={masterType}
        profileType={profileType}
        profileName={profileName}
        dataKey={entityKey}
        disabled={pluginDisabled}
        isSingleSelect={!isMultiSelect}
        isMultiLink={isMultiLink}
        marginTop0
        data-test-plugin-find-record-button
      >
        <span data-test-no-plugin-available>
          <FormattedMessage id="ui-data-import.find-import-profile-plugin-unavailable" />
        </span>
      </Pluggable>
      <ConfirmationModal
        id="confirm-edit-action-profile-modal"
        open={confirmationOpen}
        heading={<FormattedMessage id="ui-data-import.modal.profile.unlink.heading" />}
        message={(
          <FormattedMessage
            id="ui-data-import.modal.profile.unlink.message"
            values={{
              profileType1: <FormattedMessage id={`ui-data-import.${camelCase(parentType === masterType ? detailType : masterType)}Name`} />,
              profileType2: <FormattedMessage id={`ui-data-import.${camelCase(parentType)}Name`} />,
            }}
          />
        )}
        confirmLabel={<FormattedMessage id="ui-data-import.confirm" />}
        onConfirm={() => {
          setConfirmationOpen(false);
          remove(current);
        }}
        onCancel={() => setConfirmationOpen(false)}
      />
    </>
  );
});

AssociatorEditable.propTypes = {
  intl: PropTypes.object.isRequired,
  entityKey: PropTypes.string.isRequired,
  namespaceKey: PropTypes.string.isRequired,
  parentType: PropTypes.string.isRequired,
  masterType: PropTypes.string.isRequired,
  detailType: PropTypes.string.isRequired,
  profileType: PropTypes.string.isRequired,
  profileShape: PropTypes.object.isRequired,
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  profileName: PropTypes.string,
  contentData: PropTypes.arrayOf(PropTypes.object),
  isMultiSelect: PropTypes.bool,
  isMultiLink: PropTypes.bool,
  dataAttributes: PropTypes.shape(PropTypes.object),
  relationsToAdd: PropTypes.arrayOf(PropTypes.object),
  relationsToDelete: PropTypes.arrayOf(PropTypes.object),
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
  isEditMode: PropTypes.bool,
};

AssociatorEditable.defaultProps = {
  parentId: null,
  contentData: [],
  isMultiSelect: true,
  isEditMode: false,
  isMultiLink: true,
  dataAttributes: null,
  relationsToAdd: [],
  relationsToDelete: [],
  onLink: noop,
  onUnlink: noop,
};
