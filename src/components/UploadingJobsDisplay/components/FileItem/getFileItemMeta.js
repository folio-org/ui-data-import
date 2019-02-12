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

const Loading = () => (
  <FormattedMessage id="ui-data-import.loading">
    {label => (
      <span className={css.icon}>
        <Icon
          icon="spinner-ellipsis"
          size="small"
          ariaLabel={label}
        />
      </span>
    )}
  </FormattedMessage>
);

export const getFileItemMeta = props => {
  const {
    status,
    name,
    errorMsgTranslationID,
    uploadedDate,
    loading,
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
            <FormattedDate value={uploadedDate} />
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
            <FormattedMessage id={`ui-data-import.${errorMsgTranslationID}`}>
              {content => (
                <Fragment>
                  <Icon icon="exclamation-circle" /> {content}
                </Fragment>
              )}
            </FormattedMessage>
          </span>
          {!loading
            ? (
              <FormattedMessage id="ui-data-import.delete">
                {label => (
                  <IconButton
                    icon="times"
                    size="small"
                    ariaLabel={label}
                    className={css.icon}
                    onClick={deleteFile}
                  />
                )}
              </FormattedMessage>
            )
            : <Loading />
          }
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
          {!loading
            ? (
              <button
                type="button"
                className={classNames(css.icon, css.undoIcon)}
                onClick={undoDeleteFile}
              >
                <FormattedMessage id="ui-data-import.undo" />
              </button>
            )
            : <Loading />
          }
        </Fragment>
      ),
    },
  };

  fileTypesMeta[fileStatuses.FAILED_DEFINITION] = fileTypesMeta[fileStatuses.FAILED];

  return {
    ...defaultFileMeta,
    ...fileTypesMeta[status],
  };
};
