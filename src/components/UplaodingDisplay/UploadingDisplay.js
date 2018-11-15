import React, {Component} from 'react';
import FileStatus from './FileStatus';

export default class UploadingDisplay extends Component {
  state = {
    files: [
      {
        id: 1,
        name: 'File 1',
        toDelete: false
      },
      {
        id: 2,
        name: '2nd file',
        toDelete: false
      },
    ]
  };

  renderFiles(files) {
    return files.map(file => {
      return <FileStatus name={file.name} id={file.id} key={file.id}/>;
    });
  }

  render() {
    const {files} = this.state;

    return (
      <div>
        {this.renderFiles(files)}
      </div>
    );
  }
}
