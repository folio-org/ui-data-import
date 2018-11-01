import React from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import { Button } from '@folio/stripes/components';

import classNames from 'classnames/bind';
import css from './FileUpload.css';


const cx = classNames.bind(css);

const FileUpload = (props) => {
  const {
    title,
    uploadBtnText,
    accept,
    onDrop,
    onDragEnter,
    onDragLeave,
    isDropZoneActive,
    className,
    acceptClassName,
    activeClassName,
    rejectClassName,
    disabledClassName,
    maxSize,
    getDataTransferItems,
    children,
    style
  } = props;

  const initStyle = {
    width: '300px',
    height: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    border: '1px solid black'
  };

  const getTitleClassName = dropZoneState => {
    return cx({
      uploadTitle: true,
      activeUploadTitle: dropZoneState
    });
  };

  const getUsedStyle = (styleFromProps, classNameFromProps, initialStyle) => {
    if (styleFromProps) return styleFromProps;
    if (!styleFromProps && classNameFromProps) return null;

    return initialStyle;
  };

  const titleClassName = getTitleClassName(isDropZoneActive);


  const usedStyle = getUsedStyle(style, className, initStyle);


  return (
    <ReactDropzone
      className={className || null}
      style={usedStyle}
      activeClassName={activeClassName}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      disableClick
      accept={accept}
      acceptClassName={acceptClassName}
      rejectClassName={rejectClassName}
      disabledClassName={disabledClassName}
      maxSize={maxSize}
      getDataTransferItems={getDataTransferItems}
    >
      {({ open }) => (
        <React.Fragment>
          {children}
          <span className={titleClassName}>{title}</span>
          {!isDropZoneActive &&
          <Button
            buttonStyle="primary"
            onClick={() => open()}
          >
            {uploadBtnText}
          </Button>}
        </React.Fragment>
      )}
    </ReactDropzone>
  );
};

FileUpload.propTypes = {
  title: PropTypes.string.isRequired,
  uploadBtnText: PropTypes.string.isRequired,
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
    PropTypes.arrayOf(PropTypes.string)
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default FileUpload;
