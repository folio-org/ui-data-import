import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Headline,
} from '@folio/stripes/components';

import { TitleManager } from '@folio/stripes/core';

import Preloader from '../../components/Preloader';

// TODO: view component will be developed in UIDATIMP-61
class ViewFileExtension extends Component {
  static manifest = Object.freeze({
    fileExtension: {
      type: 'okapi',
      path: 'metadata-provider/fileExtension/:{id}',
      throwErrors: false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      fileExtension: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.shape({
            extension: PropTypes.string.isRequired,
          }),
        ),
      }),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  renderSpinner() {
    const { onClose } = this.props;

    return (
      <Pane
        id="pane-file-extension-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle=""
        dismissible
        onClose={onClose}
      >
        <Preloader />
      </Pane>
    );
  }

  get fileExtensionData() {
    const {
      resources,
      match: { params },
    } = this.props;

    const fileExtension = resources.fileExtension || {};
    const records = fileExtension.records || [];

    return {
      hasLoaded: fileExtension.hasLoaded,
      record: records.find(record => record.id === params.id),
    };
  }

  render() {
    const { onClose } = this.props;

    const {
      hasLoaded,
      record,
    } = this.fileExtensionData;

    if (!record) {
      return this.renderSpinner();
    }

    return (
      <Pane
        id="pane-file-extension-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={record.extension}
        paneSub={<FormattedMessage id="ui-data-import.settings.fileExtension.title" />}
        dismissible
        onClose={onClose}
      >
        {hasLoaded && (
          <Fragment>
            <TitleManager record={record.extension} />
            <Headline
              size="xx-large"
              tag="h2"
            >
              {record.extension}
            </Headline>
          </Fragment>
        )}
      </Pane>
    );
  }
}

export default ViewFileExtension;
