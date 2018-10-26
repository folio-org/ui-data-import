import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { Button } from '@folio/stripes/components';

import css from './FileUpload.css';

class FileUpload extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    uploadBtnText: PropTypes.string.isRequired,
  };

  render() {
    const {
      title,
      uploadBtnText,
    } = this.props;

    return (
      <div className={css.upload}>
        <span className={css.uploadTitle}>{title}</span>
        <Button
          buttonStyle="primary"
          onClick={noop}
        >
          {uploadBtnText}
        </Button>
      </div>
    );
  }
}

export default FileUpload;
