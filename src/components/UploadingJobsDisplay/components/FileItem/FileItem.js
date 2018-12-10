import React, {
  PureComponent,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import {
  Icon,
  IconButton,
} from '@folio/stripes/components';

import {
  UPLOADED,
  UPLOADING,
  FAILED,
} from './fileItemStatuses';
import Progress from '../../../Progress';

import css from './FileItem.css';

const getFileItemMeta = (props) => {
  const {
    uploadStatus,
    name,
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
    [UPLOADING]: {
      showProgress: true,
      renderHeading: () => (
        <Fragment>
          <span>{name}</span>
        </Fragment>
      ),
    },
    [UPLOADED]: {
      renderHeading: () => (
        <Fragment>
          <span>{name}</span>
        </Fragment>
      ),
    },
    [FAILED]: {
      fileWrapperClassName: css.fileItemFailed,
      renderHeading: () => (
        <Fragment>
          <span className={css.fileItemHeaderName}>{name}</span>
          <span>
            <Icon icon="exclamation-circle">
              <FormattedMessage id="ui-data-import.uploadFileError" />
            </Icon>
          </span>
          <IconButton
            icon="times"
            title={<FormattedMessage id="ui-data-import.delete" />}
            size="small"
            className={css.icon}
          />
        </Fragment>
      ),
    },
  };

  return {
    ...defaultFileMeta,
    ...fileTypesMeta[uploadStatus],
  };
};

class FileItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    uploadedValue: PropTypes.number,
    uploadStatus: PropTypes.string,
  };

  static defaultProps = {
    uploadedValue: 0,
    uploadStatus: UPLOADING,
  };

  progressPayload = {
    message: <FormattedMessage id="ui-data-import.uploadingMessage" />,
  };

  render() {
    const {
      uploadedValue,
      size,
      uploadStatus,
      name,
    } = this.props;

    const meta = getFileItemMeta({
      uploadStatus,
      name,
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
