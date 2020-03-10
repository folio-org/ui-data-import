import React, {
  Fragment,
  memo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  isEmpty,
  camelCase,
  noop,
} from 'lodash';
import classNames from 'classnames';

import {
  ConfirmationModal,
  IconButton,
} from '@folio/stripes-components';

import {
  PROFILE_RELATION_TYPES,
  PROFILE_TYPES,
} from '../../utils/constants';

import { listTemplate } from '../ListTemplate';

import css from './ProfileTree.css';

export const ProfileLabel = memo(({
  label,
  reactTo,
  linkingRules,
  className,
  recordData,
  record,
  parentRecordData,
  parentSectionKey,
  parentSectionData,
  setParentSectionData,
  onUnlink,
  onDelete,
  dataAttributes,
}) => {
  const {
    columnsAllowed,
    allowDelete,
    allowUnlink,
  } = linkingRules;

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [unlinkConfirmationOpen, setUnlinkConfirmationOpen] = useState(false);

  const { contentType: recordType } = recordData;
  const {
    contentType: parentType,
    id: parentId,
  } = parentRecordData;

  const entityKey = `${camelCase(recordType)}s`;
  const templates = listTemplate({
    entityKey,
    customValue: label,
  });
  const columns = columnsAllowed[entityKey];

  const hasChildren = () => {
    const children = recordData.childSnapshotWrappers;

    return !isEmpty(children) && !children.some(child => child.contentType === PROFILE_TYPES.MAPPING_PROFILE);
  };

  const handleUnlink = () => {
    setUnlinkConfirmationOpen(false);
    onUnlink(parentSectionData, setParentSectionData, recordData, parentId, parentType, recordType, reactTo, parentSectionKey);
  };

  const handleDelete = () => {
    setDeleteConfirmationOpen(false);
    onDelete(parentSectionData, setParentSectionData, recordData, parentId, parentType, recordType, reactTo, parentSectionKey);
  };

  return (
    <div
      id={`branch-${record ? 'editable' : 'static'}-${recordData.id}`}
      className={classNames(css['profile-label'], className)}
      {...dataAttributes}
    >
      <div className={css['record-container']}>
        {columns && columns.length && columns.map((item, i) => {
          const needSeparator = i < columns.length - 1;

          return (
            <Fragment>
              <span key={`label-item-${i}`}>{templates[item](recordData)}</span>
              {needSeparator && <span>&nbsp;&middot;&nbsp;</span>}
            </Fragment>
          );
        })}
      </div>
      {!record && (allowDelete || allowUnlink) && (
        <div className={css['buttons-container']}>
          {allowUnlink && (
            <Fragment>
              <IconButton
                data-test-profile-unlink
                icon="unlink"
                iconSize="medium"
                buttonStyle="default"
                marginBottom0
                onClick={() => setUnlinkConfirmationOpen(true)}
              />
              <ConfirmationModal
                id="unlink-job-profile-modal"
                open={unlinkConfirmationOpen}
                heading={(
                  <FormattedMessage
                    id="ui-data-import.modal.profile.unlink.heading"
                    values={{
                      severity: (
                        <FormattedMessage
                          id="ui-data-import.warning"
                          tagName="strong"
                        />
                      ),
                    }}
                  />
                )}
                message={(
                  <FormattedMessage
                    id={`ui-data-import.modal.jobProfiles.unlink.message.${hasChildren() ? 'children' : 'single'}`}
                    values={{ name: recordData.content.name }}
                  />
                )}
                confirmLabel={<FormattedMessage id="ui-data-import.unlink" />}
                onCancel={() => setUnlinkConfirmationOpen(false)}
                onConfirm={handleUnlink}
              />
            </Fragment>
          )}
          {allowDelete && (
            <Fragment>
              <IconButton
                data-test-profile-delete
                icon="trash"
                iconSize="medium"
                buttonStyle="default"
                marginBottom0
                onClick={() => setDeleteConfirmationOpen(true)}
              />
              <ConfirmationModal
                id="delete-job-profile-modal"
                open={deleteConfirmationOpen}
                heading={(
                  <FormattedMessage
                    id="ui-data-import.modal.profile.unlink.heading"
                    values={{
                      severity: (
                        <FormattedMessage
                          id="ui-data-import.warning"
                          tagName="strong"
                        />
                      ),
                    }}
                  />
                )}
                message={(
                  <FormattedMessage
                    id={`ui-data-import.modal.jobProfiles.delete.message.${hasChildren() ? 'children' : 'single'}`}
                    values={{ name: recordData.content.name }}
                  />
                )}
                confirmLabel={<FormattedMessage id="ui-data-import.delete" />}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
              />
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
});

ProfileLabel.propTypes = {
  linkingRules: PropTypes.object.isRequired,
  recordData: PropTypes.object.isRequired,
  parentRecordData: PropTypes.object.isRequired,
  parentSectionKey: PropTypes.string.isRequired,
  parentSectionData: PropTypes.arrayOf(PropTypes.object).isRequired,
  setParentSectionData: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  reactTo: PropTypes.string,
  record: PropTypes.object,
  className: PropTypes.string,
  onUnlink: PropTypes.func,
  onDelete: PropTypes.func,
  dataAttributes: PropTypes.object,
};

ProfileLabel.defaultProps = {
  reactTo: PROFILE_RELATION_TYPES.NONE,
  record: null,
  className: null,
  dataAttributes: null,
  onUnlink: noop,
  onDelete: noop,
};
