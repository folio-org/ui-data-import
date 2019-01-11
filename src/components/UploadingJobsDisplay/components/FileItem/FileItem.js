import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { noop } from 'lodash';

import { Icon } from '@folio/stripes/components';

import * as fileStatuses from './fileItemStatuses';
import getFileItemMeta from './getFileItemMeta';
import Progress from '../../../Progress';

import css from './FileItem.css';

class FileItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    keyName: PropTypes.string.isRequired,
    status: PropTypes.string,
    loading: PropTypes.bool,
    uploadedValue: PropTypes.number,
    uploadDate: PropTypes.instanceOf(Date),
    onDelete: PropTypes.func,
    onUndoDelete: PropTypes.func,
  };

  static defaultProps = {
    status: fileStatuses.UPLOADING,
    uploadedValue: 0,
    uploadDate: null,
    loading: false,
    onDelete: noop,
    onUndoDelete: noop,
  };

  progressPayload = {
    message: <FormattedMessage id="ui-data-import.uploadingMessage" />,
  };

  deleteFile = () => {
    const {
      keyName,
      status,
      onDelete,
    } = this.props;

    onDelete(keyName, status);
  };

  undoDeleteFile = () => {
    const {
      onUndoDelete,
      keyName,
    } = this.props;

    onUndoDelete(keyName);
  };

  render() {
    const {
      status,
      size,
      name,
      uploadDate,
      uploadedValue,
      loading,
    } = this.props;

    const meta = getFileItemMeta({
      status,
      name,
      uploadDate,
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

export default FileItem;
