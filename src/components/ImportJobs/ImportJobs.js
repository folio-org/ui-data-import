import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import FileUploader from './components/FileUploader';

import css from './components/FileUploader/FileUploader.css';

class ImportJobs extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    isDropZoneActive: false,
    redirect: false,
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

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.setState({
      isDropZoneActive: false,
      acceptedFiles,
      rejectedFiles,
      redirect: true,
    });
  };

  getMessageById = (idEnding, moduleName = 'ui-data-import') => {
    const id = `${moduleName}.${idEnding}`;

    return <FormattedMessage id={id} />;
  };

  render() {
    const {
      acceptedFiles,
      rejectedFiles,
      redirect,
      isDropZoneActive,
    } = this.state;
    const { match } = this.props;
    const titleMessageIdEnding = isDropZoneActive ? 'activeUploadTitle' : 'uploadTitle';
    const titleText = this.getMessageById(titleMessageIdEnding);
    const uploadBtnText = this.getMessageById('uploadBtnText');

    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: `${match.path}/job-profile`,
            state: {
              acceptedFiles,
              rejectedFiles,
            },
          }}
        />
      );
    }

    return (
      <FileUploader
        title={titleText}
        uploadBtnText={uploadBtnText}
        isDropZoneActive={isDropZoneActive}
        className={css.upload}
        activeClassName={css.activeUpload}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      />
    );
  }
}

export default withRouter(ImportJobs);
