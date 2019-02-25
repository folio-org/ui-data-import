/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  every,
  isEmpty,
} from 'lodash';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import { FILE_STATUSES } from '../../utils/constants';
import {
  createUrl,
  createOkapiHeaders,
} from '../../utils';
import { UploadingJobsContext } from '.';

class UploadingJobsContextProviderComponent extends Component {
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
      uploadDefinition: {},
      updateUploadDefinition: this.updateUploadDefinition,
      deleteUploadDefinition: this.deleteUploadDefinition,
    };
  }

  deleteUploadDefinition = async () => {
    const { stripes: { okapi } } = this.props;
    const { uploadDefinition: { id: uploadDefinitionId } } = this.state;

    const { url: host } = okapi;
    const uploadDefinitionUrl = createUrl(`${host}/data-import/uploadDefinitions/${uploadDefinitionId}`);

    await fetch(uploadDefinitionUrl, {
      method: 'DELETE',
      headers: createOkapiHeaders(okapi),
    });
    await this.updateUploadDefinition();
  };

  updateUploadDefinition = async newUploadDefinition => {
    const uploadDefinition = newUploadDefinition || await this.getLatestUploadDefinition();

    if (this.isUploadDefinitionFailed(uploadDefinition)) {
      return this.deleteUploadDefinition();
    }

    this.setState({ uploadDefinition });

    return uploadDefinition;
  };

  isUploadDefinitionFailed(uploadDefinition) {
    if (isEmpty(uploadDefinition)) {
      return false;
    }

    const {
      status: uploadDefinitionStatus,
      fileDefinitions,
    } = uploadDefinition;
    const isErrorStatus = uploadDefinitionStatus === FILE_STATUSES.ERROR;
    const areAllFilesFailed = every(
      fileDefinitions,
      file => file.status === FILE_STATUSES.ERROR
    ) && !isEmpty(fileDefinitions);

    return isErrorStatus || areAllFilesFailed;
  }

  getLatestUploadDefinition = async () => {
    const { stripes: { okapi } } = this.props;

    const { url: host } = okapi;
    const statuses = {
      NEW: 'NEW',
      IN_PROGRESS: 'IN_PROGRESS',
      LOADED: 'LOADED',
    };
    const draftJobsUrl = createUrl(`${host}/data-import/uploadDefinitions`, {
      query: `(status==("${statuses.NEW}" OR "${statuses.IN_PROGRESS}" OR "${statuses.LOADED}")) sortBy createdDate/sort.descending`,
      limit: 1,
    });

    const response = await fetch(draftJobsUrl, {
      method: 'GET',
      headers: createOkapiHeaders(okapi),
    });
    const { uploadDefinitions: [latestUploadDefinition = {}] } = await response.json();

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

export const UploadingJobsContextProvider = withStripes(UploadingJobsContextProviderComponent);
