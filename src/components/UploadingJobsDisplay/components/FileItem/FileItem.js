import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { noop } from 'lodash';

import { Icon } from '@folio/stripes/components';

import { Progress } from '../../../Progress';
import * as fileStatuses from './fileItemStatuses';
import { getFileItemMeta } from './getFileItemMeta';

import css from './FileItem.css';

export class FileItem extends PureComponent {
  static propTypes = {
    uiKey: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    status: PropTypes.string,
    uploadedValue: PropTypes.number,
    errorMsgTranslationID: PropTypes.string,
    uploadedDate: PropTypes.string,
    loading: PropTypes.bool,
    onDelete: PropTypes.func,
    onUndoDelete: PropTypes.func,
  };

  static defaultProps = {
    status: fileStatuses.UPLOADING,
    uploadedValue: 0,
    errorMsgTranslationID: 'upload.invalid',
    uploadedDate: null,
    loading: false,
    onDelete: noop,
    onUndoDelete: noop,
  };

  progressPayload = { message: <FormattedMessage id="ui-data-import.uploadingMessage" /> };

  deleteFile = () => {
    const {
      uiKey,
      status,
      onDelete,
    } = this.props;

    onDelete(uiKey, status);
  };

  undoDeleteFile = () => {
    const {
      uiKey,
      onUndoDelete,
    } = this.props;

    onUndoDelete(uiKey);
  };

  render() {
    const {
      status,
      name,
      size,
      uploadedValue,
      errorMsgTranslationID,
      loading,
      uploadedDate,
    } = this.props;

    const meta = getFileItemMeta({
      status,
      name,
      errorMsgTranslationID,
      uploadedDate,
      loading,
      deleteFile: this.deleteFile,
      undoDeleteFile: this.undoDeleteFile,
    });

    return (
      <div className={classNames(css.fileItem, meta.fileWrapperClassName)}>
        <div className={css.fileItemHeader}>
          <span className={css.fileIcon}>
            <Icon
              size="small"
              icon="document"
            />
          </span>
          {meta.renderHeading()}
        </div>

        {meta.showProgress && (
          <Progress
            payload={this.progressPayload}
            progressInfoType="messagedPercentage"
            progressClassName={css.progress}
            progressWrapperClassName={css.progressWrapper}
            progressInfoClassName={css.progressInfo}
            total={size}
            current={uploadedValue}
          />
        )}
      </div>
    );
  }
}
