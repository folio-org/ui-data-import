import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

import { Icon } from '@folio/stripes/components';

import { FILE_STATUSES } from '../../../../utils/constants';
import { getFileItemMeta } from './getFileItemMeta';

import css from './FileItem.css';

export const FileItem = memo(props => {
  const {
    uiKey,
    status,
    onDelete,
    onUndoDelete,
    name,
    isSnapshotMode,
    size,
    uploadedValue,
    errorMsgTranslationID,
    uploadedDate,
    loading,
  } = props;

  const deleteFile = () => onDelete(uiKey, status);
  const undoDeleteFile = () => onUndoDelete(uiKey);

  const meta = getFileItemMeta({
    name,
    isSnapshotMode,
    size,
    uploadedValue,
    status,
    errorMsgTranslationID,
    uploadedDate,
    loading,
    deleteFile,
    undoDeleteFile,
  });

  return (
    <div
      data-test-file-item
      className={classNames(css.fileItem, meta.fileWrapperClassName)}
    >
      <div className={css.fileItemHeader}>
        <span className={css.fileIcon}>
          <Icon
            size="small"
            icon="document"
          />
        </span>
        {meta.renderHeading()}
      </div>

      {meta.renderProgress()}
    </div>
  );
});

FileItem.propTypes = {
  uiKey: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  isSnapshotMode: PropTypes.bool,
  status: PropTypes.string,
  uploadedValue: PropTypes.number,
  errorMsgTranslationID: PropTypes.string,
  uploadedDate: PropTypes.string,
  loading: PropTypes.bool,
  onDelete: PropTypes.func,
  onUndoDelete: PropTypes.func,
};

FileItem.defaultProps = {
  isSnapshotMode: false,
  status: FILE_STATUSES.UPLOADING,
  uploadedValue: 0,
  errorMsgTranslationID: 'upload.invalid',
  uploadedDate: null,
  loading: false,
  onDelete: noop,
  onUndoDelete: noop,
};
