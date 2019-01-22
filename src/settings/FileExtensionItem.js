import React, { Component } from 'react';

class FileExtensionItem extends Component {
  static manifest = {
    selectedRequest: {
      type: 'okapi',
      path: 'circulation/requests/:{id}',
    },
  };

  render() {
    return <div>Detail</div>;
  }
}

export default FileExtensionItem;
