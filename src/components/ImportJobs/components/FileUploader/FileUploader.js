import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import classNames from 'classnames/bind';
import { isFunction } from 'lodash';

import {
  Icon,
  Button,
} from '@folio/stripes/components';

import defaultStyles from './defaultStyles.css';
import css from './FileUploader.css';

const cx = classNames.bind(css);

export const FileUploader = ({
  title,
  uploadButtonText,
  errorMessage,
  accept,
  isDropZoneActive,
  className = defaultStyles.defaultFileUploader,
  acceptClassName,
  activeClassName,
  rejectClassName,
  disabledClassName,
  maxSize,
  children,
  style,
  getDataTransferItems,
  onDrop,
  onDragEnter,
  onDragLeave,
}) => {
  const titleClassName = cx({
    uploadTitle: true,
    activeUploadTitle: isDropZoneActive,
  });

  return (
    <ReactDropzone
      disableClick
      className={className}
      style={style}
      activeClassName={activeClassName}
      accept={accept}
      acceptClassName={acceptClassName}
      rejectClassName={rejectClassName}
      disabledClassName={disabledClassName}
      maxSize={maxSize}
      getDataTransferItems={getDataTransferItems}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      {({ open }) => (
        <Fragment>
          {errorMessage && (
            <span
              hidden={isDropZoneActive}
              className={css.errorMessage}
            >
              <Icon icon="exclamation-circle">
                <span data-test-error-msg>{errorMessage}</span>
              </Icon>
            </span>
          )}
          <span
            className={titleClassName}
            data-test-title
          >
            {title}
          </span>
          <div hidden={isDropZoneActive}>
            <Button
              buttonStyle="primary"
              onClick={open}
            >
              {uploadButtonText}
            </Button>
          </div>
          <div hidden={isDropZoneActive}>
            {isFunction(children) ? children(open) : children}
          </div>
        </Fragment>
      )}
    </ReactDropzone>
  );
};

FileUploader.propTypes = {
  title: PropTypes.node.isRequired,
  uploadButtonText: PropTypes.node.isRequired,
  isDropZoneActive: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  errorMessage: PropTypes.node,
  className: PropTypes.string,
  acceptClassName: PropTypes.string,
  activeClassName: PropTypes.string,
  rejectClassName: PropTypes.string,
  disabledClassName: PropTypes.string,
  maxSize: PropTypes.number,
  style: PropTypes.object,
  getDataTransferItems: PropTypes.func,
  accept: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
};
