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
  withOkapiKy,
} from '@folio/stripes/core';
import { createUrl } from '@folio/stripes-data-transfer-components';

import { FILE_STATUSES } from '../../utils/constants';
import { getStorageConfiguration } from '../../utils/multipartUpload';
import * as API from '../../utils/upload';
import { UploadingJobsContext } from '.';

@withStripes
@withOkapiKy
export class UploadingJobsContextProvider extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    okapiKy: PropTypes.func.isRequired,
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
      uploadConfiguration: {},
    };
  }

  componentDidMount = () => {
    this.getUploadConfiguration();
  }

  getUploadConfiguration = async () => {
    const { okapiKy } = this.props;
    const { splitStatus } = await getStorageConfiguration(okapiKy);
    this.setState({
      uploadConfiguration: {
        canUseObjectStorage: splitStatus
      }
    });
  }

  deleteUploadDefinition = async () => {
    const { stripes: { okapi } } = this.props;
    const { uploadDefinition: { id: uploadDefinitionId } } = this.state;

    const { url: host } = okapi;

    await API.deleteUploadDefinition({
      url: createUrl(`${host}/data-import/uploadDefinitions/${uploadDefinitionId}`),
      okapi,
    });

    await this.updateUploadDefinition();
  };

  updateUploadDefinition = async newUploadDefinition => {
    const uploadDefinition = newUploadDefinition || await this.getLatestUploadDefinition();

    this.setState({ uploadDefinition });

    if (this.isUploadDefinitionFailed(uploadDefinition)) {
      return this.deleteUploadDefinition();
    }

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
      file => file.status === FILE_STATUSES.ERROR,
    ) && !isEmpty(fileDefinitions);

    return isErrorStatus || areAllFilesFailed;
  }

  getLatestUploadDefinition = () => {
    const { stripes: { okapi } } = this.props;

    const { url: host } = okapi;

    return API.getLatestUploadDefinition({
      url: `${host}/data-import/uploadDefinitions`,
      okapi,
    });
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
