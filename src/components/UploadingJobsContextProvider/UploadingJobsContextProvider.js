/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import {
  createUrl,
  createOkapiHeaders,
} from '../../utils';
import { UploadingJobsContext } from '.';

class UploadingJobsContextProvider extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      files: null, // TODO: change with []
      setFiles: this.setFiles,
      uploadDefinition: null, // TODO: change with {}
      updateUploadDefinition: this.updateUploadDefinition,
      deleteUploadDefinition: this.deleteUploadDefinition,
    };
  }

  setFiles = files => {
    this.setState({ files });
  };

  deleteUploadDefinition = async () => {
    const { stripes: { okapi } } = this.props;
    const { uploadDefinition: { id: uploadDefinitionId } } = this.state;

    const { url: host } = okapi;
    const uploadDefinitionUrl = createUrl(`${host}/data-import/upload/definition/${uploadDefinitionId}`);

    await fetch(uploadDefinitionUrl, {
      method: 'DELETE',
      headers: createOkapiHeaders(okapi),
    });
    await this.updateUploadDefinition();
  };

  updateUploadDefinition = async newUploadDefinition => {
    const uploadDefinition = newUploadDefinition || await this.getLatestUploadDefinition();

    this.setState({ uploadDefinition });
  };

  getLatestUploadDefinition = async () => {
    const { stripes: { okapi } } = this.props;

    const { url: host } = okapi;
    const statuses = {
      NEW: 'NEW',
      IN_PROGRESS: 'IN_PROGRESS',
      LOADED: 'LOADED',
    };
    const draftJobsUrl = createUrl(`${host}/data-import/upload/definition`, {
      query: `(status==("${statuses.NEW}" OR "${statuses.IN_PROGRESS}" OR "${statuses.LOADED}")) sortBy createdDate/sort.descending`,
      limit: 1,
    });

    const response = await fetch(draftJobsUrl, {
      method: 'GET',
      headers: createOkapiHeaders(okapi),
    });
    const { uploadDefinitions: [latestUploadDefinition] } = await response.json();

    return latestUploadDefinition;
  };

  render() {
    const { children } = this.props;

    return (
      <UploadingJobsContext.Provider value={this.state}>
        {children}
      </UploadingJobsContext.Provider>
    );
  }
}

export default withStripes(UploadingJobsContextProvider);
