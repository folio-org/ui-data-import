import React, {
  PureComponent,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedDate,
} from 'react-intl';
import classNames from 'classnames';
import noop from 'lodash/noop';

import {
  Icon,
  IconButton,
} from '@folio/stripes/components';

import * as fileStatuses from './fileItemStatuses';
import Progress from '../../../Progress';

import css from './FileItem.css';

const getFileItemMeta = props => {
  const {
    status,
    name,
    uploadDate,
    deleteFile,
    undoDeleteFile,
  } = props;

  const defaultFileMeta = {
    showProgress: false,
    renderHeading: () => (
      <Fragment>
        <span>{name}</span>
      </Fragment>
    ),
  };

  const fileTypesMeta = {
    [fileStatuses.UPLOADING]: {
      fileWrapperClassName: css.fileItemUploading,
      showProgress: true,
    },
    [fileStatuses.UPLOADED]: {
      renderHeading: () => (
        <Fragment>
          <span className={css.fileItemHeaderName}>{name}</span>
          <span className={classNames(css.fileItemHeaderContent, css.fileItemUploadedHeaderContent)}>
            <FormattedDate value={uploadDate} />
          </span>
          <IconButton
            icon="trash"
            size="small"
            title={<FormattedMessage id="ui-data-import.delete" />}
            className={css.icon}
            onClick={deleteFile}
          />
        </Fragment>
      ),
    },
    [fileStatuses.FAILED]: {
      fileWrapperClassName: classNames(css.fileItemDanger, css.fileItemFailed),
      renderHeading: () => (
        <Fragment>
          <span className={css.fileItemHeaderName}>{name}</span>
          <span className={css.fileItemHeaderContent}>
            <Icon icon="exclamation-circle">
              <FormattedMessage id="ui-data-import.uploadFileError" />
            </Icon>
          </span>
          <IconButton
            icon="times"
            size="small"
            title={<FormattedMessage id="ui-data-import.delete" />}
            className={css.icon}
          />
        </Fragment>
      ),
    },
    [fileStatuses.DELETING]: {
      fileWrapperClassName: css.fileItemDanger,
      renderHeading: () => (
        <Fragment>
          <span className={css.fileItemHeaderName}>
            <FormattedMessage
              id="ui-data-import.deletedFile"
              values={{ name: <strong>{name}</strong> }}
            />
          </span>
          <button
            type="button"
            className={classNames(css.icon, css.undoIcon)}
            onClick={undoDeleteFile}
          >
            <FormattedMessage id="ui-data-import.undo" />
          </button>
        </Fragment>
      ),
    },
  };

  return {
    ...defaultFileMeta,
    ...fileTypesMeta[status],
  };
};

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
