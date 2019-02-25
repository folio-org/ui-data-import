import React, { Fragment } from 'react';
import {
  FormattedMessage,
  FormattedDate,
} from 'react-intl';
import classNames from 'classnames';
import { noop } from 'lodash';

import {
  Icon,
  IconButton,
} from '@folio/stripes/components';
import { FILE_STATUSES } from '../../../../utils/constants';

import { Progress } from '../../../Progress';

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
    isSnapshotMode,
    size,
    uploadedValue,
    status,
    name,
    errorMsgTranslationID,
    uploadedDate,
    loading,
    deleteFile,
    undoDeleteFile,
  } = props;

  const defaultFileMeta = {
    renderProgress: noop,
    renderHeading: () => <span className={css.fileItemHeaderName}>{name}</span>,
  };

  switch (status) {
    case FILE_STATUSES.NEW: {
      return {
        ...defaultFileMeta,
        fileWrapperClassName: css.fileItemUploading,
        renderProgress: () => (
          <div className={css.progressMessage}>
            <FormattedMessage id="ui-data-import.waitingForUpload" />
          </div>
        ),
      };
    }
    case FILE_STATUSES.UPLOADING: {
      return {
        ...defaultFileMeta,
        fileWrapperClassName: css.fileItemUploading,
        renderProgress: () => {
          if (isSnapshotMode) {
            return (
              <div className={css.progressMessage}>
                <FormattedMessage id="ui-data-import.uploadingMessage" />
              </div>
            );
          }

          return (
            <Progress
              payload={{ message: <FormattedMessage id="ui-data-import.uploadingMessage" /> }}
              progressInfoType="messagedPercentage"
              progressClassName={css.progress}
              progressWrapperClassName={css.progressWrapper}
              progressInfoClassName={css.progressInfo}
              total={size}
              current={uploadedValue}
            />
          );
        },
      };
    }
    case FILE_STATUSES.UPLOADED: {
      return {
        ...defaultFileMeta,
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
      };
    }
    case FILE_STATUSES.ERROR:
    case FILE_STATUSES.ERROR_DEFINITION: {
      return {
        ...defaultFileMeta,
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
      };
    }
    case FILE_STATUSES.DELETING: {
      return {
        ...defaultFileMeta,
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
      };
    }
    default: {
      return defaultFileMeta;
    }
  }
};
