import React, {
  Fragment,
  memo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { noop } from 'lodash';
import classNames from 'classnames';

import {
  ConfirmationModal,
  IconButton,
} from '@folio/stripes-components';

import { listTemplate } from '../ListTemplate';

import css from './ProfileTree.css';

export const ProfileLabel = memo(({
  entityKey,
  recordData,
  linkingRules,
  record,
  className,
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

  const templates = listTemplate({ entityKey });
  const columns = columnsAllowed[entityKey];

  const handleUnlink = recordId => {
    setUnlinkConfirmationOpen(false);
    onUnlink(recordId);
  };

  const handleDelete = recordId => {
    setDeleteConfirmationOpen(false);
    onDelete(recordId);
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
                heading={<FormattedMessage id="ui-data-import.modal.profile.unlink.heading" />}
                message={(
                  <FormattedMessage
                    id="ui-data-import.modal.profile.unlink.message"
                    values={{ name: recordData.name }}
                  />
                )}
                confirmLabel={<FormattedMessage id="ui-data-import.unlink" />}
                onCancel={() => setUnlinkConfirmationOpen(false)}
                onConfirm={() => handleUnlink(recordData.id)}
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
                heading={<FormattedMessage id="ui-data-import.modal.profile.unlink.heading" />}
                message={(
                  <FormattedMessage
                    id="ui-data-import.modal.profile.delete.message"
                    values={{ name: recordData.name }}
                  />
                )}
                confirmLabel={<FormattedMessage id="ui-data-import.delete" />}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={() => handleDelete(recordData.id)}
              />
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
});

ProfileLabel.propTypes = {
  entityKey: PropTypes.string.isRequired,
  recordData: PropTypes.object.isRequired,
  linkingRules: PropTypes.object.isRequired,
  record: PropTypes.object,
  className: PropTypes.string,
  onUnlink: PropTypes.func,
  onDelete: PropTypes.func,
  dataAttributes: PropTypes.object,
};

ProfileLabel.defaultProps = {
  record: null,
  className: null,
  dataAttributes: null,
  onUnlink: noop,
  onDelete: noop,
};
