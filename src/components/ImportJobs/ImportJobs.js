import React from 'react';
import { FormattedMessage } from 'react-intl';

import FileUpload from './components/FileUpload';
import css from './components/FileUpload/FileUpload.css';


class ImportJobs extends React.Component {
  constructor() {
    super();
    this.state = {
      isDropZoneActive: false
    };
  }

  onDragEnter = () => {
    this.setState({ isDropZoneActive: true });
  };

  onDragLeave = () => {
    this.setState({ isDropZoneActive: false });
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log(acceptedFiles);
    this.setState({
      isDropZoneActive: false
    });
  };


  getTitleMessageId = () => {
    if (this.state.isDropZoneActive) {
      return 'ui-data-import.activeUploadTitle';
    }

    return 'ui-data-import.uploadTitle';
  };


  render() {
    return (
      <FileUpload
        title={<FormattedMessage id={this.getTitleMessageId()} />}
        uploadBtnText={<FormattedMessage id="ui-data-import.uploadBtnText" />}
        isDropZoneActive={this.state.isDropZoneActive}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        className={css.upload}
        activeClassName={css.activeUpload}
      />
    );
  }
}

export default ImportJobs;
