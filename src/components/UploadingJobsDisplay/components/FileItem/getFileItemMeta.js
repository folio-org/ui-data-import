import React, { Fragment } from 'react';
import {
  FormattedMessage,
  FormattedDate,
} from 'react-intl';
import classNames from 'classnames';

import {
  Icon,
  IconButton,
} from '@folio/stripes/components';

import * as fileStatuses from './fileItemStatuses';

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
        <span className={css.fileItemHeaderName}>{name}</span>
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
          <FormattedMessage id="ui-data-import.delete">
            {label => (
              <IconButton
                icon="trash"
                size="small"
                ariaLabel={label}
                className={css.icon}
                onClick={deleteFile}
              />
            )}
          </FormattedMessage>
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
          <FormattedMessage id="ui-data-import.delete">
            {label => (
              <IconButton
                icon="times"
                size="small"
                ariaLabel={label}
                className={css.icon}
              />
            )}
          </FormattedMessage>
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

export default getFileItemMeta;
