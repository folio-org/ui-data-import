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
    onDelete: PropTypes.func,
    onUndoDelete: PropTypes.func,
    uploadedValue: PropTypes.number,
    status: PropTypes.string,
    uploadDate: PropTypes.instanceOf(Date),
  };

  static defaultProps = {
    uploadedValue: 0,
    status: fileStatuses.UPLOADING,
    onDelete: noop,
    onUndoDelete: noop,
    uploadDate: null,
  };

  progressPayload = {
    message: <FormattedMessage id="ui-data-import.uploadingMessage" />,
  };

  deleteFile = () => {
    const {
      onDelete,
      keyName,
    } = this.props;

    onDelete(keyName);
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
    } = this.props;

    const meta = getFileItemMeta({
      status,
      name,
      uploadDate,
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
