import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStripes } from '@folio/stripes/core';

import FileItem from './components/FileItem';


class UploadingDisplay extends Component {
  static propTypes = {
    initState: PropTypes.object.isRequired,
    stripes: PropTypes.object,
  }

  // static manifest = {
  //   type: 'okapi'
  // }

  static mapFilesFromProps = (props, status) => {
    return props.initState ? props.initState[status].map(UploadingDisplay.setInitStatus) : undefined;
  }

  static setInitStatus = file => {
    return Object.assign(file, { id: 'bla' });
  }

  state = {
    acceptedFiles: UploadingDisplay.mapFilesFromProps(this.props, 'acceptedFiles'),
    rejectedFiles: UploadingDisplay.mapFilesFromProps(this.props, 'rejectedFiles'), // it migth be needed in further stories
  };

  componentDidMount() {
    console.log(this.props.stripes);
    this.post();
  }

  post() {
    const obj = { fileDefinitions: [{ name: 'bla' }] };

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'X-Okapi-Tenant': 'diku',
        'cache-control': 'no-cache',
        'X-Okapi-Token': this.props.stripes.okapi.token
      },
      body: JSON.stringify(obj)
    };

    fetch('/data-import/upload/definition', config)
      .then(res => console.log(res))
      .then(console.log);
  }

  render() {
    console.log(this.props.stripes);

    const {
      acceptedFiles,
    } = this.state;

    return (
      <div>
        {acceptedFiles && acceptedFiles.map(file => {
          const { name, isUploaded } = file;

          return (
            <FileItem
              name={name}
              isUploaded={isUploaded}
            />
          );
        })}
      </div>
    );
  }
}

export default withStripes(UploadingDisplay);
