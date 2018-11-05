import React, { Component } from 'react';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import FileUpload from './components/FileUpload';

import css from './components/FileUpload/FileUpload.css';

class ImportJobs extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };

  state = {
    isDropZoneActive: false,
  };

  onDragEnter = () => {
    this.setState({
      isDropZoneActive: true,
    });
  };

  onDragLeave = () => {
    this.setState({
      isDropZoneActive: false,
    });
  };

  onDrop = () => {
    this.setState({
      isDropZoneActive: false,
    });
  };

  getMessageById = (idEnding, moduleName = 'ui-data-import') => {
    const id = `${moduleName}.${idEnding}`;

    return this.props.intl.formatMessage({ id });
  };

  render() {
    const titleMessageIdEnding = this.state.isDropZoneActive ? 'activeUploadTitle' : 'uploadTitle';
    const titleText = this.getMessageById(titleMessageIdEnding);
    const uploadBtnText = this.getMessageById('uploadBtnText');

    return (
      <FileUpload
        title={titleText}
        uploadBtnText={uploadBtnText}
        isDropZoneActive={this.state.isDropZoneActive}
        className={css.upload}
        activeClassName={css.activeUpload}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      />
    );
  }
}

export default injectIntl(ImportJobs);
