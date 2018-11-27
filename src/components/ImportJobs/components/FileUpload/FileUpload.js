import React from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import classNames from 'classnames/bind';

import { Button } from '@folio/stripes/components';

import initStyle from './initStyle.css';
import css from './FileUpload.css';

const cx = classNames.bind(css);

const getTitleClassName = dropZoneState => {
  return cx({
    uploadTitle: true,
    activeUploadTitle: dropZoneState,
  });
};

const getUsedStyle = (styleFromProps, classNameFromProps) => {
  return classNameFromProps ? null : styleFromProps;
};

const FileUpload = (props) => {
  const {
    title,
    uploadBtnText,
    accept,
    isDropZoneActive,
    className,
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
  } = props;

  const titleClassName = getTitleClassName(isDropZoneActive);
  const usedStyle = getUsedStyle(style, className);

  return (
    <ReactDropzone
      disableClick
      className={className}
      style={usedStyle}
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
        <React.Fragment>
          <span className={titleClassName}>{title}</span>
          <div hidden={isDropZoneActive}>
            <Button
              buttonStyle="primary"
              onClick={open}
            >
              {uploadBtnText}
            </Button>
          </div>
          <div hidden={isDropZoneActive}>
            {children}
          </div>
        </React.Fragment>
      )}
    </ReactDropzone>
  );
};

FileUpload.propTypes = {
  title: PropTypes.node.isRequired,
  uploadBtnText: PropTypes.node.isRequired,
  isDropZoneActive: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
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
  ]),
};

FileUpload.defaultProps = {
  className: initStyle.defaultFileUploader,
  activeClassName: '',
  acceptClassName: '',
  rejectClassName: '',
  disabledClassName: '',
  maxSize: null,
};

export default FileUpload;
