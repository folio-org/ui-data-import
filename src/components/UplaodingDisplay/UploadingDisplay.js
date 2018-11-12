import React, { Component } from 'react';

export default class UploadingDisplay extends Component {
  state = {
    files: [],
  };

  componentDidMount = () => {

  }

  //on click
  

  render() {
    return (
      <div>
        <div>
          Uploading item |
          <span>close</span>
        </div>
      </div>
    );
  }
}
