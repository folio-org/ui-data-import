import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

import { Icon } from '@folio/stripes/components';

import { FILE_STATUSES } from '../../../../utils';
import { getFileItemMeta } from './getFileItemMeta';

import css from './FileItem.css';

export const FileItem = memo(({
  uiKey,
  status = FILE_STATUSES.UPLOADING,
  onCancel,
  onDelete = noop,
  name,
  isSnapshotMode = false,
  size,
  uploadedValue = 0,
  errorMsgTranslationID = 'upload.invalid',
  uploadedDate = null,
  loading = false,
}) => {
  const deleteFile = () => onDelete(uiKey, status);
  const cancelImport = () => onCancel(uiKey);

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
    cancelImport,
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
  onCancel: PropTypes.func,
};
