import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { noop } from 'lodash';

import {
  Icon,
  IconButton,
  FormattedDate,
} from '@folio/stripes/components';
import { Progress } from '@folio/stripes-data-transfer-components';

import { FILE_STATUSES } from '../../../../utils';

import css from './FileItem.css';

const Loading = () => (
  <FormattedMessage id="ui-data-import.loading">
    {label => (
      <span
        data-test-preloader
        className={css.icon}
      >
        <Icon
          icon="spinner-ellipsis"
          size="small"
          ariaLabel={label}
        />
      </span>
    )}
  </FormattedMessage>
);

export const getFileItemMeta = ({
  isSnapshotMode,
  size,
  uploadedValue,
  status,
  name,
  errorMsgTranslationID,
  uploadedDate,
  loading,
  deleteFile,
  cancelImport,
}) => {
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
          <div
            data-test-progress
            className={css.progressMessage}
          >
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
              <div
                data-test-progress
                className={css.progressMessage}
              >
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
    case FILE_STATUSES.UPLOADING_CANCELLABLE: {
      return {
        ...defaultFileMeta,
        renderHeading: () => (
          <>
            <span className={css.fileItemHeaderName}>{name}</span>
            <FormattedMessage id="ui-data-import.delete">
              {label => (
                <IconButton
                  data-test-delete-button
                  icon="trash"
                  size="small"
                  ariaLabel={label}
                  className={css.icon}
                  onClick={cancelImport}
                />
              )}
            </FormattedMessage>
          </>
        ),
        renderProgress: () => {
          if (isSnapshotMode) {
            return (
              <div
                data-test-progress
                className={css.progressMessage}
              >
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
          <>
            <span className={css.fileItemHeaderName}>{name}</span>
            <span className={classNames(css.fileItemHeaderContent, css.fileItemUploadedHeaderContent)}>
              <FormattedDate value={uploadedDate} />
            </span>
            <FormattedMessage id="ui-data-import.delete">
              {label => (
                <IconButton
                  data-test-delete-button
                  icon="trash"
                  size="small"
                  ariaLabel={label}
                  className={css.icon}
                  onClick={cancelImport}
                />
              )}
            </FormattedMessage>
          </>
        ),
      };
    }
    case FILE_STATUSES.ERROR:
    case FILE_STATUSES.ERROR_DEFINITION: {
      return {
        ...defaultFileMeta,
        fileWrapperClassName: classNames(css.fileItemDanger, css.fileItemFailed),
        renderHeading: () => (
          <>
            <span className={css.fileItemHeaderName}>{name}</span>
            <span className={css.fileItemHeaderContent}>
              <FormattedMessage id={`ui-data-import.${errorMsgTranslationID}`}>
                {content => (
                  <>
                    <Icon icon="exclamation-circle" /> <span data-test-error-msg>{content}</span>
                  </>
                )}
              </FormattedMessage>
            </span>
            {!loading
              ? (
                <FormattedMessage id="ui-data-import.delete">
                  {label => (
                    <IconButton
                      data-test-delete-button
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
          </>
        ),
      };
    }
    case FILE_STATUSES.DELETING: {
      return {
        ...defaultFileMeta,
        fileWrapperClassName: css.fileItemDanger,
        renderHeading: () => (
          <span className={css.fileItemHeaderName}>
            <FormattedMessage
              id="ui-data-import.willDeleteFile"
              values={{ name: <strong>{name}</strong> }}
            />
          </span>
        ),
      };
    }
    /* istanbul ignore next */
    default: {
      return defaultFileMeta;
    }
  }
};
